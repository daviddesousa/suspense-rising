import { useRef, useState, useEffect } from 'react';
import ProductPreview from './ProductPreview';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import './Carousel3D.css';

// Import images
import imgHaslow from '../assets/haslow/Haslow-9x16-White.jpg';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

const CAROUSEL_IMAGES = [imgHaslow, imgHaslow, imgHaslow];

export default function Carousel3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const carouselRef = useRef(null);
  const titleSpanRef = useRef(null);
  const previewRef = useRef(null);
  const previewTitleRef = useRef(null);
  const previewCloseRef = useRef(null);
  const productRef = useRef(null);

  const titleSplitRef = useRef(null);
  const previewTitleSplitRef = useRef(null);
  const previewCloseSplitRef = useRef(null);

  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const activatePreviewRef = useRef(null);
  useEffect(() => {
    activatePreviewRef.current = activatePreview;
  });

  useEffect(() => {
    if (isPreviewActive) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isPreviewActive]);

  const getCarouselCellTransforms = (count, radius) => {
    const angleStep = 360 / count;
    return Array.from({ length: count }, (_, i) => {
      const angle = i * angleStep;
      return `rotateY(${angle}deg) translateZ(${radius}px)`;
    });
  };

  useGSAP(
    () => {
      // 1. Setup Carousel Cells
      const radius = 500;
      const cells = carouselRef.current.querySelectorAll('.carousel__cell');
      const transforms = getCarouselCellTransforms(cells.length, radius);
      cells.forEach((cell, i) => {
        cell.style.transform = transforms[i];
      });

      // 2. Split Text
      titleSplitRef.current = new SplitText(titleSpanRef.current, {
        type: 'chars',
        charsClass: 'char',
      });
      previewTitleSplitRef.current = new SplitText(previewTitleRef.current, {
        type: 'chars',
        charsClass: 'char',
      });
      previewCloseSplitRef.current = new SplitText(previewCloseRef.current, {
        type: 'chars',
        charsClass: 'char',
      });

      // 3. Scroll Animation
      const cards = carouselRef.current.querySelectorAll('.card');
      const timeline = gsap.timeline({
        defaults: { ease: 'sine.inOut' },
        scrollTrigger: {
          trigger: sceneRef.current,
          start: 'top bottom',
          end: 'center center+=10%',
          scrub: true,
          onLeave: () => {
            if (activatePreviewRef.current) activatePreviewRef.current();
          },
        },
      });

      timeline
        .fromTo(carouselRef.current, { rotationY: 0 }, { rotationY: -180 }, 0)
        .fromTo(
          carouselRef.current,
          { rotationZ: 3, rotationX: 3 },
          { rotationZ: -3, rotationX: -3 },
          0,
        )
        .fromTo(
          cards,
          { filter: 'brightness(250%)' },
          { filter: 'brightness(80%)', ease: 'power3' },
          0,
        )
        .fromTo(cards, { rotationZ: 10 }, { rotationZ: -10, ease: 'none' }, 0);

      // Title entrance on scroll
      gsap.fromTo(
        titleSplitRef.current.chars,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.02,
          ease: 'none',
          stagger: { each: 0.04, from: 'start' },
          scrollTrigger: {
            trigger: sceneRef.current,
            start: 'top center',
            toggleActions: 'play none none reverse',
          },
        },
      );

      carouselRef.current._timeline = timeline;

      return () => {
        titleSplitRef.current?.revert();
        previewTitleSplitRef.current?.revert();
        previewCloseSplitRef.current?.revert();
      };
    },
    { scope: containerRef },
  );

  const activatePreview = (e) => {
    if (e) e.preventDefault();
    if (isAnimating || isPreviewActive || !titleSplitRef.current) return;

    const titleChars = titleSplitRef.current.chars;
    const previewTitleChars = previewTitleSplitRef.current.chars;
    const previewCloseChars = previewCloseSplitRef.current.chars;
    const cards = carouselRef.current.querySelectorAll('.card');

    const offsetTop =
      sceneRef.current.getBoundingClientRect().top + window.scrollY;
    const targetY =
      offsetTop - window.innerHeight / 2 + sceneRef.current.offsetHeight / 2;

    // Disable all scroll triggers
    ScrollTrigger.getAll().forEach((t) => t.disable(false));

    // Lock scroll immediately
    setIsPreviewActive(true);
    setIsAnimating(true);

    const tl = gsap.timeline({
      defaults: { duration: 1.5, ease: 'power2.inOut' },
      onComplete: () => {
        setIsAnimating(false);
        // We keep ScrollTriggers disabled while preview is active to avoid conflicts
      },
    });

    tl.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 0.9,
    })
      .to(
        titleChars,
        {
          autoAlpha: 0,
          duration: 0.02,
          ease: 'none',
          stagger: { each: 0.04, from: 'end' },
        },
        0,
      )
      .to(carouselRef.current, { rotationX: 90, rotationY: -360, z: -1000 }, 0)
      .to(
        carouselRef.current,
        {
          duration: 2.5,
          ease: 'power3.inOut',
          z: 2000,
          rotationZ: 270,
          onComplete: () => gsap.set(sceneRef.current, { autoAlpha: 0 }),
        },
        0.7,
      )
      .to(cards, { rotationZ: 0 }, 0)
      .add(() => {
        gsap.set(previewRef.current, { pointerEvents: 'auto', autoAlpha: 1 });
        animateContentIn();
        animateChars(previewTitleChars, 'in');
        animateChars(previewCloseChars, 'in');
      }, '<+=1.9');
  };

  const deactivatePreview = () => {
    if (isAnimating || !titleSplitRef.current) return;
    setIsAnimating(true);

    const titleChars = titleSplitRef.current.chars;
    const previewTitleChars = previewTitleSplitRef.current.chars;
    const previewCloseChars = previewCloseSplitRef.current.chars;

    animateChars(previewTitleChars, 'out');
    animateChars(previewCloseChars, 'out');
    animateContentOut();

    gsap.set(sceneRef.current, { autoAlpha: 1 });

    const rotationY = -180 * 0.5; // Halfway as per original code note
    const rotationX = 0;
    const rotationZ = 0;

    gsap
      .timeline({
        delay: 0.7,
        defaults: { duration: 1.3, ease: 'expo' },
        onComplete: () => {
          setIsAnimating(false);
          setIsPreviewActive(false);
          // Re-enable scroll triggers and sync to current position
          ScrollTrigger.getAll().forEach((t) => t.enable());
          ScrollTrigger.refresh();
        },
      })
      .fromTo(
        titleChars,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.02,
          ease: 'none',
          stagger: { each: 0.04, from: 'start' },
        },
      )
      .fromTo(
        carouselRef.current,
        { z: -550, rotationX, rotationY: -720, rotationZ, yPercent: 300 },
        { rotationY, yPercent: 0 },
        0,
      )
      .fromTo(
        carouselRef.current.querySelectorAll('.card'),
        { autoAlpha: 0 },
        { autoAlpha: 1 },
        0.3,
      );
  };

  const animateChars = (chars, direction = 'in') => {
    if (!chars) return;
    gsap.fromTo(
      chars,
      { autoAlpha: direction === 'in' ? 0 : 1 },
      {
        autoAlpha: direction === 'in' ? 1 : 0,
        duration: 0.02,
        ease: 'none',
        stagger: { each: 0.04, from: direction === 'in' ? 'start' : 'end' },
      },
    );
  };

  // animations for the single preview content
  const animateContentIn = () => {
    if (!productRef.current) return;
    gsap.fromTo(
      productRef.current,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
    );
  };

  const animateContentOut = () => {
    if (!productRef.current) return;
    gsap.to(productRef.current, {
      autoAlpha: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(previewRef.current, { autoAlpha: 0, pointerEvents: 'none' });
        // clear animation props so it can cleanly animate again
        gsap.set(productRef.current, { clearProps: 'all' });
      },
    });
  };

  return (
    <div className="scene-wrapper" ref={containerRef}>
      <div className="scene" ref={sceneRef}>
        <h2 className="scene__title">
          <a href="#" onClick={activatePreview}>
            <span ref={titleSpanRef}>The Haslow Tee</span>
          </a>
        </h2>
        <div className="carousel" ref={carouselRef}>
          {CAROUSEL_IMAGES.map((img, i) => (
            <div key={i} className="carousel__cell">
              <div className="card" style={{ '--img': `url(${img})` }}>
                <div className="card__face card__face--front"></div>
                <div className="card__face card__face--back"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="preview-wrapper">
        <div
          id="preview-modal"
          className="preview overflow-y-auto"
          ref={previewRef}
          /*
           * allowNestedScroll: true
           * This automatically detects nested scrollable elements and lets them scroll natively.
           * However, this can create performance issues since Lenis needs to check the DOM tree on every scroll event.
           * If you experience performance problems, use data-lenis-prevent instead.
           */
        >
          <header className="preview__header max-w-225 mx-auto">
            <h2 className="preview__title">
              <span ref={previewTitleRef}>The Haslow Tee</span>
            </h2>
            <button
              className="preview__close"
              ref={previewCloseRef}
              onClick={deactivatePreview}
            >
              Close ×
            </button>
          </header>
          <div className="preview__content max-w-225 mx-auto">
            <div className="product-container" ref={productRef}>
              <ProductPreview handle="haslow-tee" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
