import { createStorefrontClient } from '@shopify/hydrogen-react';

export const shopifyConfig = {
  storeDomain: import.meta.env.VITE_PUBLIC_STORE_DOMAIN,
  storefrontToken: import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN,
  storefrontApiVersion: '2026-01',
  countryIsoCode: 'US',
  languageIsoCode: 'EN',
};

export const client = createStorefrontClient({
  storeDomain: shopifyConfig.storeDomain,
  publicStorefrontToken: shopifyConfig.storefrontToken,
  storefrontApiVersion: shopifyConfig.storefrontApiVersion,
});
