import { motion as Motion } from 'motion/react';

import haslow302 from '../assets/haslow-302.jpg';
import haslow672 from '../assets/haslow-672.jpg';
import haslow906 from '../assets/haslow-906.jpg';
import haslow1208 from '../assets/haslow-1208.jpg';
import haslow1600 from '../assets/haslow-1600.jpg';

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
        <article className="release">
          <img
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
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
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
              <a href="https://tr.ee/GlTHS933U_" target="_blank" rel="noopener">
                Listen / Buy
              </a>
            </div>
          </Motion.div>
        </article>
      </section>
    </main>
  );
}
