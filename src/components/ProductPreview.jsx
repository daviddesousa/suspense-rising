import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import useEmblaCarousel from 'embla-carousel-react';
import { client } from '../lib/shopify';
import RealTimeDropStore from './RealTimeDropStore';
import DOMPurify from 'dompurify';

export default function ProductPreview({ handle }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for inventory polling
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [isLoadingSandbox, setIsLoadingSandbox] = useState(false);
  const [sandboxError, setSandboxError] = useState(null);

  const {
    data: product,
    error,
    isLoading,
  } = useSWR(
    handle ? ['product', handle] : null,
    () => client.product.fetchByHandle(handle),
    {
      refreshInterval:
        import.meta.env.PROD ||
        import.meta.env.VITE_ENABLE_PRODUCT_POLLING === 'true'
          ? 5000
          : 0,
      refreshWhenHidden: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      shouldRetryOnError: false,
    },
  );

  const loading = isLoading;
  const productNotFound = !isLoading && !error && !product;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setCurrentImageIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Handle returning from Shopify Checkout via browser back button (BFCache)
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setIsLoadingSandbox(false);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  if (loading) return <div className="p-8 text-center">Loading product...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load product.{error?.message ? ` (${error.message})` : ''}
      </div>
    );
  if (productNotFound)
    return (
      <div className="p-8 text-center text-red-500">Product not found.</div>
    );

  const images = product.images || [];
  const pricingVariant = product.variants[0];
  const amount = pricingVariant ? parseFloat(pricingVariant.price.amount) : 0;
  const price = pricingVariant
    ? `$${amount.toFixed(2).replace(/\.00$/, '')}`
    : '';

  const buyNow = async (variantIdToBuy) => {
    let targetVariantId = variantIdToBuy || selectedVariantId;

    // If no variant selected (Blind Buy mode), pick a random available one
    if (!targetVariantId) {
      const available = product.variants.filter((v) => v.available);
      if (available.length === 0) {
        setSandboxError('Sorry, this item is sold out!');
        return;
      }
      const random = available[Math.floor(Math.random() * available.length)];
      targetVariantId = random.id;
    }

    setIsLoadingSandbox(true);
    setSandboxError(null);

    try {
      const checkout = await client.checkout.create();
      await client.checkout.addLineItems(checkout.id, [
        {
          variantId: targetVariantId,
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
        <div className="product-carousel max-sm:-mx-(--gutter-size)">
          <div
            className="carousel-inner relative overflow-hidden aspect-2/3"
            ref={emblaRef}
          >
            <div className="flex h-full touch-pan-y">
              {/* TODO test srcSet and sizes */}
              {images.map((img) => {
                const widths = [400, 600, 800, 1000, 1200, 1400, 1600];
                const srcSet = widths
                  .map((width) => `${img.src}&width=${width} ${width}w`)
                  .join(', ');

                return (
                  <div
                    key={img.id}
                    className="flex-[0_0_100%] min-w-0 relative h-full"
                  >
                    <img
                      src={`${img.src}&width=800`}
                      srcSet={srcSet}
                      sizes="(min-width: 64rem) 33vw, 100vw"
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-contain select-none"
                    />
                  </div>
                );
              })}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={scrollPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white border border-white bg-black hover:bg-white hover:text-black cursor-pointer p-2 rounded-full transition-colors z-10 pointer-coarse:hidden"
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
                  onClick={scrollNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white border border-white bg-black hover:bg-white hover:text-black cursor-pointer p-2 rounded-full transition-colors z-10 pointer-coarse:hidden"
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
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 pointer-events-none">
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
        <h1 className="text-5xl uppercase font-bold">{product.title}</h1>
        <div className="product-price text-4xl">{price}</div>
        <div
          className="product-description font-mono leading-relaxed text-sm space-y-6"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.descriptionHtml),
          }}
        />
      </div>

      <div className="product-experience text-left">
        <RealTimeDropStore
          variants={product.variants}
          selectedVariantId={selectedVariantId}
          onSelectVariant={setSelectedVariantId}
          onBuy={buyNow}
          isLoading={isLoadingSandbox}
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
