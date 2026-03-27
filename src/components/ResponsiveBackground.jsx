import { preload } from 'react-dom';

import wallpaperAvif from '../assets/wallpaper-bw.jpg?w=640;768;1024;1280;1536;1920;2560;2880&format=avif&as=srcset';
import wallpaperWebp from '../assets/wallpaper-bw.jpg?w=640;768;1024;1280;1536;1920;2560;2880&format=webp&as=srcset';
import wallpaperJpg from '../assets/wallpaper-bw.jpg?w=640;768;1024;1280;1536;1920;2560;2880&as=srcset';
import wallpaperFallback from '../assets/wallpaper-bw.jpg?w=1920';
// React DOM uses the first arg to preload() as a deduplication key, not as an href.
// When imageSrcSet is provided, React omits href entirely from the <link> tag (valid per spec).
// A stable single-URL string is used here so the key is meaningful and collision-free.
import wallpaperAvif640 from '../assets/wallpaper-bw.jpg?w=640&format=avif';

import WavyBackgroundWebGL from './WavyBackgroundWebGL';

// Preload the background early to reduce Resource Load Delay.
// React DOM injects <link rel="preload" as="image" imagesrcset="..." imagesizes="...">
// without an href (correct per spec when imagesrcset is present).
preload(wallpaperAvif640, {
  as: 'image',
  imageSrcSet: wallpaperAvif,
  imageSizes: '100vw',
  fetchPriority: 'high',
});

/**
 * ResponsiveBackground handles the site's main wallpaper using modern responsive image practices.
 * By using vite-imagetools, it automatically:
 * 1. Resizes the 2880px master image into multiple widths.
 * 2. Compresses and optimizes the output.
 * 3. Handles AVIF and WebP generation with JPG fallback.
 * 4. Benefits from Vite's automatic hashing for cache-busting.
 * When on the home page, it uses a high-performance WebGL context to provide a wavy displacement effect.
 * For other pages, it falls back to standard responsive <img> elements.
 */
const ResponsiveBackground = ({ isShop, isHome }) => {
  return (
    <div
      className={`
        -z-20 pointer-events-none select-none bg-(--main-bg-color)
        ${isShop ? 'absolute inset-x-0 top-0' : 'fixed inset-0'}
      `}
      aria-hidden="true"
    >
      <picture>
        <source srcSet={wallpaperAvif} sizes="100vw" type="image/avif" />
        <source srcSet={wallpaperWebp} sizes="100vw" type="image/webp" />
        <source srcSet={wallpaperJpg} sizes="100vw" type="image/jpeg" />
        <img
          src={wallpaperFallback}
          alt=""
          width={2880}
          height={1620}
          className={`absolute inset-0 w-full min-h-[110svh] object-cover`}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
      </picture>
      {isHome && <WavyBackgroundWebGL imageUrl={wallpaperFallback} />}
    </div>
  );
};

export default ResponsiveBackground;
