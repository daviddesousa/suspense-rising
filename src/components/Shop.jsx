import ShopSection from './ShopSection';
import Carousel3D from './Carousel3D';
import HaslowBackground from './HaslowBackground';

import { ProductProvider, useProduct } from '@shopify/hydrogen-react';
import { useState, useEffect } from 'react';
import { client } from '../shopify.config';

export function Product({ product }) {
  return (
    <div className="product-wrapper">
      <ProductProvider data={product} initialVariantId={haslowTeeVariantId}>
        <UsingProduct />
      </ProductProvider>
    </div>
  );
}

function UsingProduct() {
  const { product, variants, setSelectedVariant } = useProduct();
  return (
    <div className="using-product-inner">
      <h1>{product?.title}</h1>
      {variants?.map((variant) => (
        <button onClick={() => setSelectedVariant(variant)} key={variant?.id}>
          {variant?.title}
        </button>
      ))}
    </div>
  );
}

const haslowTeeProductId = 8692093649050;
const haslowTeeVariantId = 'gid://shopify/ProductVariant/46817875722394';

const PRODUCT_QUERY = `
  query product($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      descriptionHtml
      options {
        id
        name
        optionValues {
          id
          name
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

const SHOP_CONTENT = [
  'He speaks with charm and moves with grace,',
  'but there’s something cold beneath his smile',
  'like a man who’s witnessed nights he refuses to speak of.',
  'The closer you get to Haslow, the more it feels like you’re walking into a house without walls,',
  'just layers of smoke and mirrors...',
];

export default function Shop() {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(client.getStorefrontApiUrl(), {
          method: 'POST',
          headers: client.getPublicTokenHeaders(),
          body: JSON.stringify({
            query: PRODUCT_QUERY,
            variables: {
              id: `gid://shopify/Product/${haslowTeeProductId}`,
            },
          }),
        });

        const { data } = await response.json();
        setProductData(data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProduct();
  }, []);

  return (
    <main>
      <div className="shop-product-container">
        {productData && <Product product={productData} />}
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
