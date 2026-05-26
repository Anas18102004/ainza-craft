// @lovable.dev/vite-tanstack-config already includes the following; do not add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Firebase runs through a Node wrapper, and Vercel runs through Nitro functions.
// Neither target needs the Cloudflare adapter that powers the worker build.
const isFirebaseBuild = process.env.AINZA_DEPLOY_TARGET === "firebase";
const isVercelBuild = process.env.AINZA_DEPLOY_TARGET === "vercel";

export default defineConfig({
  cloudflare: isFirebaseBuild || isVercelBuild ? false : undefined,
  plugins: isVercelBuild ? [nitro()] : [],
  tanstackStart: {
    server: { entry: "server" },
  },
});
