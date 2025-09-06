import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // Only load Replit plugins in development with REPL_ID
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? await (async () => {
          try {
            const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
            const cartographer = await import("@replit/vite-plugin-cartographer");
            return [
              runtimeErrorOverlay.default(),
              cartographer.cartographer(),
            ];
          } catch (error) {
            console.log("Replit plugins not available, skipping...");
            return [];
          }
        })()
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});