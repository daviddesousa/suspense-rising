import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ShopSection from './ShopSection';
import ProductPreview from './ProductPreview';
import HaslowBackground from './HaslowBackground';
import ScrollIndicator from './ScrollIndicator';
import MiniAudioPlayer from './MiniAudioPlayer';
import CountdownTimer from './CountdownTimer';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TARGET_DATE = new Date('2026-06-11T19:00:00-04:00'); // June 11th, 7:00 PM Eastern Time (EDT)

const SHOP_CONTENT = [
  'He speaks with charm and moves with grace',
  'but there’s something cold beneath his smile',
  'The closer you get to Haslow, the more it feels like you’re walking into a house without walls',
  'just layers of smoke and mirrors...',
];

export default function Shop() {
  const haslowRef = useRef(null);
  const bgContainerRef = useRef(null);
  const playerRef = useRef(null);
  const animationSpacerRef = useRef(null);

  const [isLocked, setIsLocked] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const hasBypassParam = params.get('bypass') === 'true';
    const hasBypassStorage =
      typeof window !== 'undefined' &&
      window.localStorage?.getItem('shop_bypass') === 'true';
    const forceLock = params.get('bypass') === 'false';

    if (forceLock) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('shop_bypass');
      }
      return new Date() < TARGET_DATE;
    }

    if (hasBypassParam) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('shop_bypass', 'true');
      }
      return false;
    }

    if (hasBypassStorage) {
      return false;
    }

    return new Date() < TARGET_DATE;
  });

  useGSAP(() => {
    if (isLocked) return;
    if (!haslowRef.current || !playerRef.current) return;

    // Slide IN on scroll down, slide OUT only when scrolling back above the trigger.
    // No onLeave — so the player stays visible for the rest of the page.
    ScrollTrigger.create({
      trigger: haslowRef.current,
      start: 'bottom bottom',
      endTrigger: animationSpacerRef.current,
      end: 'top bottom',
      onEnter: (self) => {
        if (self.progress === 1) return;
        gsap.to(playerRef.current, {
          y: '0%',
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.7,
          ease: 'power1.out',
        });
      },
      onLeaveBack: () =>
        gsap.to(playerRef.current, {
          y: '120%',
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.5,
          ease: 'power1.in',
        }),
    });

    if (bgContainerRef.current && animationSpacerRef.current) {
      const spacerTrigger = {
        trigger: animationSpacerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      };

      gsap.to(bgContainerRef.current, {
        scrollTrigger: spacerTrigger,
        scale: 2.5,
        filter: 'blur(10px)',
        opacity: 0,
        ease: 'power1.inOut',
      });

      // Hide the mini audio player in sync
      gsap.fromTo(
        playerRef.current,
        {
          y: '0%',
          opacity: 1,
          pointerEvents: 'auto',
        },
        {
          scrollTrigger: spacerTrigger,
          y: '120%',
          opacity: 0,
          pointerEvents: 'none',
          ease: 'power1.inOut',
          immediateRender: false,
        },
      );
    }
  }, [isLocked]);

  if (isLocked) {
    return (
      <main className="my-[25%_auto] sm:my-[10%_auto]">
        <CountdownTimer
          targetDate={TARGET_DATE}
          onComplete={() => setIsLocked(false)}
        />
      </main>
    );
  }

  return (
    <main>
      <ScrollIndicator />

      <ShopSection text="Meet Haslow." height="10vh" />

      {/* Ref wrapper — marks the trigger point */}
      <div
        ref={haslowRef}
        className="sticky top-0 w-full h-screen -z-1 overflow-hidden"
      >
        <div
          ref={bgContainerRef}
          className="w-full h-full relative after:absolute after:inset-0 after:bg-black/70 origin-center"
        >
          <HaslowBackground />
        </div>
      </div>

      {/* Fixed player — slides in via GSAP */}
      <div
        ref={playerRef}
        style={{
          transform: 'translateY(120%)',
          opacity: 0,
          pointerEvents: 'none',
        }}
        className="mini-audio-player-wrapper"
      >
        <MiniAudioPlayer src="/haslow_vocal_tee.mp3" />
      </div>

      {SHOP_CONTENT.map((text, index) => (
        <ShopSection key={index} text={text} />
      ))}

      {/* Spacer for the haslow zoom/blur animation */}
      <div ref={animationSpacerRef} className="h-svh" />

      <section className="relative z-10 flex flex-col justify-start p-(--gutter-size) pb-22 sm:min-h-svh lg:min-h-[94svh]">
        <ProductPreview handle="the-haslow-tee" />
      </section>
    </main>
  );
}
