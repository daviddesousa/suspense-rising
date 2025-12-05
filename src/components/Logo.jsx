import { NavLink } from 'react-router';
import { motion as Motion } from 'motion/react';

import suspenseRisingLogo265Webp from '../assets/suspense-rising-chrome-unicolor-265.webp';
import suspenseRisingLogo530Webp from '../assets/suspense-rising-chrome-unicolor-530.webp';
import suspenseRisingLogo795Webp from '../assets/suspense-rising-chrome-unicolor-795.webp';
import suspenseRisingLogo1060Webp from '../assets/suspense-rising-chrome-unicolor-1060.webp';
import suspenseRisingLogo265Png from '../assets/suspense-rising-chrome-unicolor-265.png';
import suspenseRisingLogo530Png from '../assets/suspense-rising-chrome-unicolor-530.png';
import suspenseRisingLogo795Png from '../assets/suspense-rising-chrome-unicolor-795.png';
import suspenseRisingLogo1060Png from '../assets/suspense-rising-chrome-unicolor-1060.png';

export default function Logo() {
  return (
    <NavLink to="/">
      <h1 className="sr-only">Suspense Rising</h1>
      {/* Keep the image visible for LCP; only animate translation so we don't delay the LCP paint */}
      <Motion.picture
        initial={{ x: -80 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: 'easeIn' }}
      >
        <source
          type="image/webp"
          srcSet={`
          ${suspenseRisingLogo265Webp},
          ${suspenseRisingLogo530Webp} 2x,
          ${suspenseRisingLogo795Webp} 3x,
          ${suspenseRisingLogo1060Webp} 4x
        `}
        />
        <source
          type="image/png"
          srcSet={`
          ${suspenseRisingLogo265Png},
          ${suspenseRisingLogo530Png} 2x,
          ${suspenseRisingLogo795Png} 3x,
          ${suspenseRisingLogo1060Png} 4x
        `}
        />
        <img
          src={suspenseRisingLogo265Png}
          alt="Suspense Rising in chrome lettering"
          width="265"
          height="28"
          className="logo"
          fetchPriority="high"
          decoding="async"
          loading="eager"
        />
      </Motion.picture>
    </NavLink>
  );
}
