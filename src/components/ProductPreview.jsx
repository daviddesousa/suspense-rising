import { useState, useEffect, useCallback, useRef } from 'react';
import useSWR from 'swr';
import useEmblaCarousel from 'embla-carousel-react';
import { client, decodeVariantTitle } from '../lib/shopify';
import VariantSelector from './VariantSelector';
import DOMPurify from 'dompurify';

export default function ProductPreview({ handle }) {
  const PEEK_INTERSECTION_THRESHOLD = 0.75; // Intersection observer threshold
  const PEEK_DELAY = 3000; // Delay before triggering peek animation (ms)
  const PEEK_DURATION = 700; // Duration of peek animation (ms)
  const PEEK_OFFSET = '-1.5rem'; // Offset to shift carousel briefly for peek swipe affordance

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for inventory polling
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isPeeking, setIsPeeking] = useState(false);
  const hasPeekedRef = useRef(false);
  const hasInteractedRef = useRef(false);

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

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
  });

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

  // Track user interaction to cancel discovery peek
  useEffect(() => {
    if (!emblaApi) return;
    const handleInteract = () => {
      hasInteractedRef.current = true;
    };
    emblaApi.on('dragStart', handleInteract);
    return () => {
      emblaApi.off('dragStart', handleInteract);
    };
  }, [emblaApi]);

  // One-time "peek" effect to indicate swipeability on touch devices when coming into view
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const imagesCount = product?.images?.length || 0;

    if (
      !isTouchDevice ||
      !emblaApi ||
      imagesCount <= 1 ||
      hasPeekedRef.current ||
      hasInteractedRef.current
    ) {
      return;
    }

    let peekTimer = null;
    let resetTimer = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !hasPeekedRef.current &&
            !hasInteractedRef.current
          ) {
            // Trigger peek after PEEK_DELAY of being in view with no interaction
            peekTimer = setTimeout(() => {
              if (!hasInteractedRef.current && entry.isIntersecting) {
                setIsPeeking(true);
                resetTimer = setTimeout(() => {
                  setIsPeeking(false);
                }, PEEK_DURATION);
                hasPeekedRef.current = true;
                observer.disconnect();
              }
            }, PEEK_DELAY);
          } else {
            // Cancel timer if user scrolls away before it fires
            if (peekTimer) {
              clearTimeout(peekTimer);
              peekTimer = null;
            }
          }
        });
      },
      { threshold: PEEK_INTERSECTION_THRESHOLD },
    );

    const emblaNode = emblaApi.rootNode();
    observer.observe(emblaNode);

    return () => {
      observer.disconnect();
      if (peekTimer) clearTimeout(peekTimer);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [emblaApi, product?.images?.length]);

  // Handle returning from Shopify Checkout via browser back button (BFCache)
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setIsCheckingOut(false);
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

  const buyNow = async () => {
    const isRandom = !selectedVariantId;
    let targetVariantId = selectedVariantId;

    // If no variant selected (Blind Buy mode), pick a random available one
    if (isRandom) {
      const available = product.variants.filter((v) => v.available);
      if (available.length === 0) {
        setCheckoutError('Sorry, this item is sold out!');
        return;
      }
      const random = available[Math.floor(Math.random() * available.length)];
      targetVariantId = random.id;
    }

    const targetVariant = product.variants.find(
      (v) => v.id === targetVariantId,
    );
    const figureNumber = targetVariant
      ? decodeVariantTitle(targetVariant.title)
      : 'Unknown';

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const checkout = await client.checkout.create();
      await client.checkout.addLineItems(checkout.id, [
        {
          variantId: targetVariantId,
          quantity: 1,
          customAttributes: [
            { key: '_selection_method', value: isRandom ? 'random' : 'manual' },
            { key: '_figure_number', value: figureNumber.toString() },
            {
              key: 'Number',
              value: isRandom
                ? 'Haslow has chosen for you.'
                : figureNumber.toString(),
            },
          ],
        },
      ]);
      window.location.href = checkout.webUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(
        err.message || 'Something went wrong with the checkout.',
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="product-preview grid gap-10 lg:gap-8">
      {images.length > 0 && (
        <div className="product-carousel max-sm:-mx-(--gutter-size)">
          <div
            className="carousel-inner relative overflow-hidden aspect-2/3"
            ref={emblaRef}
          >
            <div
              className={`flex h-full touch-pan-y relative transition-[left] ease-in-out`}
              style={{
                left: isPeeking ? PEEK_OFFSET : '0',
                transitionDuration: `${PEEK_DURATION}ms`,
              }}
            >
              {/* TODO test srcSet and sizes. refactor for lg breakpoint */}
              {images.map((img) => {
                const widths = [400, 600, 800, 1000, 1200, 1400, 1600];
                const srcSet = widths
                  .map((width) => `${img.src}&width=${width} ${width}w`)
                  .join(', ');

                return (
                  <div
                    key={img.id}
                    className="flex-[0_0_100%] min-w-0 relative h-full pointer-coarse:mr-[3%]"
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
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="carousel-dots flex justify-center gap-2 mt-4 pointer-events-none">
              {images.map((img, idx) => {
                const isActive = idx === currentImageIndex;
                return (
                  <div
                    key={img.id}
                    className={`carousel-dot rounded-full ${isActive ? 'is-active' : ''}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="product-info space-y-4 text-left">
        <h1 className="uppercase font-bold text-[clamp(1.5rem,12vw,3rem)] leading-none">
          {product.title}
        </h1>
        <div className="product-price text-4xl">{price}</div>
        <div
          className="product-description font-mono leading-relaxed text-sm space-y-6"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.descriptionHtml),
          }}
        />
      </div>

      <div className="product-experience text-left">
        <VariantSelector
          variants={product.variants}
          selectedVariantId={selectedVariantId}
          onSelectVariant={setSelectedVariantId}
          onBuy={buyNow}
          isLoading={isCheckingOut}
        />

        {/* @TODO improve mobile display (toast?) */}
        {checkoutError && (
          <div className="flex items-center justify-between gap-4 mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-300">
            <p className="text-red-500 text-lg flex-1">{checkoutError}</p>
            <button
              onClick={() => setCheckoutError(null)}
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
