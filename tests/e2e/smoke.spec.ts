/**
 * Smoke: cada página de examples/ en tema claro y oscuro carga sin errores, sin 4xx/5xx y sin scroll horizontal.
 */
import { test, expect } from '@playwright/test';
import { ALL_PAGES, THEMES, withTheme } from './support/pages';
import { auditPage, collectIssues, gotoStable } from './support/audit';

const unique = (list: string[]): string[] => [...new Set(list)];

for (const pageInfo of ALL_PAGES) {
  test.describe(`examples/${pageInfo.slug}`, () => {
    for (const theme of THEMES) {
      test(`smoke ${theme}`, async ({ page }, testInfo) => {
        const issues = collectIssues(page);
        await gotoStable(page, withTheme(pageInfo.url, theme));
        const audit = await auditPage(page);

        if (issues.externalFailures.length) {
          testInfo.annotations.push({ type: 'external-network', description: issues.externalFailures.slice(0, 3).join(' | ') });
        }

        expect.soft(audit.ready, 'React montó la página (data-example-ready)').toBe(true);
        expect.soft(audit.theme, 'tema aplicado mediante ?theme=').toBe(theme);
        expect.soft(issues.pageErrors, 'excepciones no capturadas (pageerror)').toEqual([]);
        expect.soft(issues.consoleErrors, 'errores de consola').toEqual([]);
        expect.soft(issues.badResponses, 'recursos locales 4xx/5xx').toEqual([]);
        expect.soft(audit.overflow, `overflow horizontal (${audit.wide.join('; ')})`).toBeLessThanOrEqual(1);
        expect.soft(unique(audit.iconText), '.material-icons renderizado como texto').toEqual([]);
        expect.soft(unique(audit.iconSize), '.material-icons con font-size distinto de 24px').toEqual([]);
      });
    }
  });
}
