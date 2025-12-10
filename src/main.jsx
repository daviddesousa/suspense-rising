import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import App from './App';

import Releases from './components/Releases';
import Shop from './components/Shop';

import './index.css';

// Add WebP detection
const webpScript = document.createElement('script');
webpScript.src = '/modernizr-webp.js';
document.head.appendChild(webpScript);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route index element={null} />
          <Route path="releases" element={<Releases />} />
          <Route path="shop" element={<Shop />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
