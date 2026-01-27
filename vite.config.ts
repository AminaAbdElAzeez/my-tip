import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  resolve: {
    alias: {
      utlis: resolve(__dirname, "src") + "/utlis",
      store: resolve(__dirname, "src") + "/store",
      routers: resolve(__dirname, "src") + "/routers",
      components: resolve(__dirname, "src") + "/components",
      middlewares: resolve(__dirname, "src") + "/middlewares",
      containers: resolve(__dirname, "src") + "/containers",
      assets: resolve(__dirname, "src") + "/assets",
      loggers: resolve(__dirname, "src") + "/loggers",
      lottiefiles: resolve(__dirname, "src") + "/lottiefiles",
    },
  },
  optimizeDeps: {
    include: ["redux-thunk"],
  },
});
