import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/real-state/",

  plugins: [react()],

  optimizeDeps: {
    include: ["leaflet-draw"],
  },

  build: {
    commonjsOptions: {
      include: [/leaflet-draw/, /node_modules/],
    },
  },
});