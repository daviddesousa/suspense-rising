import { NavLink } from 'react-router';
import { motion as Motion } from 'motion/react';

import logoAvif from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265;530;795;1060&format=avif&as=srcset';
import logoWebp from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265;530;795;1060&format=webp&as=srcset';
import logoPng from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265;530;795;1060&format=png&as=srcset';
import logoFallback from '../assets/logo/suspense-rising-chrome-unicolor.png?w=265&format=png';

export default function Logo() {
  return (
    <NavLink to="/">
      <h1 className="sr-only">Suspense Rising</h1>
      {/* Keep the image visible for LCP; only animate translation so we don't delay the LCP paint */}
      <Motion.picture
        initial={{ x: -60 }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <source srcSet={logoAvif} sizes="265px" type="image/avif" />
        <source srcSet={logoWebp} sizes="265px" type="image/webp" />
        <source srcSet={logoPng} sizes="265px" type="image/png" />
        <img
          src={logoFallback}
          alt="Suspense Rising in chrome lettering"
          width="265"
          height="28"
          className="logo"
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />
      </Motion.picture>
    </NavLink>
  );
}
