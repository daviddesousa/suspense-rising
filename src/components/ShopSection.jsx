import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A reusable section component for the Shop page that reveals text word-by-word
 * as the user scrolls. Each section pins until the reveal is complete.
 */
const ShopSection = ({ text }) => {
  const sectionRef = useRef();

  useGSAP(
    () => {
      const words = sectionRef.current.querySelectorAll('.reveal-word');

      gsap.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom bottom',
          end: '+=100%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="h-svh flex items-center justify-center"
    >
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
    </section>
  );
};

export default ShopSection;
