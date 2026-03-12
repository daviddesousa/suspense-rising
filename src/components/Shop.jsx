import ShopSection from './ShopSection';
import ProductPreview from './ProductPreview';
import HaslowBackground from './HaslowBackground';

const SHOP_CONTENT = [
  'He speaks with charm and moves with grace',
  'but there’s something cold beneath his smile',
  'The closer you get to Haslow, the more it feels like you’re walking into a house without walls',
  'just layers of smoke and mirrors...',
];

export default function Shop() {
  return (
    <main>
      <ShopSection key="dsa89ds9d6as7d6s9ad678as987d" text="Meet Haslow." />

      <HaslowBackground />

      {SHOP_CONTENT.map((text, index) => (
        <ShopSection key={index} text={text} />
      ))}

      <div className="h-svh"></div>

      <section className="page-width pb-30">
        <ProductPreview handle="the-haslow-tee" />
      </section>
    </main>
  );
}
