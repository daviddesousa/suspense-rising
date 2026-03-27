import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'

  return {
    plugins: [
      imagetools(),
      tailwindcss(),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          const beaconScript = isProduction && env.VITE_CLOUDFLARE_TOKEN
            ? `<script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "${env.VITE_CLOUDFLARE_TOKEN}"}'
    ></script>`
            : ''
          return html.replace('<!-- CLOUDFLARE_BEACON -->', beaconScript)
        },
      },
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
    },
  }
})
