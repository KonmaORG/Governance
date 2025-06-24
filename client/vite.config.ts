import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), tailwindcss()],
  resolve: {
    alias: {
      buffer: "buffer",
      crypto: "crypto-browserify",
    },
  },
  define: {
    global: "window", // 👈 This makes `global` work like in Node.js
  },
  optimizeDeps: {
    include: ["buffer", "process", "crypto-browserify"],
  },
  build: {
    target: "esnext",
  },
  server: {
    proxy: {
      "/bf": {
        rewrite: (path) => path.replace(/^\/bf/, ""),
        target: "https://cardano-preview.blockfrost.io/api/v0",
        changeOrigin: true,
        headers: {
          project_id: "previewnOasOUIU1qb9mtCd26tCsM3IvCTrhBhB",
        },
      },
    },
  },
});
