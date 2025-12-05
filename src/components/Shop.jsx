import { motion as Motion } from 'motion/react';

export default function Shop() {
  return (
    <main>
      <section className="shop page-width" id="shop">
        <Motion.h2
          className="section-title"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Shop
        </Motion.h2>
        <Motion.p
          className="release-info"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Coming Soon
        </Motion.p>
      </section>
    </main>
  );
}
