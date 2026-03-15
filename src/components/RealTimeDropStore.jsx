import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const RealTimeDropStore = ({
  variants = [],
  selectedVariantId,
  onSelectVariant,
  onBuy,
  isLoading,
}) => {
  const [activeExperience, setActiveExperience] = useState('choose'); // 'choose' | 'blind'

  const availableCount = variants.filter((v) => v.available).length;
  const totalCount = variants.length;

  return (
    <div className="space-y-8">
      {/* Experience Toggle */}
      <div className="flex bg-neutral-900 p-1 rounded-sm border border-neutral-800">
        <button
          onClick={() => setActiveExperience('choose')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeExperience === 'choose'
              ? 'bg-neutral-800 text-white shadow-xl'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Choose a Figure
        </button>
        <button
          onClick={() => {
            setActiveExperience('blind');
            onSelectVariant(null);
          }}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeExperience === 'blind'
              ? 'bg-neutral-800 text-white shadow-xl'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Let Haslow Choose
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeExperience === 'choose' ? (
          <Motion.div
            key="choose"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">
                  Select your number
                </h3>
                <p className="text-sm text-neutral-400">
                  Figures are limited and unique.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold tabular-nums">
                  {availableCount}
                </span>
                <span className="text-neutral-600 mx-1">/</span>
                <span className="text-neutral-600">{totalCount}</span>
              </div>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {variants.map((variant, idx) => (
                <button
                  key={variant.id}
                  disabled={!variant.available}
                  onClick={() => onSelectVariant(variant.id)}
                  className={`
                    relative aspect-square flex items-center justify-center border rounded-sm text-sm font-mono transition-all duration-200
                    ${
                      !variant.available
                        ? 'bg-neutral-900/50 text-neutral-800 border-neutral-900 cursor-not-allowed'
                        : selectedVariantId === variant.id
                          ? 'bg-white text-black border-white scale-105 z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                          : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-neutral-300 cursor-pointer'
                    }
                  `}
                >
                  {!variant.available ? (
                    <svg
                      className="w-4 h-4"
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
                    idx + 1
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onBuy()}
                disabled={!selectedVariantId || isLoading || availableCount === 0}
                className={`
                  w-full py-4 bg-amber-600 text-black text-xl font-bold uppercase tracking-widest transition-all
                  ${
                    !selectedVariantId || isLoading || availableCount === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-amber-500 hover:scale-[1.02] active:scale-95 cursor-pointer'
                  }
                `}
              >
                {availableCount === 0
                  ? 'Sold Out'
                  : isLoading
                    ? 'Processing...'
                    : selectedVariantId
                      ? `Buy Figure #${variants.findIndex((v) => v.id === selectedVariantId) + 1}`
                      : 'Select a Number'}
              </button>
            </div>
          </Motion.div>
        ) : (
          <Motion.div
            key="blind"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 py-2"
          >
            <div className="text-center space-y-4 max-w-sm mx-auto">
              <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">?</span>
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tighter">
                Let Haslow Choose
              </h2>
              <p className="text-neutral-400 leading-relaxed">
                You buy a number blindly and you won't know which one you got
                until you receive your package.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onBuy()}
                disabled={isLoading || availableCount === 0}
                className={`
                  w-full py-4 bg-amber-600 text-black text-xl font-bold uppercase tracking-widest transition-all
                  ${
                    isLoading || availableCount === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-amber-500 hover:scale-[1.02] active:scale-95 cursor-pointer'
                  }
                `}
              >
                {availableCount === 0
                  ? 'Sold Out'
                  : isLoading
                    ? 'Processing...'
                    : 'Let Haslow Choose'}
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeDropStore;
