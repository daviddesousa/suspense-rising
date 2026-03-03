import { useRef, useState, useMemo, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import './Carousel3D.css';

// Import images
import img1 from '../assets/carousel/img1.webp';
import img2 from '../assets/carousel/img2.webp';
import img3 from '../assets/carousel/img3.webp';
import img4 from '../assets/carousel/img4.webp';
import img5 from '../assets/carousel/img5.webp';
import img6 from '../assets/carousel/img6.webp';
import img7 from '../assets/carousel/img7.webp';
import img8 from '../assets/carousel/img8.webp';
import img9 from '../assets/carousel/img9.webp';
import img10 from '../assets/carousel/img10.webp';
import img11 from '../assets/carousel/img11.webp';
import img12 from '../assets/carousel/img12.webp';
import imgHaslow from '../assets/haslow/Haslow-9x16-NoTitles.jpg';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

const CAROUSEL_IMAGES = [imgHaslow, imgHaslow, imgHaslow];
const GRID_IMAGES = [
  { img: img1, title: 'Kai Vega' },
  { img: img2, title: 'Riven Juno' },
  { img: img3, title: 'Lex Orion' },
  { img: img4, title: 'Ash Kairos' },
  { img: img5, title: 'Juno Sol' },
  { img: img6, title: 'Soren Nyx' },
  { img: img7, title: 'Quinn Axon' },
  { img: img8, title: 'Zara Voss' },
  { img: img9, title: 'Hale B.' },
  { img: img10, title: 'Gundra Wex' },
  { img: img11, title: 'Extra One' },
  { img: img12, title: 'Extra Two' },
];

export default function Carousel3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const carouselRef = useRef(null);
  const titleSpanRef = useRef(null);
  const previewRef = useRef(null);
  const previewTitleRef = useRef(null);
  const previewCloseRef = useRef(null);
  const gridItemsRef = useRef([]);

  const titleSplitRef = useRef(null);
  const previewTitleSplitRef = useRef(null);
  const previewCloseSplitRef = useRef(null);

  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
          end: 'bottom top',
          scrub: true,
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
    e.preventDefault();
    if (isAnimating || !titleSplitRef.current) return;
    setIsAnimating(true);

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

    const tl = gsap.timeline({
      defaults: { duration: 1.5, ease: 'power2.inOut' },
      onComplete: () => {
        setIsAnimating(false);
        setIsPreviewActive(true);
        ScrollTrigger.getAll().forEach((t) => t.enable());
        carouselRef.current._timeline.scrollTrigger.scroll(targetY);
      },
    });

    tl.to(window, {
      scrollTo: { y: targetY, autoKill: true },
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
      .to(carouselRef.current, { rotationX: 90, rotationY: -360, z: -2000 }, 0)
      .to(
        carouselRef.current,
        {
          duration: 2.5,
          ease: 'power3.inOut',
          z: 1500,
          rotationZ: 270,
          onComplete: () => gsap.set(sceneRef.current, { autoAlpha: 0 }),
        },
        0.7,
      )
      .to(cards, { rotationZ: 0 }, 0)
      .add(() => {
        gsap.set(previewRef.current, { pointerEvents: 'auto', autoAlpha: 1 });
        animateGridIn();
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
    animateGridOut();

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

  const animateGridIn = () => {
    const items = gridItemsRef.current;
    gsap.set(items, { clearProps: 'all' });

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    items.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      const dx = centerX - elCenterX;
      const dy = centerY - elCenterY;
      const isLeft = elCenterX < centerX;
      const rotationY = isLeft ? 100 : -100;
      const delay = i * 0.05; // Simple stagger for React

      gsap.fromTo(
        el,
        {
          transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`,
          autoAlpha: 0,
          y: dy * 0.5,
          scale: 0.5,
          rotationY,
          z: -3500,
        },
        {
          y: 0,
          scale: 1,
          rotationY: 0,
          z: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay,
        },
      );
    });
  };

  const animateGridOut = () => {
    const items = gridItemsRef.current;

    items.forEach((el, i) => {
      if (!el) return;
      const delay = i * 0.02;
      gsap.to(el, {
        y: 100,
        scale: 0.4,
        autoAlpha: 0,
        z: -3500,
        duration: 0.6,
        ease: 'power3.in',
        delay,
        onComplete:
          i === items.length - 1
            ? () =>
                gsap.set(previewRef.current, {
                  autoAlpha: 0,
                  pointerEvents: 'none',
                })
            : undefined,
      });
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
        <div className="preview" ref={previewRef}>
          <header className="preview__header">
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
          <div className="grid">
            {GRID_IMAGES.map((item, i) => (
              <figure
                key={i}
                className="grid__item"
                ref={(el) => (gridItemsRef.current[i] = el)}
              >
                <div
                  className="grid__item-image"
                  style={{ backgroundImage: `url(${item.img})` }}
                ></div>
                <figcaption className="grid__item-caption">
                  <h3>{item.title}</h3>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
