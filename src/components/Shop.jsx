import ShopSection from './ShopSection';
import Carousel3D from './Carousel3D';
import HaslowBackground from './HaslowBackground';

import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'suspense-rising.myshopify.com',
  storefrontAccessToken: 'c233afc68457cdc3b00a15bd9b4bf638',
});

const handle = 'haslow-tee';

client.product.fetchByHandle(handle).then((product) => {
  console.log(product);
});

const SHOP_CONTENT = [
  'He speaks with charm and moves with grace,',
  'but there’s something cold beneath his smile',
  'like a man who’s witnessed nights he refuses to speak of.',
  'The closer you get to Haslow, the more it feels like you’re walking into a house without walls,',
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

      <Carousel3D />
    </main>
  );
}
