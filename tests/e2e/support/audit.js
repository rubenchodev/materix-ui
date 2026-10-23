/**
 * Utilidades compartidas: recogida de errores, espera de carga estable y auditoría DOM/CSS en página.
 * Porta la lógica del kit CDP ui-review (audit-page.js).
 */

const LOCAL_ORIGIN = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//;

/** Recursos rotos a propósito en los ejemplos (p. ej. fallback de Avatar). */
const INTENTIONAL_MISSING = [/\/(no-existe|missing|broken)\.[a-z0-9]+(\?.*)?$/i];

const isIntentional = (url) => INTENTIONAL_MISSING.some((re) => re.test(url || ''));

/**
 * Engancha listeners de consola, pageerror y respuestas fallidas.
 * @param {import('@playwright/test').Page} page Página.
 * @returns {{consoleErrors: string[], pageErrors: string[], badResponses: string[], externalFailures: string[]}} Colecciones vivas.
 */
export const collectIssues = (page) => {
  const issues = { consoleErrors: [], pageErrors: [], badResponses: [], externalFailures: [] };
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const loc = msg.location();
    const where = loc && loc.url ? loc.url : '';
    if (isIntentional(where) || isIntentional(msg.text())) return;
    // Fallos de red externos (Google Fonts sin conexión) no son errores de la librería.
    if (where && !LOCAL_ORIGIN.test(where) && /Failed to load resource/i.test(msg.text())) {
      issues.externalFailures.push(`${msg.text()} @ ${where}`);
      return;
    }
    issues.consoleErrors.push(`${msg.text()}${where ? ` @ ${where}:${loc.lineNumber}` : ''}`);
  });
  page.on('pageerror', (err) => issues.pageErrors.push(String(err && err.stack ? err.stack.split('\n')[0] : err)));
  page.on('response', (res) => {
    if (res.status() >= 400 && LOCAL_ORIGIN.test(res.url()) && !isIntentional(res.url())) issues.badResponses.push(`${res.status()} ${res.url()}`);
  });
  page.on('requestfailed', (req) => {
    if (isIntentional(req.url())) return;
    if (LOCAL_ORIGIN.test(req.url())) issues.badResponses.push(`FAILED ${req.failure()?.errorText} ${req.url()}`);
    else issues.externalFailures.push(`${req.failure()?.errorText} ${req.url()}`);
  });
  return issues;
};

/**
 * Navega y espera a que la página quede estable: load, fuentes (incluida Material Icons) e init de Materix.
 * @param {import('@playwright/test').Page} page Página.
 * @param {string} url URL relativa.
 * @returns {Promise<void>}
 */
export const gotoStable = async (page, url) => {
  await page.goto(url, { waitUntil: 'load' });
  // La librería debe estar cargada y todos los componentes inicializados antes de auditar o capturar.
  await page
    .waitForFunction(
      () => !!window.Materix && !document.querySelector('[data-mtx]:not([data-mtx-initialized])'),
      null,
      { timeout: 10000 },
    )
    .catch(() => { /* la auditoría reporta los componentes sin inicializar */ });
  await page.evaluate(async () => {
    try {
      await Promise.race([
        Promise.all([document.fonts.load('24px "Material Icons"'), document.fonts.ready]),
        new Promise((r) => setTimeout(r, 5000)),
      ]);
    } catch {
      /* fuentes no disponibles */
    }
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  await page.waitForTimeout(150);
};

/**
 * Auditoría en página: [data-mtx] sin inicializar, overflow horizontal, iconos como texto y tamaños no canónicos.
 * @param {import('@playwright/test').Page} page Página.
 * @returns {Promise<{theme: string|null, uninit: string[], overflow: number, wide: string[], iconText: string[], iconSize: string[]}>} Resultado.
 */
export const auditPage = (page) =>
  page.evaluate(() => {
    const root = document.documentElement;
    const vw = root.clientWidth;
    const describe = (e) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${String(e.className).trim().split(/\s+/).slice(0, 2).join('.')}`;
    const uninit = [...document.querySelectorAll('[data-mtx]:not([data-mtx-initialized])')].map(
      (e) => `${describe(e)}[data-mtx=${e.getAttribute('data-mtx')}]`
    );
    const overflow = root.scrollWidth - vw;
    const wide =
      overflow > 1
        ? [...document.querySelectorAll('body *')]
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return r.right > vw + 1 && r.width > 0 && getComputedStyle(e).position !== 'fixed';
            })
            .slice(0, 6)
            .map((e) => `${describe(e)} right=${Math.round(e.getBoundingClientRect().right)}`)
        : [];
    const iconText = [];
    const iconSize = [];
    document.querySelectorAll('.material-icons, .material-icons-outlined, .material-icons-round, [class*="material-symbols-"]').forEach((i) => {
      const r = i.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const cs = getComputedStyle(i);
      if (cs.visibility === 'hidden') return;
      const txt = i.textContent.trim();
      if (txt.length > 2 && r.width > 40) iconText.push(`"${txt}" w=${Math.round(r.width)} in ${describe(i.parentElement)}`);
      const size = parseFloat(cs.fontSize);
      if (size !== 24 && !i.querySelector('svg')) iconSize.push(`${size}px "${txt}" in ${describe(i.parentElement)}`);
    });
    return { theme: root.getAttribute('data-mtx-theme'), uninit, overflow, wide, iconText, iconSize };
  });
