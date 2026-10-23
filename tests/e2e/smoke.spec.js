/**
 * Smoke cross-browser: cada página de /examples y /templates en tema claro y oscuro debe cargar
 * sin errores, con todos los componentes inicializados, sin overflow y con iconos canónicos.
 */
import { test, expect } from '@playwright/test';
import { ALL_PAGES, THEMES, withTheme } from './support/pages.js';
import { collectIssues, gotoStable, auditPage } from './support/audit.js';

const unique = (list) => [...new Set(list)];

for (const pageInfo of ALL_PAGES) {
  test.describe(`${pageInfo.kind}/${pageInfo.slug}`, () => {
    for (const theme of THEMES) {
      test(`smoke ${theme}`, async ({ page }, testInfo) => {
        const issues = collectIssues(page);
        await gotoStable(page, withTheme(pageInfo.url, theme));
        const audit = await auditPage(page);

        if (issues.externalFailures.length) {
          testInfo.annotations.push({ type: 'external-network', description: issues.externalFailures.slice(0, 3).join(' | ') });
        }

        expect.soft(audit.theme, 'tema aplicado mediante ?theme=').toBe(theme);
        expect.soft(issues.pageErrors, 'excepciones no capturadas (pageerror)').toEqual([]);
        expect.soft(issues.consoleErrors, 'errores de consola').toEqual([]);
        expect.soft(issues.badResponses, 'recursos locales 4xx/5xx').toEqual([]);
        expect.soft(audit.uninit, '[data-mtx] sin data-mtx-initialized').toEqual([]);
        expect.soft(audit.overflow, `overflow horizontal (${audit.wide.join('; ')})`).toBeLessThanOrEqual(1);
        expect.soft(unique(audit.iconText), '.material-icons renderizado como texto').toEqual([]);
        expect.soft(unique(audit.iconSize), '.material-icons con font-size distinto de 24px').toEqual([]);
      });
    }
  });
}
