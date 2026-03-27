import { NavLink } from 'react-router';
import { preload } from 'react-dom';

import logoAvif from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265;530;795;1060&format=avif&as=srcset';
import logoWebp from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265;530;795;1060&format=webp&as=srcset';
import logoPng from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265;530;795;1060&format=png&as=srcset';
import logoFallback from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265&format=png';

// Preload the critical LCP image to make it discoverable as early as possible.
// This call injects a <link rel="preload"> tag during the head render phase.
preload(logoAvif, {
  as: 'image',
  imageSrcSet: logoAvif,
  imageSizes: '265px',
  fetchPriority: 'high',
});

export default function Logo() {
  return (
    <NavLink to="/">
      <h1 className="sr-only">Suspense Rising</h1>
      {/* 
        Using a standard <picture> instead of <Motion.picture> for LCP. 
        This keeps the markup simple and predictable for the browser's preload scanner 
        and avoids waiting for Framer Motion's hydration logic to show the image.
      */}
      <picture className="logo-container">
        <source srcSet={logoAvif} sizes="265px" type="image/avif" />
        <source srcSet={logoWebp} sizes="265px" type="image/webp" />
        <source srcSet={logoPng} sizes="265px" type="image/png" />
        <img
          src={logoFallback}
          alt="Suspense Rising in chrome lettering"
          width="265"
          height="28"
          className="logo"
          decoding="sync"
          loading="eager"
          fetchPriority="high"
        />
      </picture>
    </NavLink>
  );
}
