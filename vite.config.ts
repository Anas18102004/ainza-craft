// @lovable.dev/vite-tanstack-config already includes the following; do not add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Firebase App Hosting runs the app through a Node server wrapper, so it does not
// need the Cloudflare Vite adapter that powers the existing worker build.
const isFirebaseBuild = process.env.AINZA_DEPLOY_TARGET === "firebase";

export default defineConfig({
  cloudflare: isFirebaseBuild ? false : undefined,
  tanstackStart: {
    server: { entry: "server" },
  },
});
