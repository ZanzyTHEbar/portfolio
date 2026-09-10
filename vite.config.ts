import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import velite from "@velite/plugin-vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    TanStackRouterVite({
      target: "react",
      routesDirectory: "src/routes",
      generatedRouteTree: "src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    velite({ config: "velite.config.ts" }),
    viteReact(),
  ],
  resolve: { tsconfigPaths: true },
});
