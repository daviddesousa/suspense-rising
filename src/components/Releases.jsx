import { motion as Motion } from 'motion/react';

/*
  IMAGE OPTIMIZATION STRATEGY
  ---------------------------
  Mobile (< 768px): Image width is 100vw - 48px (gutters are 2 * 24px).
  - Common 1x targets: 312px (min phone), 366px (max phone), 553px (601px tablet).
  - Common 2x targets: 624px, 732px, 1106px.
  - Common 3x targets: 936px, 1098px, 1659px.
  - Common 4x targets: 1248px (Samsung Galaxy S8+).

  Desktop (>= 768px): Fixed image width is 300px.
  - Targets: 300px (1x), 600px (2x), 900px (3x).

  Final srcset: 300, 366, 600, 732, 900, 1100, 1250, 1600.
  (Accurately covers all density requirements including 4x screens)
*/

import petroneAvif from '../assets/releases/petrone.jpg?w=300;366;600;732;900;1100;1250;1600&format=avif&as=srcset';
import petroneWebp from '../assets/releases/petrone.jpg?w=300;366;600;732;900;1100;1250;1600&format=webp&as=srcset';
import petroneJpg from '../assets/releases/petrone.jpg?w=300;366;600;732;900;1100;1250;1600&as=srcset';
import petroneFallback from '../assets/releases/petrone.jpg?w=600';

import haslowAvif from '../assets/releases/haslow.jpg?w=300;366;600;732;900;1100;1250;1600&format=avif&as=srcset';
import haslowWebp from '../assets/releases/haslow.jpg?w=300;366;600;732;900;1100;1250;1600&format=webp&as=srcset';
import haslowJpg from '../assets/releases/haslow.jpg?w=300;366;600;732;900;1100;1250;1600&as=srcset';
import haslowFallback from '../assets/releases/haslow.jpg?w=600';

const itemVariants = {
  initial: { scale: 0.8 },
  animate: {
    scale: 1,
    transition: {
      duration: 0.8,
      type: 'spring',
      bounce: 0.4,
    },
  },
  hovering: {
    scale: 1.05,
  },
};

export default function Releases() {
  const imageSizes = '(max-width: 767px) calc(100vw - 48px), 300px';

  return (
    <main className="py-(--gutter-size) mb-auto">
      <section className="page-width" id="releases">
        <Motion.h2
          className="section-title"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Releases
        </Motion.h2>
        <article className="release" id="petrone">
          <picture>
            <source srcSet={petroneAvif} sizes={imageSizes} type="image/avif" />
            <source srcSet={petroneWebp} sizes={imageSizes} type="image/webp" />
            <source srcSet={petroneJpg} sizes={imageSizes} type="image/jpeg" />
            <Motion.img
              variants={itemVariants}
              initial="initial"
              animate="animate"
              whileHover="hovering"
              src={petroneFallback}
              alt="A green-tinted distorted face of a horse with text A Story About Petrone"
              className="release-cover"
              width={1600}
              height={1600}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <Motion.div
            className="release-info"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <h3>Haffenfold - Petrone (SR002)</h3>
            <p>
              Meet Petrone. Within them lives the spirit of the horse, dynamic,
              untamed, and ever in motion. A rhythm that never tires, running
              endlessly through the same stomping and hypnotic patterns. They’ll
              invite you to follow them until the end, promising to keep the
              same pulse from the first track to the last. You’ll see this
              figure on every dance floor, they show up like clockwork every
              night, carrying the energy until the first streaks of light.
            </p>
            <div className="release-links">
              <a
                href="https://go.protonradio.com/r/rlYsUN9sbuUp0"
                target="_blank"
                rel="noopener"
                className="shimmer-text"
                style={{
                  '--shimmer-color-1': '#ffffff',
                  '--shimmer-color-2': '#80f3b0',
                  '--shimmer-color-3': '#fdf4c8',
                }}
              >
                Listen / Buy
              </a>
            </div>
          </Motion.div>
        </article>
        <hr />
        <article className="release" id="haslow">
          <picture>
            <source srcSet={haslowAvif} sizes={imageSizes} type="image/avif" />
            <source srcSet={haslowWebp} sizes={imageSizes} type="image/webp" />
            <source srcSet={haslowJpg} sizes={imageSizes} type="image/jpeg" />
            <Motion.img
              variants={itemVariants}
              initial="initial"
              animate="animate"
              whileHover="hovering"
              src={haslowFallback}
              alt="A man's stretched and distorted face with text A Story About Haslow"
              className="release-cover"
              width={1600}
              height={1600}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <Motion.div
            className="release-info"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <h3>Haffenfold - Haslow (SR001)</h3>
            <p>
              Meet Haslow. He speaks with charm and moves with grace, but
              there’s something cold beneath his smile, like a man who’s
              witnessed nights he refuses to speak of. His eyes scan every
              dancefloor like he’s always preparing for someone to betray him or
              worse, recognize him. The closer you get to Haslow, the more it
              feels like you’re walking into a house without walls, just layers
              of smoke and mirrors...
            </p>
            <div className="release-links">
              <a
                href="https://tr.ee/GlTHS933U_"
                target="_blank"
                rel="noopener"
                className="shimmer-text"
                style={{
                  '--shimmer-color-1': '#ffffff',
                  '--shimmer-color-2': '#4b6cff',
                  '--shimmer-color-3': '#8a9fff',
                }}
              >
                Listen / Buy
              </a>
            </div>
          </Motion.div>
        </article>
      </section>
    </main>
  );
}
