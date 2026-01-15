import { Outlet, useLocation } from 'react-router';

import Logo from './components/Logo';
import Nav from './components/Nav';

function App() {
  const location = useLocation();

  return (
    <div className="site-wrapper" data-page-handle={location.pathname}>
      <header>
        <Nav />
      </header>
      <nav className="nav-logo">
        <Logo />
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
