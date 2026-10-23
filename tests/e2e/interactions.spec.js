/**
 * Flujos críticos con teclado y ratón reales en Chromium, Firefox y WebKit.
 * Los componentes que aún no tienen ejemplo se saltan con fs.existsSync (otros agentes los crean en paralelo).
 */
import { test, expect } from '@playwright/test';
import { exampleExists } from './support/pages.js';
import { collectIssues, gotoStable } from './support/audit.js';

test.describe.configure({ mode: 'parallel' });

// Los flujos se validan en escritorio; el comportamiento táctil del Drawer se cubre fijando el viewport.
test.skip(({ isMobile }) => isMobile, 'Interacciones de teclado/ratón: solo proyectos de escritorio');

/**
 * Indica si el foco actual está dentro del elemento indicado.
 * @param {import('@playwright/test').Page} page Página.
 * @param {string} selector Selector CSS del contenedor.
 * @returns {Promise<boolean>} true si contiene el foco.
 */
const focusInside = (page, selector) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return !!el && el.contains(document.activeElement);
  }, selector);

let issues = null;
test.beforeEach(({ page }) => {
  issues = collectIssues(page);
});
test.afterEach(() => {
  // En los proyectos móviles el test se salta antes del beforeEach: no hay nada que comprobar.
  if (issues) expect.soft(issues.pageErrors, 'excepciones durante la interacción').toEqual([]);
  issues = null;
});

test.describe('Dialog', () => {
  test.skip(!exampleExists('dialog'), 'Sin ejemplo de Dialog');

  test('abre, atrapa el foco, cierra con Escape y devuelve el foco', async ({ page }) => {
    await gotoStable(page, '/examples/dialog/index.html');
    const trigger = page.locator('[data-mtx-dialog-open="dlg-actions"]').first();
    const dialog = page.locator('#dlg-actions [role="dialog"]');

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#dlg-actions')).toHaveClass(/mtx-dialog--open/);
    await expect.poll(() => focusInside(page, '#dlg-actions')).toBe(true);

    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      expect(await focusInside(page, '#dlg-actions'), `Tab #${i + 1} dentro del diálogo`).toBe(true);
    }
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Shift+Tab');
      expect(await focusInside(page, '#dlg-actions'), `Shift+Tab #${i + 1} dentro del diálogo`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('el clic en el fondo cierra el diálogo', async ({ page }) => {
    await gotoStable(page, '/examples/dialog/index.html');
    await page.locator('[data-mtx-dialog-open="dlg-basic"]').first().click();
    const dialog = page.locator('#dlg-basic [role="dialog"]');
    await expect(dialog).toBeVisible();
    const viewport = page.viewportSize();
    const box = await page.locator('#dlg-basic .mtx-dialog__backdrop').boundingBox();
    expect.soft(box, 'el fondo del diálogo cubre todo el viewport').toEqual({ x: 0, y: 0, width: viewport.width, height: viewport.height });
    await page.mouse.click(10, viewport.height - 10);
    await expect(dialog).toBeHidden();
  });

  test('abierto con clic, Escape devuelve el foco al botón (WebKit no lo enfoca al pulsar)', async ({ page }) => {
    await gotoStable(page, '/examples/dialog/index.html');
    const trigger = page.locator('[data-mtx-dialog-open="dlg-basic"]').first();
    await trigger.click();
    const dialog = page.locator('#dlg-basic [role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect.poll(() => focusInside(page, '#dlg-basic')).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe('Menu', () => {
  test.skip(!exampleExists('menu'), 'Sin ejemplo de Menu');

  test('navega con flechas y cierra con Escape devolviendo el foco', async ({ page }) => {
    await gotoStable(page, '/examples/menu/index.html');
    const trigger = page.locator('[data-open-menu="#menu-basic"]').first();
    const menu = page.locator('#menu-basic');
    const items = menu.locator('[role="menuitem"]');

    await trigger.click();
    await expect(menu).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => focusInside(page, '#menu-basic')).toBe(true);

    const first = items.nth(0);
    const second = items.nth(1);
    await first.focus();
    await page.keyboard.press('ArrowDown');
    await expect(second).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(first).toBeFocused();
    await page.keyboard.press('End');
    await expect(items.last()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });
});

test.describe('Select', () => {
  test.skip(!exampleExists('select'), 'Sin ejemplo de Select');

  test('abre con teclado, elige con flechas + Enter y sincroniza el <select> nativo', async ({ page }) => {
    await gotoStable(page, '/examples/select/index.html');
    const native = page.locator('select[name="city"]');
    const root = page.locator('.mtx-select').filter({ has: native }).first();
    const control = root.locator('[role="combobox"]');
    // El listbox puede moverse a <body> (portal) al abrirse: se localiza por aria-controls.
    const listbox = page.locator(`[id="${await control.getAttribute('aria-controls')}"]`);

    await control.focus();
    await page.keyboard.press('ArrowDown');
    await expect(listbox).toBeVisible();
    await expect(control).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(listbox).toBeHidden();
    await expect(native).not.toHaveValue('mdx');
    const value = await native.inputValue();
    await expect(listbox.locator(`[role="option"][data-value="${value}"]`)).toHaveAttribute('aria-selected', 'true');
    await expect(control).toBeFocused();
  });

  test('abre con ratón y elige una opción', async ({ page }) => {
    await gotoStable(page, '/examples/select/index.html');
    const native = page.locator('select[name="city"]');
    const root = page.locator('.mtx-select').filter({ has: native }).first();
    const control = root.locator('[role="combobox"]');
    const listbox = page.locator(`[id="${await control.getAttribute('aria-controls')}"]`);
    await control.click();
    await expect(listbox).toBeVisible();
    const option = listbox.locator('[role="option"][data-value="mty"]');
    const optionText = (await option.innerText()).trim();
    await option.click();
    await expect(native).toHaveValue('mty');
    await expect(root.locator('.mtx-select__display-text')).toHaveText(optionText);
  });
});

test.describe('Autocomplete', () => {
  test.skip(!exampleExists('autocomplete'), 'Sin ejemplo de Autocomplete');

  test('filtra al escribir (sin tildes) y elige con teclado', async ({ page }) => {
    await gotoStable(page, '/examples/autocomplete/index.html');
    const input = page.locator('input[data-options="#ac-countries"]').first();
    const root = page.locator('.mtx-autocomplete').filter({ has: input }).first();

    await input.click();
    await input.pressSequentially('peru', { delay: 20 });
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    const listboxId = await input.getAttribute('aria-controls');
    expect(listboxId, 'aria-controls apunta al listbox').toBeTruthy();
    const listbox = page.locator(`[id="${listboxId}"]`);
    await expect(listbox).toBeVisible();
    // «peru» debe coincidir sin tildes ni mayúsculas con la única opción value="pe".
    await expect(listbox.locator('[role="option"]')).toHaveCount(1);
    await expect(listbox.locator('[role="option"]').first()).toContainText(/per[uú]/i);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue(/^per[uú]$/i);
    await expect(root.locator('input[type="hidden"][name="country"]')).toHaveValue('pe');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Tabs', () => {
  test.skip(!exampleExists('tabs'), 'Sin ejemplo de Tabs');

  test('las flechas mueven foco y selección; Home/End van a los extremos', async ({ page }) => {
    await gotoStable(page, '/examples/tabs/index.html');
    const tabs = page.locator('#tabs-basic [role="tab"]');
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    if ((await tabs.nth(1).getAttribute('aria-selected')) !== 'true') await page.keyboard.press('Enter');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tabs-basic-2')).toBeVisible();
    await expect(page.locator('#tabs-basic-1')).toBeHidden();

    await page.keyboard.press('End');
    await expect(tabs.last()).toBeFocused();
    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.last()).toBeFocused();
  });
});

test.describe('Drawer responsive (plantilla dashboard)', () => {
  test('1280px: permanente, visible desde la carga y sin animación', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/templates/dashboard/index.html', { waitUntil: 'domcontentloaded' });
    const state = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const read = () => {
            const drawer = document.getElementById('tpl-dash-nav');
            const running = document
              .getAnimations()
              .filter((a) => a.effect && a.effect.target && drawer.contains(a.effect.target) && a.playState === 'running')
              .map((a) => a.transitionProperty || a.animationName || 'anim');
            return { cls: drawer.className, x: drawer.getBoundingClientRect().x, running };
          };
          if (document.readyState === 'complete') resolve(read());
          else window.addEventListener('load', () => requestAnimationFrame(() => resolve(read())), { once: true });
        })
    );
    expect(state.cls).toContain('mtx-drawer--permanent');
    expect(state.cls).not.toContain('mtx-drawer--animated');
    expect(state.x).toBe(0);
    expect(state.running, 'animaciones/transiciones activas en el drawer al cargar').toEqual([]);
    await expect(page.locator('#tpl-dash-nav')).toBeVisible();
  });

  test('390px: temporal, se abre con el botón, atrapa el foco y cierra con Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStable(page, '/templates/dashboard/index.html');
    const drawer = page.locator('#tpl-dash-nav');
    const toggle = page.locator('[aria-controls="tpl-dash-nav"]').first();

    await expect(drawer).toHaveClass(/mtx-drawer--temporary/);
    await expect(drawer).not.toHaveClass(/mtx-drawer--open/);
    expect(await drawer.evaluate((el) => el.getBoundingClientRect().right)).toBeLessThanOrEqual(0);

    await toggle.click();
    await expect(drawer).toHaveClass(/mtx-drawer--open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => focusInside(page, '#tpl-dash-nav')).toBe(true);
    for (let i = 0; i < 25; i++) await page.keyboard.press('Tab');
    expect(await focusInside(page, '#tpl-dash-nav'), 'foco atrapado tras 25 Tab').toBe(true);

    await page.keyboard.press('Escape');
    await expect(drawer).not.toHaveClass(/mtx-drawer--open/);
    await expect(toggle).toBeFocused();
  });
});

test.describe('DateTimePicker', () => {
  test.skip(!exampleExists('date-time-picker'), 'Sin ejemplo de DateTimePicker');

  test('abre con el botón, navega con flechas y confirma con Enter', async ({ page }) => {
    await gotoStable(page, '/examples/date-time-picker/index.html');
    const input = page.locator('input[data-mtx="date-picker"]').first();
    const field = page.locator('.mtx-text-field').filter({ has: input }).first();
    const button = field.locator('button[aria-haspopup="dialog"]');
    const popoverId = await button.getAttribute('aria-controls');
    const popover = page.locator(`[id="${popoverId}"]`);

    await button.click();
    await expect(popover).toHaveClass(/mtx-picker-popover--open/);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    const day = popover.locator('[role="gridcell"]:focus');
    await expect(day).toHaveCount(1);
    const startIso = await day.getAttribute('data-date');

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    const targetIso = await popover.locator('[role="gridcell"]:focus').getAttribute('data-date');
    const expectedIso = await page.evaluate((iso) => {
      const d = new Date(`${iso}T12:00:00`);
      d.setDate(d.getDate() + 8);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }, startIso);
    expect(targetIso).toBe(expectedIso);

    await page.keyboard.press('Enter');
    const [y, m, d] = targetIso.split('-');
    // El formato depende del locale del ejemplo (dd/mm/yyyy o mm/dd/yyyy).
    await expect(input).toHaveValue(new RegExp(`^(${d}/${m}|${m}/${d})/${y}$`));
    await expect(popover).not.toHaveClass(/mtx-picker-popover--open/);
    await expect(input).toBeFocused();
  });
});

test.describe('Slider', () => {
  test.skip(!exampleExists('slider'), 'Sin ejemplo de Slider');

  test('teclado: flechas, PageUp, Home y End actualizan valor y track', async ({ page }) => {
    await gotoStable(page, '/examples/slider/index.html');
    const input = page.locator('input[type="range"][data-mtx="slider"][name="volume"]').first();
    const root = page.locator('.mtx-slider').filter({ has: input }).first();
    const start = Number(await input.inputValue());

    await input.focus();
    await page.keyboard.press('ArrowRight');
    await expect(input).toHaveValue(String(start + 1));
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(input).toHaveValue(String(start - 1));
    await page.keyboard.press('End');
    await expect(input).toHaveValue('100');
    await expect.poll(() => root.locator('.mtx-slider__track').evaluate((el) => el.style.width)).toBe('100%');
    await page.keyboard.press('Home');
    await expect(input).toHaveValue('0');
  });
});

test.describe('Tooltip', () => {
  test.skip(!exampleExists('tooltip'), 'Sin ejemplo de Tooltip');

  test('hover y foco muestran role=tooltip; Escape lo oculta', async ({ page }) => {
    await gotoStable(page, '/examples/tooltip/index.html');
    const target = page.locator('button[data-mtx-tooltip]').first();
    const text = await target.getAttribute('data-mtx-tooltip');
    const tooltip = page.locator('.mtx-tooltip[role="tooltip"]', { hasText: text });

    await target.hover();
    await expect(tooltip).toBeVisible();
    const describedBy = await target.getAttribute('aria-describedby');
    const label = await target.getAttribute('aria-label');
    expect(describedBy || label, 'el tooltip aporta descripción o nombre accesible').toBeTruthy();

    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();

    // Como MUI, el foco solo abre el tooltip con modalidad de teclado: se llega con Shift+Tab, Tab.
    await target.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(target).toBeFocused();
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
  });
});

test.describe('Snackbar', () => {
  test.skip(!exampleExists('snackbar'), 'Sin ejemplo de Snackbar');

  test('Materix.snackbar.show() muestra el aviso y Escape lo cierra', async ({ page }) => {
    await gotoStable(page, '/examples/snackbar/index.html');
    await page.evaluate(() => window.Materix.snackbar.show({ message: 'Aviso E2E', duration: 20000 }));
    const snack = page.locator('.mtx-snackbar', { hasText: 'Aviso E2E' });
    await expect(snack).toBeVisible();
    await expect(snack).toHaveClass(/mtx-snackbar--open/);
    await expect(snack.locator('[role="status"], [role="alert"]').first()).toHaveText('Aviso E2E');

    await page.keyboard.press('Escape');
    await expect(snack).not.toHaveClass(/mtx-snackbar--open/);
    // Al cerrarse queda transparente (opacity 0) o fuera del árbol visible.
    await expect
      .poll(() => snack.evaluate((el) => el.hidden || getComputedStyle(el).display === 'none' || getComputedStyle(el).opacity === '0'))
      .toBe(true);
  });
});

test.describe('Tema', () => {
  test('el toggle de los ejemplos alterna data-mtx-theme y lo persiste', async ({ page }) => {
    await gotoStable(page, '/examples/button/index.html?theme=light');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-mtx-theme', 'light');
    await page.locator('#theme-toggle').first().click();
    await expect(html).toHaveAttribute('data-mtx-theme', 'dark');
    expect(await page.evaluate(() => localStorage.getItem('mtx-theme'))).toBe('dark');
    await page.locator('#theme-toggle').first().click();
    await expect(html).toHaveAttribute('data-mtx-theme', 'light');
  });

  test('[data-mtx-theme-toggle] de las plantillas alterna data-mtx-theme', async ({ page }) => {
    await gotoStable(page, '/templates/dashboard/index.html?theme=light');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-mtx-theme', 'light');
    const toggle = page.locator('[data-mtx-theme-toggle]').first();
    await toggle.click();
    await expect(html).toHaveAttribute('data-mtx-theme', 'dark');
    await toggle.click();
    await expect(html).toHaveAttribute('data-mtx-theme', 'light');
  });
});

test.describe('Popover', () => {
  test.skip(!exampleExists('popover'), 'Sin ejemplo de Popover');

  test('abre con el disparador, recibe foco, cierra con Escape y con clic fuera', async ({ page }) => {
    await gotoStable(page, '/examples/popover/index.html');
    const trigger = page.locator('[data-open-popover="#popover-basic"]').first();
    const popover = page.locator('#popover-basic');

    await trigger.click();
    await expect(popover).toBeVisible();
    await expect(popover).toHaveAttribute('role', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => focusInside(page, '#popover-basic')).toBe(true);

    await page.keyboard.press('Escape');
    await expect(popover).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(popover).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(popover).toBeHidden();
  });
});

test.describe('Backdrop', () => {
  test.skip(!exampleExists('backdrop'), 'Sin ejemplo de Backdrop');

  test('se abre con el botón y se cierra con Escape y con clic', async ({ page }) => {
    await gotoStable(page, '/examples/backdrop/index.html');
    const trigger = page.locator('[data-mtx-backdrop-open="backdrop-basic"]').first();
    const backdrop = page.locator('#backdrop-basic');

    await trigger.click();
    await expect(backdrop).toBeVisible();
    await expect(backdrop).toHaveClass(/mtx-backdrop--open/);
    await page.keyboard.press('Escape');
    await expect(backdrop).toBeHidden();

    await trigger.click();
    await expect(backdrop).toBeVisible();
    await page.mouse.click(640, 400);
    await expect(backdrop).toBeHidden();
  });
});

test.describe('ButtonGroup', () => {
  test.skip(!exampleExists('button-group'), 'Sin ejemplo de ButtonGroup');

  test('expone role=group con nombre y recorre sus botones con Tab', async ({ page }) => {
    await gotoStable(page, '/examples/button-group/index.html');
    const group = page.locator('[data-mtx="button-group"]').first();
    await expect(group).toHaveAttribute('role', 'group');
    expect(await group.getAttribute('aria-label'), 'nombre accesible del grupo').toBeTruthy();

    const buttons = group.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(1);
    await buttons.first().focus();
    for (let i = 1; i < count; i++) {
      await page.keyboard.press('Tab');
      await expect(buttons.nth(i)).toBeFocused();
    }

    const disabledGroup = page.locator('.mtx-button-group--disabled').first();
    if (await disabledGroup.count()) {
      const disabledButtons = disabledGroup.locator('button');
      for (let i = 0; i < (await disabledButtons.count()); i++) await expect(disabledButtons.nth(i)).toBeDisabled();
    }
  });
});

test.describe('Skeleton', () => {
  test.skip(!exampleExists('skeleton'), 'Sin ejemplo de Skeleton');

  test('queda oculto a lectores de pantalla y respeta prefers-reduced-motion', async ({ page }) => {
    await gotoStable(page, '/examples/skeleton/index.html');
    const skeleton = page.locator('[data-mtx="skeleton"]').first();
    await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(await skeleton.evaluate((el) => getComputedStyle(el).animationName)).not.toBe('none');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    const animations = await page.locator('.mtx-skeleton').evaluateAll((els) =>
      els
        .map((el) => [getComputedStyle(el).animationName, getComputedStyle(el, '::after').animationName])
        .filter(([a, b]) => a !== 'none' || b !== 'none').length
    );
    expect(animations, 'skeletons animados con reduced-motion').toBe(0);
  });
});
