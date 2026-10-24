/**
 * Utilidades E2E: recogida de errores, carga estable y auditoría DOM/CSS (portado de vainilla).
 */
import type { Page } from '@playwright/test';

const LOCAL_ORIGIN = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//;

/** Recursos rotos a propósito en los ejemplos (p. ej. fallback de Avatar). */
const INTENTIONAL_MISSING = [/\/(no-existe|missing|broken)\.[a-z0-9]+(\?.*)?$/i];

const isIntentional = (url: string | undefined): boolean => INTENTIONAL_MISSING.some((re) => re.test(url || ''));

export interface PageIssues {
  consoleErrors: string[];
  pageErrors: string[];
  badResponses: string[];
  externalFailures: string[];
}

/**
 * Engancha listeners de consola, pageerror y respuestas fallidas.
 * @param {Page} page Página.
 * @returns {PageIssues} Colecciones vivas.
 */
export const collectIssues = (page: Page): PageIssues => {
  const issues: PageIssues = { consoleErrors: [], pageErrors: [], badResponses: [], externalFailures: [] };
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const where = msg.location()?.url ?? '';
    if (isIntentional(where) || isIntentional(msg.text())) return;
    // Fallos de red externos (Google Fonts sin conexión) no son errores de la librería.
    if (where && !LOCAL_ORIGIN.test(where) && /Failed to load resource/i.test(msg.text())) {
      issues.externalFailures.push(`${msg.text()} @ ${where}`);
      return;
    }
    issues.consoleErrors.push(`${msg.text()}${where ? ` @ ${where}:${msg.location().lineNumber}` : ''}`);
  });
  page.on('pageerror', (err) => issues.pageErrors.push(String(err?.stack ? err.stack.split('\n')[0] : err)));
  page.on('response', (res) => {
    if (res.status() >= 400 && LOCAL_ORIGIN.test(res.url()) && !isIntentional(res.url())) {
      issues.badResponses.push(`${res.status()} ${res.url()}`);
    }
  });
  page.on('requestfailed', (req) => {
    if (isIntentional(req.url())) return;
    if (LOCAL_ORIGIN.test(req.url())) issues.badResponses.push(`FAILED ${req.failure()?.errorText} ${req.url()}`);
    else issues.externalFailures.push(`${req.failure()?.errorText} ${req.url()}`);
  });
  return issues;
};

/**
 * Navega y espera a que React monte la página (`data-example-ready`) y carguen las fuentes.
 * @param {Page} page Página.
 * @param {string} url URL relativa.
 * @returns {Promise<void>}
 */
export const gotoStable = async (page: Page, url: string): Promise<void> => {
  await page.goto(url, { waitUntil: 'load' });
  await page
    .waitForFunction(() => document.documentElement.hasAttribute('data-example-ready'), null, { timeout: 10_000 })
    .catch(() => {
      /* el smoke reporta el error de montaje vía pageerror/consola */
    });
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

export interface PageAudit {
  theme: string | null;
  ready: boolean;
  overflow: number;
  wide: string[];
  iconText: string[];
  iconSize: string[];
}

/**
 * Auditoría en página: montaje, overflow horizontal e iconos (texto visible o tamaño no canónico).
 * @param {Page} page Página.
 * @returns {Promise<PageAudit>} Resultado.
 */
export const auditPage = (page: Page): Promise<PageAudit> =>
  page.evaluate(() => {
    const root = document.documentElement;
    const vw = root.clientWidth;
    const describe = (e: Element) =>
      `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${String(e.className).trim().split(/\s+/).slice(0, 2).join('.')}`;
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
    const iconText: string[] = [];
    const iconSize: string[] = [];
    document
      .querySelectorAll('.material-icons, .material-icons-outlined, .material-icons-round, [class*="material-symbols-"]')
      .forEach((i) => {
        const r = i.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const cs = getComputedStyle(i);
        if (cs.visibility === 'hidden') return;
        const txt = (i.textContent || '').trim();
        const parent = i.parentElement ?? i;
        if (txt.length > 2 && r.width > 40) iconText.push(`"${txt}" w=${Math.round(r.width)} in ${describe(parent)}`);
        const size = parseFloat(cs.fontSize);
        if (size !== 24 && !i.querySelector('svg')) iconSize.push(`${size}px "${txt}" in ${describe(parent)}`);
      });
    return {
      theme: root.getAttribute('data-mtx-theme'),
      ready: root.hasAttribute('data-example-ready'),
      overflow,
      wide,
      iconText,
      iconSize,
    };
  });
