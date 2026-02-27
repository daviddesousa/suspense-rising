import { useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins and the hook. useGSAP registration prevents version discrepancies.
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A helper component that splits text into spans for word-by-word animation.
 */
const WordReveal = ({ text }) => {
  return (
    <p className="text-4xl md:text-6xl uppercase font-bold tracking-tighter flex flex-wrap justify-center gap-x-[0.25em] gap-y-2 max-w-5xl mx-auto px-6">
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="reveal-word opacity-10 inline-block translate-y-4"
        >
          {word}
        </span>
      ))}
    </p>
  );
};

export default function Shop() {
  const container = useRef();

  useGSAP(
    () => {
      // 1. Setup ScrollTrigger Animations for each section
      const sections = gsap.utils.toArray('section');

      sections.forEach((section) => {
        const words = section.querySelectorAll('.reveal-word');

        gsap.to(words, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'bottom bottom',
            end: '+=100%',
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
          },
        });
      });
    },
    { scope: container },
  );

  return (
    <main
      ref={container}
      className="text-center overflow-x-hidden bg-black text-white"
    >
      <section className="h-svh flex items-center justify-center">
        <WordReveal text="EVERYTHING IS SMOKE AND MIRRORS" />
      </section>

      <section className="h-svh flex items-center justify-center">
        <WordReveal text="He speaks with charm and moves with grace" />
      </section>

      <section className="h-svh flex items-center justify-center">
        <WordReveal text="but there’s something cold beneath his smile" />
      </section>

      <section className="h-svh flex items-center justify-center">
        <WordReveal text="like a man who’s witnessed nights he refuses to speak of" />
      </section>

      {/* Added a final spacer for scroll headroom */}
      <div className="h-svh" />
    </main>
  );
}
