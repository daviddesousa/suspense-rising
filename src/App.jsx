import { useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';

import Logo from './components/Logo';
import Nav from './components/Nav';

function App() {
  const location = useLocation();
  const lenisRef = useRef();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <div className="site-wrapper" data-page-handle={location.pathname}>
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
