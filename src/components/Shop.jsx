import { motion as Motion } from 'motion/react';

export default function Shop() {
  return (
    <main>
      <Motion.section
        className="shop page-width"
        id="shop"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h2 className="section-title">Shop</h2>
        <p>Coming Soon</p>
      </Motion.section>
    </main>
  );
}
