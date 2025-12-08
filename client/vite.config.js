import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/CS409_Wellness_Warriors/",
  server: {
    port: 3000,
  },
});
