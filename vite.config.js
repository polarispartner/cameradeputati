import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      workbox: {
        // Precache app shell + the 6 always-needed background images.
        // Content images and PDF pages are cached on-demand at runtime.
        globPatterns: [
          "**/*.{js,css,html,svg,woff2}",
          "assets/*-bg-*.jpg",
          "assets/homepage-bg-*.jpg",
        ],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 400,
                maxAgeSeconds: 60 * 60 * 24 * 60, // 60 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      includeAssets: ["favicon.svg"],
      manifest: false,
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: ["chrome70", "safari12"],
    cssTarget: "chrome70",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
