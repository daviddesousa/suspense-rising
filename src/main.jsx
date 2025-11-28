import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add WebP detection
const webpScript = document.createElement('script');
webpScript.src = '/modernizr-webp.js';
document.head.appendChild(webpScript);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
