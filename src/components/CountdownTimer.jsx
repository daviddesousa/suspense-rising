import { useState, useEffect } from 'react';
import { motion as Motion } from 'motion/react';

const padZero = (num) => String(num).padStart(2, '0');

export default function CountdownTimer({ targetDate, onComplete }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +targetDate - +new Date();

      if (difference <= 0) {
        onComplete();
        return false;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
      setIsCalculated(true);
      return true;
    };

    // Initial run
    const isActive = calculateTime();
    if (!isActive) return;

    const interval = setInterval(() => {
      calculateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (!isCalculated) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-neutral-500 font-mono text-sm animate-pulse tracking-[0.2em] uppercase">
          Loading...
        </div>
      </div>
    );
  }

  const timeUnits = [
    { label: 'D', value: timeLeft.days },
    { label: 'H', value: timeLeft.hours },
    { label: 'M', value: timeLeft.minutes },
    { label: 'S', value: timeLeft.seconds },
  ];

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center px-4"
    >
      <div className="w-full max-w-xl py-8 px-6 sm:p-12 overflow-hidden">
        <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-8 text-neutral-200">
          The Haslow Tee
        </h2>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto mb-8">
          {timeUnits.map((unit, index) => (
            <div key={index} className="flex flex-col items-center p-3 sm:p-4">
              <span className="font-mono text-3xl sm:text-5xl font-bold tracking-tight text-white select-none">
                {padZero(unit.value)}
              </span>
              <span className="text-sm sm:text-md uppercase tracking-widest text-neutral-500 mt-2 font-mono">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-md sm:text-lg text-neutral-200 font-mono tracking-wide">
          JUNE 11<sup>th</sup>
        </p>
      </div>
      <style>{`.responsive-background { min-height: 100svh !important;  }`}</style>
    </Motion.div>
  );
}
