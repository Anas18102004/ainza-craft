import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const clientDir = resolve(rootDir, "dist/client");
const port = Number(process.env.PORT ?? 3000);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function resolveStaticPath(pathname) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const normalizedPath = normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = resolve(clientDir, `.${sep}${normalizedPath}`);

  if (filePath !== clientDir && !filePath.startsWith(`${clientDir}${sep}`)) {
    return null;
  }

  return filePath;
}

function tryServeStatic(req, res) {
  if (!existsSync(clientDir)) return false;

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const filePath = resolveStaticPath(url.pathname);

  if (!filePath || !existsSync(filePath)) return false;

  const fileStat = statSync(filePath);
  if (!fileStat.isFile()) return false;

  const extension = extname(filePath).toLowerCase();
  const immutableAsset =
    url.pathname.startsWith("/assets/") || url.pathname.startsWith("/cinematic/");

  res.writeHead(200, {
    "content-length": fileStat.size,
    "content-type": mimeTypes.get(extension) ?? "application/octet-stream",
    "cache-control": immutableAsset ? "public, max-age=31536000, immutable" : "public, max-age=300",
  });

  if (req.method === "HEAD") {
    res.end();
    return true;
  }

  createReadStream(filePath).pipe(res);
  return true;
}

async function loadFetchHandler() {
  const candidates = [
    join(rootDir, ".output/server/index.mjs"),
    join(rootDir, "dist/server/server.js"),
    join(rootDir, "dist/server/index.js"),
  ];

  const serverPath = candidates.find((candidate) => existsSync(candidate));

  if (!serverPath) {
    throw new Error("No TanStack Start server build found. Run npm run build:firebase first.");
  }

  const mod = await import(pathToFileURL(serverPath).href);
  const handler = mod.default ?? mod;

  if (typeof handler === "function") {
    return handler;
  }

  if (handler && typeof handler.fetch === "function") {
    return handler.fetch.bind(handler);
  }

  throw new Error(`Server build at ${serverPath} does not export a fetch handler.`);
}

function toWebRequest(req) {
  const origin = `http://${req.headers.host ?? "localhost"}`;
  const url = new URL(req.url ?? "/", origin);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }

  return new Request(url, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
    duplex: req.method === "GET" || req.method === "HEAD" ? undefined : "half",
  });
}

async function writeWebResponse(webResponse, res) {
  res.statusCode = webResponse.status;
  res.statusMessage = webResponse.statusText;

  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (webResponse.body && res.req.method !== "HEAD") {
    for await (const chunk of webResponse.body) {
      res.write(chunk);
    }
  }

  res.end();
}

const fetchHandler = await loadFetchHandler();

createServer(async (req, res) => {
  try {
    if (tryServeStatic(req, res)) return;

    const request = toWebRequest(req);
    const response = await fetchHandler(request, {}, {});
    await writeWebResponse(response, res);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("AINZA could not complete this request.");
  }
}).listen(port, () => {
  console.log(`AINZA Firebase SSR server listening on port ${port}`);
});
