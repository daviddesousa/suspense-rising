import { useState, useEffect } from 'react';
import { client } from '../lib/shopify';
import RealTimeDropStore from './RealTimeDropStore';

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
  const amount = variant ? parseFloat(variant.price.amount) : 0;
  const price = variant ? `$${amount.toFixed(2)}` : '';

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
      setSandboxError('Please roll for a number first!');
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
          <div className="carousel-inner relative overflow-hidden aspect-2/3 bg-neutral-900">
            {images.map((img, idx) => {
              const widths = [400, 600, 800, 1000, 1200, 1400, 1600];
              const srcSet = widths
                .map((width) => `${img.src}&width=${width} ${width}w`)
                .join(', ');

              return (
                <img
                  key={img.id}
                  src={`${img.src}&width=800`}
                  srcSet={srcSet}
                  sizes="(min-width: 64rem) 30vw, 90vw"
                  alt={product.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              );
            })}

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
        <div className="product-price text-[27px] font-medium">{price}</div>
        <div
          className="product-description leading-relaxed font-light text-lg"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      </div>

      <div className="product-experience max-w-full text-left">
        <RealTimeDropStore
          onBuy={buyNow}
          isLoading={isLoadingSandbox}
          onRoll={(number) => {
            setSandboxError(null);
            const available = product.variants.filter((v) => v.available);
            // Since variants are 1-indexed in the UI, we match by index or logic
            // For now, let's assume the roll number corresponds to the variant index or just pick one
            const selected = product.variants[number - 1] || available[0];
            setRandomVariant(selected);
          }}
        />

        {/* @TODO improve mobile display (toast?) */}
        {sandboxError && (
          <div className="flex items-center justify-between gap-4 mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-300">
            <p className="text-red-500 text-lg flex-1">{sandboxError}</p>
            <button
              onClick={() => setSandboxError(null)}
              className="p-1 text-red-500 hover:bg-red-500/10 rounded-full transition-all active:scale-95 cursor-pointer"
              aria-label="Dismiss error"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
