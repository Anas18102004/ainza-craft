import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npmExecPath = process.env.npm_execpath;
const env = Object.fromEntries(
  Object.entries({
    ...process.env,
    AINZA_DEPLOY_TARGET: "firebase",
  }).filter(([, value]) => value !== undefined),
);

const child = spawn(
  npmExecPath ? process.execPath : npmCommand,
  npmExecPath ? [npmExecPath, "run", "build"] : ["run", "build"],
  {
    env,
    stdio: "inherit",
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
