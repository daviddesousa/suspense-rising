import { motion as Motion, useScroll, useTransform } from 'motion/react';

const ScrollIndicator = () => {
  const { scrollY } = useScroll();

  // Fade out the indicator as the user scrolls down
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, 40]);

  return (
    <Motion.div
      style={{ opacity, y }}
      className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-40 pointer-events-none"
    >
      <Motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="text-md uppercase tracking-[0.4em] text-white/90"
      >
        Scroll
      </Motion.span>

      <Motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 80 }}
        transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
        className="relative w-px bg-white/10 overflow-hidden"
      >
        <Motion.div
          animate={{
            y: [-80, 80],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-white/80 to-transparent"
        />
      </Motion.div>
    </Motion.div>
  );
};

export default ScrollIndicator;
