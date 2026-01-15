import { motion as Motion } from 'motion/react';

import haslow302 from '../assets/haslow-302.jpg';
import haslow672 from '../assets/haslow-672.jpg';
import haslow906 from '../assets/haslow-906.jpg';
import haslow1208 from '../assets/haslow-1208.jpg';
import haslow1600 from '../assets/haslow-1600.jpg';

import petrone302 from '../assets/petrone-302.jpg';
import petrone672 from '../assets/petrone-672.jpg';
import petrone906 from '../assets/petrone-906.jpg';
import petrone1208 from '../assets/petrone-1208.jpg';
import petrone1400 from '../assets/petrone-1400.jpg';

export default function Releases() {
  return (
    <main>
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
          <Motion.img
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: 'spring',
              bounce: 0.4,
            }}
            srcSet={`
              ${petrone302} 302w,
              ${petrone672} 672w,
              ${petrone906} 906w,
              ${petrone1208} 1208w,
              ${petrone1400} 1600w
            `}
            sizes="(max-width: 767px) 100vw, 302px"
            src={petrone672}
            alt="A man's stretched and distorted face with text A story about Haslow"
            className="release-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
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
          <Motion.img
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05, rotate: -1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: 'spring',
              bounce: 0.4,
            }}
            srcSet={`
              ${haslow302} 302w,
              ${haslow672} 672w,
              ${haslow906} 906w,
              ${haslow1208} 1208w,
              ${haslow1600} 1600w
            `}
            sizes="(max-width: 767px) 100vw, 302px"
            src={haslow672}
            alt="A man's stretched and distorted face with text A story about Haslow"
            className="release-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <Motion.div
            className="release-info"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <h3>Haffenfold - Haslow (SR001)</h3>
            <p>
              Meet Haslow. He speaks with charm and moves with grace but there’s
              something cold beneath his smile, like a man who’s witnessed
              nights he refuses to speak of. His eyes scan every dancefloor like
              he’s always preparing for someone to betray him or worse,
              recognize him. The closer you get to Haslow, the more it feels
              like you’re walking into a house without walls, just layers of
              smoke and mirrors...
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
