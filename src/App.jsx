import { useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';

import Logo from './components/Logo';
import Nav from './components/Nav';
import ResponsiveBackground from './components/ResponsiveBackground';

const titles = {
  '/': 'Suspense Rising',
  '/releases': 'Suspense Rising | Releases',
  '/shop': 'Suspense Rising | Shop',
};

function App() {
  const location = useLocation();
  const isShop = location.pathname === '/shop';
  const isHome = location.pathname === '/';
  const lenisRef = useRef();

  useEffect(() => {
    document.title = titles[location.pathname] || 'Suspense Rising';

    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, [location.pathname]);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
      }}
      ref={lenisRef}
    >
      <div className="site-wrapper" data-page-handle={location.pathname}>
        <ResponsiveBackground isShop={isShop} isHome={isHome} />
        <header className="site-header">
          <Nav />
        </header>
        <nav className="nav-logo">
          <Logo />
        </nav>
        <Outlet />
      </div>
    </ReactLenis>
  );
}

export default App;
