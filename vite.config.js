import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      filename: "sw.js",
      // PWA serves the tavolo only. Totem entries don't register the SW.
      workbox: {
        globPatterns: [
          "src/apps/tavolo/**/*.{js,css,html,svg,woff2}",
          "assets/*-bg-*.jpg",
          "assets/homepage-bg-*.jpg",
        ],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: "/src/apps/tavolo/index.html",
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
      input: {
        tavolo: resolve(__dirname, "src/apps/tavolo/index.html"),
        "totem-costituzione": resolve(
          __dirname,
          "src/apps/totem-costituzione/index.html",
        ),
        "totem-b": resolve(__dirname, "src/apps/totem-b/index.html"),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
});
