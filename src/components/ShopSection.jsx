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
          start: 'center center',
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
      className="h-[50svh] flex items-center justify-center"
    >
      {/*
        Mobile Screen Resolution Stats Worldwide (Feb 2025 - Feb 2026)
        https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide

        In order of resolution (smallest to largest):
          2) 360 x 800 Samsung Galaxy S8+ || BlackBerry Z30
          5) 384 x 832 Nexus 4
          3) 390 x 844 iPhone 12 Pro
          4) 393 x 873 Pixel 3
          1) 414 x 896 iPhone XR

        Desktop Screen Resolution Stats Worldwide (Feb 2025 - Feb 2026)
        https://gs.statcounter.com/screen-resolution-stats/desktop/worldwide

        In order of resolution (smallest to largest):
          6) 800 x 600
          2) 1280 x 1200
          5) 1280 x 720
          4) 1366 x 768
          3) 1536 x 864
          1) 1920 x 1080 Mac mini Apple M2
      */}
      <p
        className="
          flex flex-wrap justify-center gap-x-[0.25em] gap-y-2 mx-auto
          text-white uppercase font-bold tracking-tighter
          text-4xl md:text-6xl 2xl:text-7xl
          px-3 min-[384px]:px-6 min-[414px]:px-9 min-[425px]:px-10 md:px-24 xl:px-26 2xl:px-0
          max-md:max-w-[425px] md:max-w-3xl xl:max-w-none 2xl:max-w-(--breakpoint-laptop-lg)
        "
      >
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
