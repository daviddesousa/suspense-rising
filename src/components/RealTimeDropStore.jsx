import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

/**
 * Real-time Drop Component
 *
 * Logic Flow:
 * 1. Initialize 30 variants (Numbered 1-30).
 * 2. Subscribe to Real-time DB (Firebase/Supabase mock) for variant status.
 * 3. Handle 'Roll' animation using GSAP.
 * 4. Update UI using Framer Motion for smooth entry/exit states.
 */
const TOTAL_VARIANTS = 30;

const RealTimeDropStore = ({ onBuy, isLoading, onRoll }) => {
  // Mock State for variants
  // In production, this would come from a Firebase listener

  const [variants, setVariants] = useState(
    Array.from({ length: TOTAL_VARIANTS }, (_, i) => ({
      id: `v-${i + 1}`,
      number: i + 1,
      status: 'available', // available, rolling, sold
      activeUsers: 0,
      rolledAt: null,
    })),
  );

  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const gridRef = useRef(null);

  // 1. Listen for Real-time Updates (Mocking Firebase/Supabase)
  useEffect(() => {
    // This represents a subscription to your Real-time DB
    const interval = setInterval(() => {
      setVariants((prev) => {
        const now = Date.now();
        return prev.map((v) => {
          // REVERT LOGIC: If in 'rolling' state for > 1 minute, revert to available
          if (
            v.status === 'rolling' &&
            v.rolledAt &&
            now - v.rolledAt > 60000
          ) {
            console.log(`Reverting ${v.id} due to timeout`);
            if (v.number === selectedNumber) {
              setSelectedNumber(null);
            }
            return { ...v, status: 'available', rolledAt: null };
          }

          // LOCK: Keep the variant the user rolled protected from random mock updates
          if (!isRolling && v.number === selectedNumber) return v;

          // Randomly mock other users rolling or purchasing for demonstration
          if (Math.random() > 0.95 && v.status === 'available') {
            return { ...v, status: 'rolling', rolledAt: now };
          }
          if (Math.random() > 0.98 && v.status === 'rolling') {
            return { ...v, status: 'sold', rolledAt: null };
          }
          return v;
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedNumber, isRolling]);

  // 1.1 Countdown Timer Logic
  useEffect(() => {
    if (!selectedNumber || isRolling) {
      setTimeLeft(0);
      return;
    }

    const selectedVariant = variants.find((v) => v.number === selectedNumber);
    if (!selectedVariant || !selectedVariant.rolledAt) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((60000 - (Date.now() - selectedVariant.rolledAt)) / 1000),
      );
      setTimeLeft(remaining);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [selectedNumber, isRolling, variants]);

  // 2. Handle the "Roll" Logic
  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);
    setSelectedNumber(null);

    const availableVariants = variants.filter((v) => v.status === 'available');
    if (availableVariants.length === 0) {
      // This is a fallback, but the button should be disabled anyway
      setIsRolling(false);
      return;
    }

    // GSAP Shuffle Animation Logic
    const dummy = { val: 0 };
    gsap.to(dummy, {
      val: 20, // number of "ticks" in the animation
      duration: 2,
      ease: 'power4.out',
      onUpdate: () => {
        const randomIndex = Math.floor(
          Math.random() * availableVariants.length,
        );
        setSelectedNumber(availableVariants[randomIndex].number);
      },
      onComplete: () => {
        const finalSelection =
          availableVariants[
            Math.floor(Math.random() * availableVariants.length)
          ];

        setSelectedNumber(finalSelection.number);
        setIsRolling(false);

        // Notify parent if callback exists
        if (onRoll) {
          onRoll(finalSelection.number);
        }

        // Notify Real-time DB that this user is now "locking" this number for checkout
        markAsRolling(finalSelection.id);
      },
    });
  };

  const markAsRolling = (variantId) => {
    console.log(`Emitting 'rolling' state for ${variantId} to Real-time DB`);
    // firebase.database().ref(`variants/${variantId}`).set({ status: 'rolling' });
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, status: 'rolling', rolledAt: Date.now() }
          : v,
      ),
    );
  };

  return (
    <div className="">
      <div className="flex justify-between">
        <h3 className="text-sm mb-2 uppercase tracking-widest">
          What's left...
        </h3>
        <h3 className="text-sm mb-2 uppercase tracking-widest">
          {variants.filter((v) => v.status === 'available').length}/
          {TOTAL_VARIANTS}
        </h3>
      </div>
      <main
        className="grid grid-cols-5 md:grid-cols-10 gap-3 px-2"
        ref={gridRef}
      >
        {variants.map((variant) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            isSelected={selectedNumber === variant.number}
          />
        ))}
      </main>

      <footer className="w-full flex flex-col items-start gap-6 my-6 px-2">
        <AnimatePresence mode="wait">
          {selectedNumber && !isRolling && (
            <Motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full"
            >
              <div className="flex flex-col gap-3">
                <button
                  className={`w-full md:max-w-[280px] border border-blue-600 rounded-sm px-6 py-4 bg-blue-600 text-white text-xl font-bold uppercase tracking-widest cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:border-blue-700'} transition-colors`}
                  onClick={onBuy}
                  disabled={isLoading}
                >
                  {isLoading ? 'OPENING CHECKOUT...' : `BUY #${selectedNumber}`}
                </button>
                <div className="flex items-center gap-2 text-md font-bold uppercase tracking-widest text-neutral-500">
                  <span>Expires in</span>
                  <span className="text-amber-600 tabular-nums">
                    0:{timeLeft.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        {(() => {
          const allSold = variants.every((v) => v.status === 'sold');
          const allRemainingRolling =
            !allSold &&
            variants
              .filter((v) => v.status !== 'sold')
              .every((v) => v.status === 'rolling');

          let buttonText = 'Roll for number';
          let isDisabled = isRolling || (selectedNumber && timeLeft > 0);

          if (allSold) {
            buttonText = 'Sold Out';
            isDisabled = true;
          } else if (allRemainingRolling) {
            buttonText = 'All Numbers Rolling';
            isDisabled = true;
          } else if (isRolling) {
            buttonText = 'Rolling...';
            isDisabled = true;
          } else if (selectedNumber && timeLeft > 0) {
            buttonText = 'Number Locked';
            isDisabled = true;
          }

          return (
            <button
              onClick={handleRoll}
              disabled={isDisabled}
              className={`
                px-12 py-4 rounded-sm text-xl font-black uppercase tracking-widest transition-all
                ${isDisabled ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50' : 'bg-amber-600 text-neutral-900 hover:bg-amber-500 hover:scale-105 active:scale-95 cursor-pointer'}
              `}
            >
              {buttonText}
            </button>
          );
        })()}
      </footer>
    </div>
  );
};

const VariantCard = ({ variant, isSelected }) => {
  const getStatusColor = () => {
    if (isSelected) return 'bg-white text-black border-white scale-110 z-10';
    if (variant.status === 'sold')
      return 'bg-neutral-900 text-neutral-700 border-transparent';
    if (variant.status === 'rolling')
      return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    return 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-neutral-500';
  };

  return (
    <Motion.div
      layout
      className={`
        relative aspect-square flex items-center justify-center border-2 rounded-sm text-lg font-mono transition-colors duration-300
        ${getStatusColor()}
      `}
      animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
    >
      {variant.status === 'sold' ? (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        variant.number
      )}

      {/* Real-time pulse for "Being Rolled" state - hide if it's the user's selected number */}
      {variant.status === 'rolling' && !isSelected && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      )}
    </Motion.div>
  );
};

export default RealTimeDropStore;
