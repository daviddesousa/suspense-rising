import wallpaperAvif from '../assets/wallpaper-bw.jpg?w=640;768;1024;1280;1536;1920;2560;3000&format=avif&as=srcset';
import wallpaperWebp from '../assets/wallpaper-bw.jpg?w=640;768;1024;1280;1536;1920;2560;3000&format=webp&as=srcset';
import wallpaperJpg from '../assets/wallpaper-bw.jpg?w=640;768;1024;1280;1536;1920;2560;3000&as=srcset';
import wallpaperFallback from '../assets/wallpaper-bw.jpg?w=1920';

import WavyBackgroundWebGL from './WavyBackgroundWebGL';

/**
 * ResponsiveBackground handles the site's main wallpaper using modern responsive image practices.
 * By using vite-imagetools, it automatically:
 * 1. Resizes the 3000px master image into multiple widths.
 * 2. Compresses and optimizes the output.
 * 3. Handles AVIF and WebP generation with JPG fallback.
 * 4. Benefits from Vite's automatic hashing for cache-busting.
 * When on the home page, it uses a high-performance WebGL context to provide a wavy displacement effect.
 * For other pages, it falls back to standard responsive <img> elements.
 */
const ResponsiveBackground = ({ isShop, isHome }) => {
  return (
    <div
      className={`-z-20 pointer-events-none select-none bg-(--main-bg-color) ${
        isShop ? 'absolute inset-x-0 top-0 h-svh' : 'fixed inset-0'
      }`}
      aria-hidden="true"
    >
      {isHome ? (
        <WavyBackgroundWebGL imageUrl={wallpaperFallback} />
      ) : (
        <picture className="absolute inset-0">
          <source srcSet={wallpaperAvif} sizes="100vw" type="image/avif" />
          <source srcSet={wallpaperWebp} sizes="100vw" type="image/webp" />
          <source srcSet={wallpaperJpg} sizes="100vw" type="image/jpeg" />
          <img
            src={wallpaperFallback}
            alt=""
            className={`w-full ${isShop ? '' : 'h-full object-cover'} object-top`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      )}
    </div>
  );
};

export default ResponsiveBackground;
