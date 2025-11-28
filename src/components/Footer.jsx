import instagramLogoPng from '../assets/instagram-icon-chrome.png';
import instagramLogoWebp from '../assets/instagram-icon-chrome.webp';

export default function Footer() {
  return (
    <footer>
      <a
        href="https://www.instagram.com/suspenserising"
        className="instagram-link"
        aria-label="Follow us on Instagram"
        target="_blank"
        rel="noreferrer nooepener"
      >
        <picture>
          <source type="image/webp" srcSet={instagramLogoWebp} />
          <source type="image/png" srcSet={instagramLogoPng} />
          <img
            src={instagramLogoPng}
            alt="Instagram Logo"
            className="instagram-icon"
            width="40"
            height="40"
          />
        </picture>
      </a>
    </footer>
  );
}
