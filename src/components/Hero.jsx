import suspenseRisingLogo265Webp from '../assets/suspense-rising-chrome-unicolor-265.webp';
import suspenseRisingLogo530Webp from '../assets/suspense-rising-chrome-unicolor-530.webp';
import suspenseRisingLogo795Webp from '../assets/suspense-rising-chrome-unicolor-795.webp';
import suspenseRisingLogo1060Webp from '../assets/suspense-rising-chrome-unicolor-1060.webp';
import suspenseRisingLogo265Png from '../assets/suspense-rising-chrome-unicolor-265.png';
import suspenseRisingLogo530Png from '../assets/suspense-rising-chrome-unicolor-530.png';
import suspenseRisingLogo795Png from '../assets/suspense-rising-chrome-unicolor-795.png';
import suspenseRisingLogo1060Png from '../assets/suspense-rising-chrome-unicolor-1060.png';

export default function Hero() {
  return (
    <section className="hero">
      <h1 className="sr-only">Suspense Rising</h1>
      <picture className="hero-center">
        <source
          type="image/webp"
          srcSet={`
          ${suspenseRisingLogo265Webp},
          ${suspenseRisingLogo530Webp} 2x,
          ${suspenseRisingLogo795Webp} 3x,
          ${suspenseRisingLogo1060Webp} 4x
        `}
        />
        <source
          type="image/png"
          srcSet={`
          ${suspenseRisingLogo265Png},
          ${suspenseRisingLogo530Png} 2x,
          ${suspenseRisingLogo795Png} 3x,
          ${suspenseRisingLogo1060Png} 4x
        `}
        />
        <img
          src={suspenseRisingLogo265Png}
          alt="Suspense Rising in chrome lettering"
          width="265"
          height="28"
          className="logo"
        />
      </picture>
      <a className="scroll-down" href="#releases">
        SCROLL DOWN
      </a>
    </section>
  );
}
