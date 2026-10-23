/**
 * Accesibilidad automática con axe-core (WCAG 2.0/2.1 A y AA) en Chromium, tema claro y oscuro.
 * Falla solo por violaciones serious/critical; el informe completo se adjunta a cada prueba.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ALL_PAGES, THEMES, withTheme } from './support/pages.js';
import { gotoStable } from './support/audit.js';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const BLOCKING = new Set(['serious', 'critical']);

for (const pageInfo of ALL_PAGES) {
  test.describe(`${pageInfo.kind}/${pageInfo.slug}`, () => {
    for (const theme of THEMES) {
      test(`a11y ${theme}`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium', 'axe se ejecuta solo en chromium de escritorio');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await gotoStable(page, withTheme(pageInfo.url, theme));

        // Las demos del opt-out data-mtx-contrast="mui" muestran a propósito los colores exactos de MUI (< 4.5:1).
        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).exclude('[data-mtx-contrast="mui"]').analyze();
        await testInfo.attach('axe-results.json', {
          body: JSON.stringify(results.violations, null, 2),
          contentType: 'application/json',
        });

        const blocking = results.violations
          .filter((v) => BLOCKING.has(v.impact))
          .map((v) => `${v.impact} ${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
        expect(blocking, 'violaciones axe serious/critical').toEqual([]);
      });
    }
  });
}
