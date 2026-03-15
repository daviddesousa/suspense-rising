import Client from 'shopify-buy';

/**
 * Shopify Storefront API client
 */
const domain = import.meta.env.VITE_PUBLIC_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN;

if (!domain || !storefrontAccessToken) {
  const errorMsg = 'Shopify environment variables are missing. Please set VITE_PUBLIC_STORE_DOMAIN and VITE_PUBLIC_STOREFRONT_API_TOKEN in your .env file.';
  if (import.meta.env.DEV) {
    console.warn(errorMsg);
  }
}

export const client = Client.buildClient({
  domain: domain || '',
  storefrontAccessToken: storefrontAccessToken || '',
});
