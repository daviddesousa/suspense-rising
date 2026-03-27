import { NavLink } from 'react-router';
import { preload } from 'react-dom';

import logoAvif from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265;530;795;1060&format=avif&as=srcset';
import logoWebp from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265;530;795;1060&format=webp&as=srcset';
import logoPng from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265;530;795;1060&format=png&as=srcset';
import logoFallback from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265&format=png';
// React DOM uses the first arg to preload() as a deduplication key, not as an href.
// When imageSrcSet is provided, React omits href entirely from the <link> tag (valid per spec).
// A stable single-URL string is used here so the key is meaningful and collision-free.
import logoAvif265 from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265&format=avif';

// Preload the critical LCP image to make it discoverable as early as possible.
// React DOM injects <link rel="preload" as="image" imagesrcset="..." imagesizes="...">
// without an href (correct per spec when imagesrcset is present). The browser then
// selects the right variant via the srcset algorithm before any JS has executed.
preload(logoAvif265, {
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
