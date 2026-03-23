import Client from 'shopify-buy';

/**
 * Shopify Storefront API client
 */
const domain = import.meta.env.VITE_PUBLIC_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN;

if (!domain || !storefrontAccessToken) {
  const errorMsg = 'Shopify environment variables are missing. Please set VITE_PUBLIC_STORE_DOMAIN and VITE_PUBLIC_STOREFRONT_API_TOKEN in your .env file.';
  if (import.meta.env.PROD) {
    throw new Error(errorMsg);
  } else {
    console.warn(errorMsg);
  }
}

export const client = Client.buildClient({
  domain: domain || '',
  storefrontAccessToken: storefrontAccessToken || '',
});

/**
 * Decodes variant titles that are Base64 encoded numbers.
 * @param {string} title 
 * @returns {string|number}
 */
export const decodeVariantTitle = (title) => {
  if (!title) return '';
  try {
    // Decode Base64 and parse as integer (e.g. "MDE=" -> "01" -> 1)
    const decoded = atob(title);
    const parsed = parseInt(decoded, 10);
    return isNaN(parsed) ? decoded : parsed;
  } catch (e) {
    return title;
  }
};
