/**
 * Regresión visual por página (Chromium): escritorio 1280 en claro y oscuro, y móvil (Pixel 5) en claro.
 * Capturas base: `npm run test:visual:update` (se guardan en tests/e2e/__screenshots__/{proyecto}/).
 */
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { ALL_PAGES, withTheme } from './support/pages.js';
import { gotoStable } from './support/audit.js';

/** Fecha fija para que calendarios, relojes y textos relativos sean deterministas. */
const FIXED_NOW = new Date('2026-01-15T10:30:00');

/** Contenido dinámico que se enmascara aunque el reloj esté congelado. */
const DYNAMIC_SELECTORS = ['[data-e2e-dynamic]', 'video', 'iframe', 'canvas'];

/** CSS inyectado para estabilizar capturas: sin caret, ripples ni transiciones residuales. */
const STABILIZE_CSS = `
  *, *::before, *::after { caret-color: transparent !important; transition: none !important; }
  .mtx-ripple-container, .mtx-ripple { display: none !important; }
`;

const VISUAL_PROJECTS = { chromium: ['light', 'dark'], 'mobile-chromium': ['light'] };

for (const pageInfo of ALL_PAGES) {
  test.describe(`${pageInfo.kind}/${pageInfo.slug}`, () => {
    for (const theme of ['light', 'dark']) {
      test(`visual ${theme}`, async ({ page }, testInfo) => {
        const themes = VISUAL_PROJECTS[testInfo.project.name];
        test.skip(!themes || !themes.includes(theme), 'Capturas solo en chromium (claro/oscuro) y mobile-chromium (claro)');

        const name = `${pageInfo.kind}-${pageInfo.slug}-${theme}.png`;
        const updating = ['all', 'changed'].includes(testInfo.config.updateSnapshots);
        // Sin captura base no se compara (ni se crea en silencio): se generan con `npm run test:visual:update`.
        test.skip(!updating && !fs.existsSync(testInfo.snapshotPath(name)), 'Sin captura base: ejecuta npm run test:visual:update');

        await page.clock.setFixedTime(FIXED_NOW);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await gotoStable(page, withTheme(pageInfo.url, theme));
        await page.addStyleTag({ content: STABILIZE_CSS });
        await page.evaluate(() => document.activeElement && document.activeElement !== document.body && document.activeElement.blur());
        await page.mouse.move(0, 0);

        await expect(page).toHaveScreenshot(name, {
          fullPage: true,
          mask: DYNAMIC_SELECTORS.map((sel) => page.locator(sel)),
        });
      });
    }
  });
}
