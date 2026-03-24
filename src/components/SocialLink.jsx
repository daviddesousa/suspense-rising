import brandIconPng from '../assets/ig-icon-ch.png';
import brandIconWebp from '../assets/ig-icon-ch.webp';

export default function SocialLink() {
  return (
    <a
      href="https://www.instagram.com/suspenserising"
      className="brand-link"
      aria-label="Follow Us"
      target="_blank"
      rel="noreferrer nooepener"
    >
      <picture>
        <source type="image/webp" srcSet={brandIconWebp} />
        <source type="image/png" srcSet={brandIconPng} />
        <img
          src={brandIconPng}
          alt="Follow Us"
          className="brand-icon"
          width="40"
          height="40"
        />
      </picture>
    </a>
  );
}
