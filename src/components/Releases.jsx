import { motion as Motion } from 'motion/react';

import haslowCover from '../assets/haslow.jpg';

export default function Releases() {
  return (
    <main>
      <Motion.section
        className="page-width"
        id="releases"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h2 className="section-title">Releases</h2>
        <article className="release">
          <img
            src={haslowCover}
            alt="A man's stretched and distorted face with text A story about Haslow"
            className="release-cover"
          />
          <div className="release-info">
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
          </div>
        </article>
      </Motion.section>
    </main>
  );
}
