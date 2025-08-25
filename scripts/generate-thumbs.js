// scripts/generate-thumbs.js
// Generator miniaturek JPG (1. strona PDF) – stabilna wersja bez CORS (używa page.goto na /render)
// Zapis: public/thumbnails/<nazwa>.jpg

const fs = require("fs");
const path = require("path");
const express = require("express");
const puppeteer = require("puppeteer");

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");
const THUMBS_DIR = path.join(PUBLIC_DIR, "thumbnails");
// pdfjs-dist: serwujemy katalog build/ jako /vendor
const VENDOR_DIR = path.join(require.resolve("pdfjs-dist/package.json"), "../build/");
const PORT = 4020; // zmień, jeśli zajęty

function ensureDirs() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    throw new Error(`Nie znaleziono katalogu: ${UPLOADS_DIR}`);
  }
  if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR, { recursive: true });
  }
}

function listPdfs() {
  return fs
    .readdirSync(UPLOADS_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".pdf"))
    .map((d) => d.name)
    .sort();
}

function buildHtml(pdfUrl) {
  // Ten HTML importuje PDF.js z lokalnego /vendor i renderuje 1. stronę
  return `<!doctype html>
<html>
  <head><meta charset="utf-8"/></head>
  <body style="margin:0;padding:0;background:#fff">
    <canvas id="c"></canvas>
    <script type="module">
      (async () => {
        try {
          const pdfjsLib = await import("/vendor/pdf.mjs");
          pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.js";

          const loadingTask = pdfjsLib.getDocument("${pdfUrl}");
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);

          const viewport0 = page.getViewport({ scale: 1 });
          const scale = 1000 / viewport0.width; // docelowa szerokość
          const viewport = page.getViewport({ scale });

          const canvas = document.getElementById("c");
          const ctx = canvas.getContext("2d");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);

          await page.render({ canvasContext: ctx, viewport }).promise;
          document.title = "READY";
          console.log("✅ READY");
        } catch (err) {
          console.error("❌ PDFJS ERROR:", err && (err.stack || err.message || err));
          document.title = "ERROR";
        }
      })();
    </script>
  </body>
</html>`;
}

async function startServer() {
  const app = express();
  app.use(express.static(PUBLIC_DIR));            // / -> public/*
  app.use("/vendor", express.static(VENDOR_DIR)); // /vendor -> node_modules/pdfjs-dist/build/*

  // Strona renderująca miniaturę; URL: /render?u=/uploads/Nazwa.pdf
  app.get("/render", (req, res) => {
    const u = req.query.u;
    if (typeof u !== "string" || !u.startsWith("/uploads/")) {
      return res.status(400).send("Bad request");
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(buildHtml(u));
  });

  return new Promise((resolve) => {
    const srv = app.listen(PORT, () => resolve(srv));
  });
}

async function renderOne(page, pdf) {
  const name = pdf.replace(/\.pdf$/i, "");
  const out = path.join(THUMBS_DIR, `${name}.jpg`);
  const pdfUrl = `/uploads/${encodeURIComponent(pdf)}`;
  const renderUrl = `http://localhost:${PORT}/render?u=${pdfUrl}`;

  console.log(`→ Generuję miniaturę: ${pdf} → thumbnails/${name}.jpg`);

  const onConsole = (msg) => {
    console.log(`[PAGE ${msg.type().toUpperCase()}]`, msg.text());
  };
  page.on("console", onConsole);

  await page.goto(renderUrl, { waitUntil: "domcontentloaded" });

  let ok = false;
  try {
    await page.waitForFunction(() => document.title === "READY", { timeout: 45000 });
    ok = true;
  } catch {
    const title = await page.title().catch(() => "");
    console.warn(`! Błąd renderu: ${pdf} (title="${title}")`);
  }

  let success = false;
  if (ok) {
    const canvas = await page.$("#c");
    if (!canvas) {
      console.warn(`! Brak canvas: ${pdf}`);
    } else {
      await canvas.screenshot({ path: out, type: "jpeg", quality: 85 });
      success = true;
    }
  }

  page.off("console", onConsole);
  return success;
}

async function main() {
  ensureDirs();
  const pdfs = listPdfs();
  if (!pdfs.length) {
    console.log("Brak PDF-ów w", UPLOADS_DIR);
    return;
  }

  const server = await startServer();
  console.log(`Serwuję public/ na http://localhost:${PORT} (PDF.js pod /vendor/, render pod /render)`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 800 });

  let ok = 0, fail = 0;
  for (const pdf of pdfs) {
    const success = (await renderOne(page, pdf)) || (await renderOne(page, pdf)); // retry 1x
    if (success) ok++; else fail++;
  }

  await browser.close();
  server.close();

  console.log(`\nZakończono. OK: ${ok}, błędów: ${fail}`);
  console.log(`Miniatury w: ${THUMBS_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
