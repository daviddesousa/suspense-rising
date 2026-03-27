import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import App from './App';

const Releases = lazy(() => import('./components/Releases'));
const Shop = lazy(() => import('./components/Shop'));

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={null} />
          <Route
            path="releases"
            element={
              <Suspense fallback={null}>
                <Releases />
              </Suspense>
            }
          />
          <Route
            path="shop"
            element={
              <Suspense fallback={null}>
                <Shop />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
