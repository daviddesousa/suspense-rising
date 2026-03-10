import ShopSection from './ShopSection';
import Carousel3D from './Carousel3D';
import HaslowBackground from './HaslowBackground';

import { client } from '../lib/shopify';
import { useState, use, Suspense } from 'react';

const handle = 'haslow-tee';

// 1. Start fetching immediately at the module level (returns a promise)
const productPromise = client.product.fetchByHandle(handle);

const SHOP_CONTENT = [
  'He speaks with charm and moves with grace,',
  'but there’s something cold beneath his smile',
  'like a man who’s witnessed nights he refuses to speak of.',
  'The closer you get to Haslow, the more it feels like you’re walking into a house without walls,',
  'just layers of smoke and mirrors...',
];

function ShopContent() {
  // 2. Consume the promise. React will suspend here if it's not ready.
  const product = use(productPromise);
  const available = product.variants.filter((v) => v.available);

  const [randomVariant, setRandomVariant] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function rollNumber() {
    const selected = available[Math.floor(Math.random() * available.length)];
    setRandomVariant(selected);
  }

  const buyNow = async () => {
    if (!randomVariant) {
      alert('Please roll for a number first!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const checkout = await client.checkout.create();

      await client.checkout.addLineItems(checkout.id, [
        {
          variantId: randomVariant.id,
          quantity: 1,
        },
      ]);

      window.location.href = checkout.webUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong with the checkout.');
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="max-w-[75%] mx-auto">
        <h2>buy button sandbox</h2>
        <h3>Available variants:</h3>
        <div className="grid grid-cols-10 grid-rows-3 gap-4">
          {product.variants.map((v) => (
            <div
              key={v.id}
              className={`border p-4 text-center ${!v.available ? 'line-through opacity-50' : ''}`}
            >
              {v.title}
            </div>
          ))}
        </div>
        <h3>Roll for your number:</h3>
        <button
          className="border border-white px-6 py-4 bg-amber-600 text-black"
          onClick={rollNumber}
        >
          ROLL
        </button>
        <p>Your number is: {randomVariant?.title}</p>

        <h3>Purchase your tee:</h3>
        <button
          className={`border px-6 py-4 bg-blue-600 text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          onClick={buyNow}
          disabled={isLoading}
        >
          {isLoading ? 'OPENING CHECKOUT...' : 'BUY NOW'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
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

// 3. Export a wrapper component that provides the Suspense boundary
export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading product...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
