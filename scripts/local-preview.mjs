import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const clients = new Set();

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const liveReloadSnippet = `
<script>
(() => {
  const source = new EventSource("/__events");
  source.onmessage = (event) => {
    if (event.data === "reload") window.location.reload();
  };
})();
</script>`;

function sendReload() {
  for (const res of clients) {
    res.write("data: reload\\n\\n");
  }
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const filePath = resolve(root, normalize(relative));
  return filePath.startsWith(root) ? filePath : null;
}

const server = createServer(async (req, res) => {
  if (req.url === "/__events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("\\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  try {
    let filePath = safePath(req.url || "/");
    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) filePath = join(filePath, "index.html");

    const ext = extname(filePath).toLowerCase();
    let body = await readFile(filePath);

    if (ext === ".html") {
      body = Buffer.from(body.toString("utf8").replace("</body>", `${liveReloadSnippet}</body>`));
    }

    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

watch(root, { recursive: true }, (_event, filename) => {
  if (!filename) return;
  const name = filename.replaceAll("\\", "/");
  if (
    name.startsWith(".git/") ||
    name.includes("__pycache__/") ||
    name.startsWith("node_modules/") ||
    name.startsWith("dist/")
  ) {
    return;
  }
  sendReload();
});

server.listen(port, () => {
  console.log(`Local preview running at http://localhost:${port}/`);
  console.log("Press Ctrl+C to stop.");
});
