import brandIconAvif from '../assets/ig-icon-ch.png?w=40;80;120&format=avif&as=srcset';
import brandIconWebp from '../assets/ig-icon-ch.png?w=40;80;120&format=webp&as=srcset';
import brandIconJpg from '../assets/ig-icon-ch.png?w=40;80;120&format=jpg&as=srcset';
import brandIconFallback from '../assets/ig-icon-ch.png?w=40';

export default function SocialLink() {
  return (
    <a
      href="https://www.instagram.com/suspenserising"
      className="brand-link"
      aria-label="Follow Us"
      target="_blank"
      rel="noreferrer noopener"
    >
      <picture>
        <source srcSet={brandIconAvif} sizes="40px" type="image/avif" />
        <source srcSet={brandIconWebp} sizes="40px" type="image/webp" />
        <source srcSet={brandIconJpg} sizes="40px" type="image/jpeg" />
        <img
          src={brandIconFallback}
          alt="Follow Us"
          className="brand-icon"
          width="40"
          height="40"
          decoding="async"
        />
      </picture>
    </a>
  );
}
