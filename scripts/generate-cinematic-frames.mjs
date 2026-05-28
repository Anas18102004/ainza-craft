import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePattern = resolve(root, "public/cinematic/ainza-framed-1080/frame_%04d.jpg");
const finalStill = resolve(root, "public/cinematic/5TH.png");

const variants = [
  {
    label: "720p",
    width: 1280,
    outputDir: resolve(root, "public/cinematic/ainza-framed-720"),
    finalOutput: resolve(root, "public/cinematic/5TH-720.jpg"),
    quality: 4,
  },
  {
    label: "540p",
    width: 960,
    outputDir: resolve(root, "public/cinematic/ainza-framed-540"),
    finalOutput: resolve(root, "public/cinematic/5TH-540.jpg"),
    quality: 5,
  },
];

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    windowsHide: true,
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

for (const variant of variants) {
  mkdirSync(variant.outputDir, { recursive: true });

  const firstFrame = resolve(variant.outputDir, "frame_0001.jpg");
  const lastFrame = resolve(variant.outputDir, "frame_0721.jpg");
  if (!existsSync(firstFrame) || !existsSync(lastFrame)) {
    console.log(`Generating ${variant.label} cinematic frames...`);
    run("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-framerate",
      "30",
      "-start_number",
      "1",
      "-i",
      sourcePattern,
      "-vf",
      `scale=${variant.width}:-2:flags=lanczos`,
      "-q:v",
      String(variant.quality),
      "-start_number",
      "1",
      resolve(variant.outputDir, "frame_%04d.jpg"),
    ]);
  } else {
    console.log(`${variant.label} cinematic frames already exist; skipping.`);
  }

  if (!existsSync(variant.finalOutput)) {
    console.log(`Generating ${variant.label} final still...`);
    run("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      finalStill,
      "-vf",
      `scale=${variant.width}:-2:flags=lanczos`,
      "-q:v",
      String(variant.quality),
      variant.finalOutput,
    ]);
  } else {
    console.log(`${variant.label} final still already exists; skipping.`);
  }
}
