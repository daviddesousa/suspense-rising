import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

// global lenis instance for smooth scrolling
const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

gsap.ticker.lagSmoothing(0);

export default function Shop() {
  // initialize scroll-triggered scaling for paragraphs
  useGSAP(() => {
    const paragraphs = gsap.utils.toArray('section p');

    paragraphs.forEach((p) => {
      gsap.fromTo(
        p,
        { scale: 0.5 },
        {
          scale: 1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: p,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        },
      );
    });
  });

  return (
    <main className="text-center overflow-hidden">
      <section className="h-svh flex items-center justify-center">
        <p className="text-4xl uppercase transform origin-center">
          EVERYTHING IS SMOKE AND MIRRORS
        </p>
      </section>

      <section className="h-svh flex items-center justify-center">
        <p className="text-4xl uppercase transform origin-center">
          He speaks with charm and moves with grace
        </p>
      </section>

      <section className="h-svh flex items-center justify-center">
        <p className="text-4xl uppercase transform origin-center">
          but there’s something cold beneath his smile
        </p>
      </section>

      <section className="h-svh flex items-center justify-center">
        <p className="text-4xl uppercase transform origin-center">
          like a man who’s witnessed nights he refuses to speak of
        </p>
      </section>
    </main>
  );
}
