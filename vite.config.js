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
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2}"],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
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
