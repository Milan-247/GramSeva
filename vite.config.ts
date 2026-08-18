import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, ".")
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {}
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/firebase/")) {
              return "firebase";
            }
            if (id.includes("node_modules/leaflet") || id.includes("node_modules/react-leaflet")) {
              return "leaflet-maps";
            }
            if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-") || id.includes("node_modules/victory-vendor")) {
              return "charts";
            }
            if (id.includes("node_modules/motion/") || id.includes("node_modules/framer-motion/")) {
              return "motion";
            }
            if (id.includes("node_modules/lucide-react/")) {
              return "icons";
            }
            if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
              return "react-core";
            }
            if (id.includes("src/data/tamilNaduLgdMaster")) {
              return "lgd-data";
            }
          }
        }
      },
      chunkSizeWarningLimit: 1000
    }
  };
});
