import haslowCover from './assets/haslow.jpg';
import suspenseRisingLogo265Webp from './assets/suspense-rising-chrome-unicolor-265.webp';
import suspenseRisingLogo530Webp from './assets/suspense-rising-chrome-unicolor-530.webp';
import suspenseRisingLogo795Webp from './assets/suspense-rising-chrome-unicolor-795.webp';
import suspenseRisingLogo1060Webp from './assets/suspense-rising-chrome-unicolor-1060.webp';
import suspenseRisingLogo265Png from './assets/suspense-rising-chrome-unicolor-265.png';
import suspenseRisingLogo530Png from './assets/suspense-rising-chrome-unicolor-530.png';
import suspenseRisingLogo795Png from './assets/suspense-rising-chrome-unicolor-795.png';
import suspenseRisingLogo1060Png from './assets/suspense-rising-chrome-unicolor-1060.png';
import instagramLogoPng from './assets/instagram-icon-chrome.png';
import instagramLogoWebp from './assets/instagram-icon-chrome.webp';

function App() {
  return (
    <>
      <main>
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
        <section className="releases page-width" id="releases">
          <h2 className="section-title">Releases</h2>
          <article className="release">
            <img
              src={haslowCover}
              alt="A man's stretched and distorted face with text A story about Haslow"
              className="release-cover"
            />
            <div className="release-info">
              <h3>Haffenfold - Haslow (SR001)</h3>
              <p>
                Meet Haslow. He speaks with charm and moves with grace but
                there’s something cold beneath his smile, like a man who’s
                witnessed nights he refuses to speak of. His eyes scan every
                dancefloor like he’s always preparing for someone to betray him
                or worse, recognize him. The closer you get to Haslow, the more
                it feels like you’re walking into a house without walls, just
                layers of smoke and mirrors...
              </p>
              <div className="release-links">
                <a
                  href="https://tr.ee/GlTHS933U_"
                  target="_blank"
                  rel="noopener"
                >
                  Listen / Buy
                </a>
              </div>
            </div>
          </article>
        </section>
      </main>
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
    </>
  );
}

export default App;
