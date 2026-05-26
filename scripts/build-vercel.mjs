import { spawnSync } from "node:child_process";

const result = spawnSync("npm", ["run", "build"], {
  env: {
    ...process.env,
    AINZA_DEPLOY_TARGET: "vercel",
  },
  shell: process.platform === "win32",
  stdio: "inherit",
});

process.exit(result.status ?? 1);
