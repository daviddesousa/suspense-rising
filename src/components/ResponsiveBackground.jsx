// vite-imagetools uses query parameters to generate different versions of the image.
// We're generating WebP versions at multiple widths to support 1x, 2x, and 3x devices across all screen sizes.
import wallpaperWebp from '../assets/wallpaper-bw.jpg?w=640;768;1024;1280;1536;1920;2560;3000&format=webp&as=srcset';

// We also generate JPG fallbacks for older browsers that don't support WebP.
import wallpaperJpg from '../assets/wallpaper-bw.jpg?w=640;768;1024;1280;1536;1920;2560;3000&as=srcset';

// A single high-res JPG for the src attribute fallback and WebGL texture.
import wallpaperFallback from '../assets/wallpaper-bw.jpg?w=1920';

import WavyBackgroundWebGL from './WavyBackgroundWebGL';

/**
 * ResponsiveBackground handles the site's main wallpaper using modern responsive image practices.
 * By using vite-imagetools, it automatically:
 * 1. Resizes the 3000px master image into multiple widths.
 * 2. Compresses and optimizes the output.
 * 3. Handles WebP generation with JPG fallback.
 * 4. Benefits from Vite's automatic hashing for cache-busting.
 * When on the home page, it uses a high-performance WebGL context to provide a wavy displacement effect.
 * For other pages, it falls back to standard responsive <img> elements.
 */
const ResponsiveBackground = ({ isShop, isHome }) => {
  return (
    <div
      className={`-z-20 pointer-events-none select-none bg-[#060606] ${
        isShop ? 'absolute inset-x-0 top-0 h-svh' : 'fixed inset-0'
      }`}
      aria-hidden="true"
    >
      {isHome ? (
        <WavyBackgroundWebGL imageUrl={wallpaperFallback} />
      ) : (
        <picture className="absolute inset-0">
          {/* Preferred WebP sources at multiple widths */}
          <source srcSet={wallpaperWebp} sizes="100vw" type="image/webp" />
          {/* Fallback JPG sources at multiple widths */}
          <source srcSet={wallpaperJpg} sizes="100vw" type="image/jpeg" />
          {/* Final <img> tag with a safe fallback src */}
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
