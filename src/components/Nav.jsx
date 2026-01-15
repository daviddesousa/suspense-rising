import { NavLink } from 'react-router';
import { motion as Motion } from 'motion/react';
import Instagram from './Instagram';

export default function Nav() {
  return (
    <Motion.nav
      className="header-nav"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <NavLink to="/releases" end>
        Releases
      </NavLink>
      <NavLink to="/shop" end>
        Shop
      </NavLink>
      <Instagram />
    </Motion.nav>
  );
}
