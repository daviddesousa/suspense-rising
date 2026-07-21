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
      sourcemap: false,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              // Order by priority: specific groups first, broad catch-all last.
              // Higher priority is evaluated first; once a module is claimed it
              // is removed from consideration for lower-priority groups.
              {
                name: 'react',
                test: /[\\/]node_modules[\\/]react/,
                priority: 30,
              },
              {
                name: 'animation',
                test: /[\\/]node_modules[\\/](gsap|@gsap|motion|lenis)/,
                priority: 20,
              },
              {
                name: 'vendor',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
              },
            ],
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
    },
  }
})
