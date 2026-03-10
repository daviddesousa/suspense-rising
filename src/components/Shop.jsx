import ShopSection from './ShopSection';
import Carousel3D from './Carousel3D';
import HaslowBackground from './HaslowBackground';

import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'suspense-rising.myshopify.com',
  storefrontAccessToken: 'c233afc68457cdc3b00a15bd9b4bf638',
});

const handle = 'haslow-tee';

const product = await client.product.fetchByHandle(handle);

const available = product.variants.filter((v) => v.available);

const randomVariant = available[Math.floor(Math.random() * available.length)];
// console.log(randomVariant.title);

// image helper
const imageUrl = client.image.helpers.imageForSize(product.images[0], {
  maxWidth: 50,
  maxHeight: 50,
});
// console.log(imageUrl);

const checkout = await client.checkout.create();

await client.checkout.addLineItems(checkout.id, [
  {
    variantId: randomVariant.id,
    quantity: 1,
  },
]);

// window.location.href = checkout.webUrl;

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
      <div>
        <h2>buy button sandbox</h2>
        Your random number: {randomVariant.title}
      </div>

      <ShopSection key="dsa89ds9d6as7d6s9ad678as987d" text="Meet Haslow." />

      <HaslowBackground />

      {SHOP_CONTENT.map((text, index) => (
        <ShopSection key={index} text={text} />
      ))}

      <Carousel3D />
    </main>
  );
}
