import Client from 'shopify-buy';

/**
 * Shopify Storefront API client
 */
export const client = Client.buildClient({
  domain: import.meta.env.VITE_PUBLIC_STORE_DOMAIN || 'suspense-rising.myshopify.com',
  storefrontAccessToken:
    import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN || 'c233afc68457cdc3b00a15bd9b4bf638',
});
