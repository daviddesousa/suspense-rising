import ShopSection from './ShopSection';
import ProductPreview from './ProductPreview';
import HaslowBackground from './HaslowBackground';
import ScrollIndicator from './ScrollIndicator';

const SHOP_CONTENT = [
  'He speaks with charm and moves with grace',
  'but there’s something cold beneath his smile',
  'The closer you get to Haslow, the more it feels like you’re walking into a house without walls',
  'just layers of smoke and mirrors...',
];

export default function Shop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <main>
      <ScrollIndicator />

      <ShopSection key="dsa89ds9d6as7d6s9ad678as987d" text="Meet Haslow." />

      <HaslowBackground />

      {SHOP_CONTENT.map((text, index) => (
        <ShopSection key={index} text={text} />
      ))}

      <div className="h-svh"></div>

      <section className="page-width">
        <div className="mb-20">
          <ProductPreview handle="the-haslow-tee" />
        </div>
        
        <div className="flex justify-center pb-20">
          <button
            onClick={scrollToTop}
            className="text-white transition-colors duration-300 uppercase tracking-[0.2em] text-[12px] font-bold border-b border-white/10 hover:border-white pb-1 cursor-pointer"
          >
            Back to top
          </button>
        </div>
      </section>
    </main>
  );
}
