/**
 * Servidor estático mínimo (sin dependencias) que sirve dist-examples/ (`npm run build:examples`) para las pruebas E2E.
 * Uso: node tests/e2e/server.mjs [puerto]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist-examples');
const PORT_DEFAULT = 4183;
const PORT = Number(process.argv[2] || process.env.E2E_PORT || PORT_DEFAULT);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

/**
 * Resuelve la ruta pedida dentro de ROOT impidiendo salir del repositorio.
 * @param {string} urlPath Ruta de la URL.
 * @returns {string|null} Ruta absoluta o null si es inválida.
 */
const resolveSafe = (urlPath) => {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const abs = path.resolve(ROOT, '.' + decoded);
  return abs === ROOT || abs.startsWith(ROOT + path.sep) ? abs : null;
};

const server = http.createServer((req, res) => {
  let file = resolveSafe(req.url || '/');
  if (!file) {
    res.writeHead(400).end('Bad request');
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[e2e] Sirviendo ${ROOT} en http://127.0.0.1:${PORT}`);
});
