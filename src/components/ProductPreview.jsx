import { useState, useEffect } from 'react';
import { client } from '../lib/shopify';

export default function ProductPreview({ handle }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sandbox states
  const [randomVariant, setRandomVariant] = useState(null);
  const [isLoadingSandbox, setIsLoadingSandbox] = useState(false);
  const [sandboxError, setSandboxError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const product = await client.product.fetchByHandle(handle);
        setProduct(product);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [handle]);

  if (loading) return <div className="p-8 text-center">Loading product...</div>;
  if (!product)
    return (
      <div className="p-8 text-center text-red-500">Product not found.</div>
    );

  const images = product.images || [];
  const variant = product.variants[0];
  const price = variant ? `$${variant.price.amount}` : '';

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Sandbox functions
  function rollNumber() {
    const available = product.variants.filter((v) => v.available);
    const selected = available[Math.floor(Math.random() * available.length)];
    setRandomVariant(selected);
  }

  const buyNow = async () => {
    if (!randomVariant) {
      alert('Please roll for a number first!');
      return;
    }

    setIsLoadingSandbox(true);
    setSandboxError(null);

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
      setSandboxError(err.message || 'Something went wrong with the checkout.');
      setIsLoadingSandbox(false);
    }
  };

  return (
    <div className="product-preview grid gap-8">
      {images.length > 0 && (
        <div className="product-carousel">
          <div className="carousel-inner relative overflow-hidden aspect-2/3 lg:aspect-auto lg:h-full bg-neutral-900">
            {images.map((img, idx) => (
              <img
                key={img.id}
                src={img.src}
                alt={product.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors z-10"
                  aria-label="Previous image"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors z-10"
                  aria-label="Next image"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="product-info space-y-4 text-left">
        <div className="product-price text-2xl font-medium">{price}</div>
        <div
          className="product-description leading-relaxed font-light text-lg"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      </div>

      <div className="product-experience max-w-full pt-8 border-t border-neutral-800 text-left">
        <h3 className="text-sm mb-2 uppercase tracking-widest">
          What's left...
        </h3>
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2 mb-8">
          {product.variants.map((v) => (
            <div
              key={v.id}
              className={`border border-neutral-800 p-2 text-xs text-center ${!v.available ? 'line-through opacity-30' : 'opacity-70'}`}
            >
              {v.title}
            </div>
          ))}
        </div>

        <h3 className="text-sm mb-2 uppercase tracking-widest">
          Roll for your number:
        </h3>
        <div className="flex items-center gap-4 mb-8">
          <button
            className="border border-white px-6 py-3 bg-amber-600 text-black font-bold hover:bg-amber-500 transition-colors"
            onClick={rollNumber}
          >
            ROLL
          </button>
          <p className="text-lg">
            Your number is:{' '}
            <span className="text-amber-500 font-bold">
              {randomVariant?.title || '---'}
            </span>
          </p>
        </div>

        <h3 className="text-sm mb-2 uppercase tracking-widest">
          Purchase your tee:
        </h3>
        <button
          className={`w-full border border-blue-600 px-6 py-4 bg-blue-600 text-white font-bold uppercase tracking-widest ${isLoadingSandbox ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:border-blue-700'} transition-colors`}
          onClick={buyNow}
          disabled={isLoadingSandbox}
        >
          {isLoadingSandbox ? 'OPENING CHECKOUT...' : 'BUY NOW'}
        </button>

        {/* @TODO test error display */}
        {sandboxError && (
          <p className="text-red-500 mt-2 text-sm">{sandboxError}</p>
        )}
      </div>
    </div>
  );
}
