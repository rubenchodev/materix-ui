/**
 * Flujos críticos de teclado y ratón sobre las páginas de ejemplo React (portado de vainilla tests/e2e/interactions.spec.js).
 * Cada demo vive en `<section id="{demo}">`; los overlays se localizan por rol porque pueden ir en un portal a <body>.
 * Incluye Autocomplete y DateTimePicker (DatePicker y TimePicker digital).
 */
import { test, expect, type Page } from '@playwright/test';
import { collectIssues, gotoStable, type PageIssues } from './support/audit';

test.describe.configure({ mode: 'parallel' });

/**
 * Indica si el foco está dentro del diálogo visible (role=dialog) más reciente.
 * @param {Page} page Página.
 * @returns {Promise<boolean>} true si el foco está dentro.
 */
const focusInOpenDialog = (page: Page): Promise<boolean> =>
  page.evaluate(() => {
    const dialogs = [...document.querySelectorAll('[role="dialog"], [role="presentation"] [aria-modal="true"]')].filter(
      (d) => (d as HTMLElement).offsetParent !== null || getComputedStyle(d).position === 'fixed',
    );
    const last = dialogs[dialogs.length - 1];
    return !!last && last.contains(document.activeElement);
  });

let issues: PageIssues | null = null;
test.beforeEach(({ page }) => {
  issues = collectIssues(page);
});
test.afterEach(() => {
  if (issues) expect.soft(issues.pageErrors, 'excepciones durante la interacción').toEqual([]);
  issues = null;
});

test.describe('Dialog', () => {
  test('abre con teclado, atrapa el foco, cierra con Escape y devuelve el foco', async ({ page }) => {
    await gotoStable(page, '/dialog/index.html');
    const trigger = page.locator('section#actions').getByRole('button', { name: 'Open with actions' });
    const dialog = page.getByRole('dialog', { name: 'Turn on sync?' });

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect.poll(() => dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);

    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate((el) => el.contains(document.activeElement)), `Tab #${i + 1} dentro del diálogo`).toBe(true);
    }
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Shift+Tab');
      expect(await dialog.evaluate((el) => el.contains(document.activeElement)), `Shift+Tab #${i + 1} dentro del diálogo`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('el clic en el fondo cierra el diálogo y el fondo cubre el viewport', async ({ page }) => {
    await gotoStable(page, '/dialog/index.html');
    await page.locator('section#basic').getByRole('button', { name: 'Open dialog' }).click();
    const dialog = page.getByRole('dialog', { name: 'Use the device location' });
    await expect(dialog).toBeVisible();
    const viewport = page.viewportSize()!;
    const box = await page.locator('.mtx-dialog--open .mtx-dialog__backdrop').first().boundingBox();
    expect.soft(box, 'el fondo del diálogo cubre todo el viewport').toEqual({ x: 0, y: 0, width: viewport.width, height: viewport.height });
    await page.mouse.click(10, viewport.height - 10);
    await expect(dialog).toBeHidden();
  });

  test('abierto con clic, Escape devuelve el foco al botón', async ({ page }) => {
    await gotoStable(page, '/dialog/index.html');
    const trigger = page.locator('section#basic').getByRole('button', { name: 'Open dialog' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Use the device location' });
    await expect(dialog).toBeVisible();
    await expect.poll(() => focusInOpenDialog(page)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe('Menu', () => {
  test('navega con flechas, Home/End y cierra con Escape devolviendo el foco', async ({ page }) => {
    await gotoStable(page, '/menu/index.html');
    const trigger = page.locator('section#basic').getByRole('button', { name: 'Open menu' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const controls = await trigger.getAttribute('aria-controls');
    expect(controls, 'aria-controls apunta al menú').toBeTruthy();
    const menu = page.locator(`[id="${controls}"]`);
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('role', 'menu');
    const items = menu.getByRole('menuitem');
    await expect(items.first()).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(items.nth(1)).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(items.nth(0)).toBeFocused();
    await page.keyboard.press('End');
    await expect(items.last()).toBeFocused();
    await page.keyboard.press('Home');
    await expect(items.first()).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(items.last(), 'ArrowUp en el primero da la vuelta').toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('elegir una opción con Enter cierra el menú', async ({ page }) => {
    await gotoStable(page, '/menu/index.html');
    const trigger = page.locator('section#basic').getByRole('button', { name: 'Open menu' });
    await trigger.click();
    const menu = page.locator(`[id="${await trigger.getAttribute('aria-controls')}"]`);
    await expect(menu).toBeVisible();
    await menu.getByRole('menuitem', { name: 'My account' }).focus();
    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe('Select', () => {
  /**
   * Localiza el combobox y el <select>/input nativo de la demo básica.
   * @param {Page} page Página.
   */
  const locate = (page: Page) => {
    const section = page.locator('section#basic');
    const control = section.getByRole('combobox').first();
    const native = section.locator('[name="city"]').first();
    return { section, control, native };
  };

  test('abre con teclado, elige con flechas + Enter y sincroniza el valor del formulario', async ({ page }) => {
    await gotoStable(page, '/select/index.html');
    const { control, native } = locate(page);
    const before = await native.inputValue();

    await control.focus();
    await page.keyboard.press('ArrowDown');
    await expect(control).toHaveAttribute('aria-expanded', 'true');
    const listbox = page.locator(`[id="${await control.getAttribute('aria-controls')}"]`);
    await expect(listbox).toBeVisible();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(listbox).toBeHidden();
    await expect(control).toHaveAttribute('aria-expanded', 'false');
    const value = await native.inputValue();
    expect(value, 'el valor cambia tras elegir con teclado').not.toBe(before);
    expect(value).not.toBe('');
    await expect(control).toBeFocused();
  });

  test('abre con ratón y elige una opción', async ({ page }) => {
    await gotoStable(page, '/select/index.html');
    const { control, native } = locate(page);
    await control.click();
    const listbox = page.locator(`[id="${await control.getAttribute('aria-controls')}"]`);
    await expect(listbox).toBeVisible();
    await listbox.getByRole('option', { name: 'Monterrey' }).click();
    await expect(native).toHaveValue('mty');
    await expect(control).toContainText('Monterrey');
    await expect(listbox).toBeHidden();
  });

  test('Escape cierra sin cambiar el valor', async ({ page }) => {
    await gotoStable(page, '/select/index.html');
    const { control, native } = locate(page);
    const before = await native.inputValue();
    await control.focus();
    await page.keyboard.press('Enter');
    await expect(control).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(control).toHaveAttribute('aria-expanded', 'false');
    await expect(native).toHaveValue(before);
    await expect(control).toBeFocused();
  });
});

test.describe('Tabs', () => {
  test('las flechas mueven foco y selección; Home/End van a los extremos y dan la vuelta', async ({ page }) => {
    await gotoStable(page, '/tabs/index.html');
    const section = page.locator('section#basic');
    const tabs = section.getByRole('tab');
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    if ((await tabs.nth(1).getAttribute('aria-selected')) !== 'true') await page.keyboard.press('Enter');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    const panelId = await tabs.nth(1).getAttribute('aria-controls');
    expect(panelId, 'el tab apunta a su panel').toBeTruthy();
    await expect(page.locator(`[id="${panelId}"]`)).toBeVisible();
    await expect(section.getByRole('tabpanel')).toHaveCount(1);
    await expect(section.getByRole('tabpanel')).toContainText('Last activity');

    await page.keyboard.press('End');
    await expect(tabs.last()).toBeFocused();
    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.last()).toBeFocused();
  });

  test('roving tabindex: solo el tab seleccionado es tabulable', async ({ page }) => {
    await gotoStable(page, '/tabs/index.html');
    const tabs = page.locator('section#basic').getByRole('tab');
    const tabindexes = await tabs.evaluateAll((els) => els.map((el) => el.getAttribute('tabindex')));
    expect(tabindexes.filter((t) => t === '0')).toHaveLength(1);
  });
});

test.describe('Drawer', () => {
  test('temporal: se abre con el botón, atrapa el foco y cierra con Escape devolviendo el foco', async ({ page }) => {
    await gotoStable(page, '/drawer/index.html');
    const trigger = page.locator('section#basic').getByRole('button', { name: 'Open navigation' });
    await trigger.click();
    const drawer = page.getByRole('dialog', { name: 'Mail' });
    await expect(drawer).toBeVisible();
    await expect.poll(() => drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    expect(await drawer.evaluate((el) => el.contains(document.activeElement)), 'foco atrapado tras 12 Tab').toBe(true);
    for (let i = 0; i < 4; i++) await page.keyboard.press('Shift+Tab');
    expect(await drawer.evaluate((el) => el.contains(document.activeElement)), 'foco atrapado tras Shift+Tab').toBe(true);

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('temporal: el clic en el fondo lo cierra', async ({ page }) => {
    await gotoStable(page, '/drawer/index.html');
    await page.locator('section#basic').getByRole('button', { name: 'Open navigation' }).click();
    const drawer = page.getByRole('dialog', { name: 'Mail' });
    await expect(drawer).toBeVisible();
    const viewport = page.viewportSize()!;
    await page.mouse.click(viewport.width - 10, viewport.height / 2);
    await expect(drawer).toBeHidden();
  });
});

test.describe('Slider', () => {
  test('teclado: flechas, PageUp/PageDown, Home y End actualizan valor y track', async ({ page }) => {
    await gotoStable(page, '/slider/index.html');
    const section = page.locator('section#basic');
    const input = section.locator('input[type="range"][name="volume"]').first();
    const root = section.locator('.mtx-slider').filter({ has: page.locator('input[name="volume"]') }).first();
    const start = Number(await input.inputValue());
    expect(start).toBe(30);

    await input.focus();
    await page.keyboard.press('ArrowRight');
    await expect(input).toHaveValue(String(start + 1));
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(input).toHaveValue(String(start - 1));
    await page.keyboard.press('PageUp');
    await expect(input).toHaveValue(String(start + 9));
    await page.keyboard.press('PageDown');
    await expect(input).toHaveValue(String(start - 1));
    await page.keyboard.press('End');
    await expect(input).toHaveValue('100');
    await expect.poll(() => root.locator('.mtx-slider__track').first().evaluate((el) => (el as HTMLElement).style.width)).toBe('100%');
    await page.keyboard.press('Home');
    await expect(input).toHaveValue('0');
  });

  test('ratón: clic en el rail mueve el valor', async ({ page }) => {
    await gotoStable(page, '/slider/index.html');
    const section = page.locator('section#basic');
    const input = section.locator('input[type="range"][name="volume"]').first();
    const root = section.locator('.mtx-slider').filter({ has: page.locator('input[name="volume"]') }).first();
    const box = (await root.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
    await expect.poll(async () => Number(await input.inputValue())).toBeGreaterThan(70);
  });
});

test.describe('Tooltip', () => {
  test('hover y foco de teclado muestran role=tooltip; Escape lo oculta', async ({ page }) => {
    await gotoStable(page, '/tooltip/index.html');
    const target = page.locator('section#basic').getByRole('button', { name: 'Save' });
    const tooltip = page.getByRole('tooltip', { name: 'Saved to your account' });

    await target.hover();
    await expect(tooltip).toBeVisible();
    const describedBy = await target.getAttribute('aria-describedby');
    expect(describedBy, 'aria-describedby apunta al tooltip').toBe(await tooltip.getAttribute('id'));

    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();

    // Como MUI, el foco solo abre el tooltip con modalidad de teclado.
    await target.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(target).toBeFocused();
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
  });

  test('un IconButton sin texto recibe nombre accesible del tooltip', async ({ page }) => {
    await gotoStable(page, '/tooltip/index.html');
    await expect(page.locator('section#basic').getByRole('button', { name: 'Delete' })).toHaveCount(1);
  });
});

test.describe('Snackbar', () => {
  test('se muestra con el botón y Escape lo cierra', async ({ page }) => {
    await gotoStable(page, '/snackbar/index.html');
    await page.locator('section#basic').getByRole('button', { name: 'Show snackbar' }).click();
    const snack = page.locator('.mtx-snackbar', { hasText: 'Message archived' });
    await expect(snack).toBeVisible();
    await expect(snack).toHaveClass(/mtx-snackbar--open/);
    await expect(page.locator('[role="status"], [role="alert"]').filter({ hasText: 'Message archived' }).first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect
      .poll(async () =>
        (await snack.count()) === 0
          ? true
          : snack.first().evaluate((el) => !el.classList.contains('mtx-snackbar--open') && ((el as HTMLElement).hidden || getComputedStyle(el).opacity === '0' || getComputedStyle(el).display === 'none')),
      )
      .toBe(true);
  });

  test('se cierra solo tras autoHideDuration', async ({ page }) => {
    await gotoStable(page, '/snackbar/index.html');
    await page.locator('section#basic').getByRole('button', { name: 'Show snackbar' }).click();
    const snack = page.locator('.mtx-snackbar--open', { hasText: 'Message archived' });
    await expect(snack).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(snack).toHaveCount(0, { timeout: 8_000 });
  });
});

test.describe('Popover', () => {
  test('abre con el disparador, recibe foco, cierra con Escape y con clic fuera', async ({ page }) => {
    await gotoStable(page, '/popover/index.html');
    const trigger = page.locator('section#basic').getByRole('button', { name: 'Open popover' });
    const popover = page.getByRole('dialog', { name: 'Basic popover' });

    await trigger.click();
    await expect(popover).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => popover.evaluate((el) => el.contains(document.activeElement))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(popover).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(popover).toBeVisible();
    await page.mouse.click(5, 300);
    await expect(popover).toBeHidden();
  });
});

test.describe('Backdrop', () => {
  test('se abre con el botón y se cierra con Escape y con clic', async ({ page }) => {
    await gotoStable(page, '/backdrop/index.html');
    const trigger = page.locator('section#basic').getByRole('button', { name: 'Show backdrop' });
    const backdrop = page.locator('.mtx-backdrop--open');

    await trigger.click();
    await expect(backdrop).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(backdrop).toHaveCount(0);

    await trigger.click();
    await expect(backdrop).toBeVisible();
    await page.mouse.click(640, 400);
    await expect(backdrop).toHaveCount(0);
  });
});

test.describe('ButtonGroup', () => {
  test('expone role=group con nombre y recorre sus botones con Tab', async ({ page }) => {
    await gotoStable(page, '/button-group/index.html');
    const group = page.locator('section#basic').getByRole('group', { name: 'Basic actions' });
    await expect(group).toHaveCount(1);

    const buttons = group.getByRole('button');
    const count = await buttons.count();
    expect(count).toBe(3);
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

test.describe('Accordion', () => {
  test('Enter/Espacio alternan, aria-expanded y aria-controls se sincronizan', async ({ page }) => {
    await gotoStable(page, '/accordion/index.html');
    const section = page.locator('section#basic');
    const first = section.getByRole('button', { name: 'Accordion 1' });
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    const regionId = await first.getAttribute('aria-controls');
    expect(regionId, 'el resumen apunta a su región').toBeTruthy();

    await first.focus();
    await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(`[id="${regionId}"]`)).toBeVisible();
    await page.keyboard.press('Space');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`[id="${regionId}"]`)).toBeHidden();
  });

  test('flechas, Home y End recorren las cabeceras (WAI-ARIA)', async ({ page }) => {
    await gotoStable(page, '/accordion/index.html');
    // Como en vainilla, la navegación con flechas solo aplica dentro de un AccordionGroup.
    const section = page.locator('section#exclusive-group');
    const headers = section.locator('.mtx-accordion-group').first().locator('.mtx-accordion__summary');
    await headers.nth(0).focus();
    await page.keyboard.press('ArrowDown');
    await expect(headers.nth(1)).toBeFocused();
    await page.keyboard.press('End');
    await expect(headers.nth(2)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(headers.nth(0)).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(headers.nth(2)).toBeFocused();
  });

  test('grupo exclusivo: abrir un panel cierra el otro', async ({ page }) => {
    await gotoStable(page, '/accordion/index.html');
    const section = page.locator('section#exclusive-group');
    const general = section.getByRole('button', { name: 'General settings' });
    const users = section.getByRole('button', { name: 'Users' });
    await expect(general).toHaveAttribute('aria-expanded', 'true');
    await users.click();
    await expect(users).toHaveAttribute('aria-expanded', 'true');
    await expect(general).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('ToggleButtonGroup', () => {
  test('exclusivo: clic y teclado cambian aria-pressed; el deshabilitado no se activa', async ({ page }) => {
    await gotoStable(page, '/toggle-button/index.html');
    const group = page.locator('section#basic').getByRole('group', { name: 'Text alignment' });
    const left = group.getByRole('button', { name: 'Align left' });
    const center = group.getByRole('button', { name: 'Center' });
    const right = group.getByRole('button', { name: 'Align right' });
    const justify = group.getByRole('button', { name: 'Justify' });

    await expect(left).toHaveAttribute('aria-pressed', 'true');
    await center.click();
    await expect(center).toHaveAttribute('aria-pressed', 'true');
    await expect(left).toHaveAttribute('aria-pressed', 'false');

    await right.focus();
    await page.keyboard.press('Space');
    await expect(right).toHaveAttribute('aria-pressed', 'true');
    await expect(center).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Enter');
    await expect(right, 'exclusivo sin enforce: volver a pulsar deselecciona').toHaveAttribute('aria-pressed', 'false');

    await expect(justify).toBeDisabled();
    await justify.click({ force: true });
    await expect(justify).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('Rating', () => {
  test('radios nativos: las flechas cambian el valor y el nombre accesible', async ({ page }) => {
    await gotoStable(page, '/rating/index.html');
    const section = page.locator('section#basic');
    const checked = section.locator('input[type="radio"][name="product-score"]:checked');
    await expect(checked).toHaveValue('3');

    await checked.focus();
    await page.keyboard.press('ArrowRight');
    await expect(checked).toHaveValue('4');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(checked).toHaveValue('2');
    const id = await checked.getAttribute('id');
    const name = await page.evaluate((radioId) => {
      const radio = document.getElementById(radioId!) as HTMLInputElement | null;
      if (!radio) return '';
      return radio.getAttribute('aria-label') || [...(radio.labels ?? [])].map((l) => l.textContent).join(' ');
    }, id);
    expect(name.trim(), 'cada estrella tiene nombre accesible').not.toBe('');
  });

  test('ratón: clic en la quinta estrella fija 5', async ({ page }) => {
    await gotoStable(page, '/rating/index.html');
    const section = page.locator('section#basic');
    const radio5 = section.locator('input[type="radio"][name="product-score"][value="5"]');
    const id = await radio5.getAttribute('id');
    await section.locator(`label[for="${id}"]`).click();
    await expect(radio5).toBeChecked();
  });
});

test.describe('Pagination', () => {
  test('clic y teclado cambian la página actual con aria-current', async ({ page }) => {
    await gotoStable(page, '/pagination/index.html');
    const nav = page.locator('section#basic').getByRole('navigation', { name: 'Basic pagination' });
    const current = nav.locator('[aria-current="page"], [aria-current="true"]');
    await expect(current).toHaveText('1');
    await expect(nav.getByRole('button', { name: /previous/i })).toBeDisabled();

    await nav.getByRole('button', { name: /page 2$/i }).click();
    await expect(current).toHaveText('2');

    const next = nav.getByRole('button', { name: /next/i });
    await next.focus();
    await page.keyboard.press('Enter');
    await expect(current).toHaveText('3');
    await page.keyboard.press('Space');
    await expect(current).toHaveText('4');

    await nav.getByRole('button', { name: /page 10$/i }).click();
    await expect(current).toHaveText('10');
    await expect(nav.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  test('la paginación deshabilitada no responde', async ({ page }) => {
    await gotoStable(page, '/pagination/index.html');
    const nav = page.locator('section#basic').getByRole('navigation', { name: 'Disabled pagination' });
    const buttons = nav.getByRole('button');
    for (let i = 0; i < (await buttons.count()); i++) await expect(buttons.nth(i)).toBeDisabled();
  });
});

test.describe('TextField', () => {
  test('máscara de patrón: formatea al escribir y descarta caracteres inválidos', async ({ page }) => {
    await gotoStable(page, '/text-field/index.html');
    const section = page.locator('section#masks');
    const phone = section.getByRole('textbox', { name: 'Phone' });
    await phone.click();
    await phone.pressSequentially('55a12345678', { delay: 15 });
    await expect(phone).toHaveValue('(551) 234-5678');
    await expect(section.locator('.demo-status')).toContainText('unmaskedValue: "5512345678"');
    await expect(section.locator('.demo-status')).toContainText('isMaskComplete: true');

    await page.keyboard.press('Backspace');
    await expect(phone).toHaveValue('(551) 234-567');

    const plate = section.getByRole('textbox', { name: 'License plate' });
    await plate.click();
    await plate.pressSequentially('ab1c123', { delay: 15 });
    await expect(plate).toHaveValue(/^AB?C?-?123$|^ABC-123$/i);
  });

  test('máscara de moneda: formatea con separadores', async ({ page }) => {
    await gotoStable(page, '/text-field/index.html');
    const price = page.locator('section#masks').getByRole('textbox', { name: 'Price' });
    await price.click();
    await price.pressSequentially('125000', { delay: 15 });
    await expect(price).toHaveValue(/1,250\.00/);
  });

  test('password toggle: alterna el tipo, aria-pressed y conserva el foco y el valor', async ({ page }) => {
    await gotoStable(page, '/text-field/index.html');
    const section = page.locator('section#adornments');
    const input = section.locator('input[type="password"]').first();
    const id = await input.getAttribute('id');
    const field = page.locator(`[id="${id}"]`);
    await field.fill('s3cret!');
    const toggle = section.locator('.mtx-text-field').filter({ has: field }).getByRole('button').first();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(await toggle.getAttribute('aria-label'), 'nombre accesible del botón').toBeTruthy();

    await toggle.click();
    await expect(field).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(field).toHaveValue('s3cret!');

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(field).toHaveAttribute('type', 'password');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(section.locator('.demo-log')).toContainText('visible: false');
  });
});

test.describe('Escenarios adicionales', () => {
  test('Dialog bloquea el scroll del body mientras está abierto y lo restaura al cerrar', async ({ page }) => {
    await gotoStable(page, '/dialog/index.html');
    const overflow = () => page.evaluate(() => getComputedStyle(document.body).overflow);
    const before = await overflow();
    await page.locator('section#basic').getByRole('button', { name: 'Open dialog' }).click();
    await expect(page.getByRole('dialog', { name: 'Use the device location' })).toBeVisible();
    await expect.poll(overflow).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Use the device location' })).toBeHidden();
    await expect.poll(overflow).toBe(before);
  });

  test('Menu: Tab y clic fuera cierran el menú', async ({ page }) => {
    await gotoStable(page, '/menu/index.html');
    const trigger = page.locator('section#basic').getByRole('button', { name: 'Open menu' });
    await trigger.click();
    const menu = page.locator(`[id="${await trigger.getAttribute('aria-controls')}"]`);
    await expect(menu).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(menu).toBeVisible();
    await page.mouse.click(5, 400);
    await expect(menu).toBeHidden();
  });

  test('Select: Home/End y búsqueda por tecleo (typeahead) en la lista', async ({ page }) => {
    await gotoStable(page, '/select/index.html');
    const control = page.locator('section#basic').getByRole('combobox').first();
    await control.focus();
    await page.keyboard.press('Enter');
    await expect(control).toHaveAttribute('aria-expanded', 'true');
    const listbox = page.locator(`[id="${await control.getAttribute('aria-controls')}"]`);
    const activeText = async () => {
      const id = await control.getAttribute('aria-activedescendant');
      if (id) return (await page.locator(`[id="${id}"]`).innerText()).trim();
      return page.evaluate(() => (document.activeElement?.textContent || '').trim());
    };
    await page.keyboard.press('End');
    await expect.poll(activeText).toBe('Monterrey');
    await page.keyboard.press('Home');
    await expect.poll(activeText).toBe('Mexico City');
    await page.keyboard.type('g');
    await expect.poll(activeText).toBe('Guadalajara');
    await page.keyboard.press('Enter');
    await expect(listbox).toBeHidden();
    await expect(page.locator('section#basic [name="city"]').first()).toHaveValue('gdl');
  });

  test('Tabs con activación manual: las flechas mueven el foco sin seleccionar; Enter activa', async ({ page }) => {
    await gotoStable(page, '/tabs/index.html');
    const tablist = page.locator('section#activation').getByRole('tablist', { name: 'Manual activation' });
    const tabs = tablist.getByRole('tab');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Enter');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('Slider de rango: cada thumb se mueve con teclado y el track refleja ambos valores', async ({ page }) => {
    await gotoStable(page, '/slider/index.html');
    const section = page.locator('section#range');
    const thumbs = section.locator('input[type="range"]');
    const start = thumbs.nth(0);
    const end = thumbs.nth(1);
    await expect(start).toHaveValue('20');
    await expect(end).toHaveValue('60');
    await start.focus();
    await page.keyboard.press('ArrowRight');
    await expect(start).toHaveValue('21');
    await end.focus();
    await page.keyboard.press('Home');
    // Con swap por defecto el valor final no puede quedar por debajo del inicial: se intercambian o se limitan.
    const values = [Number(await start.inputValue()), Number(await end.inputValue())];
    expect(values[0]).toBeLessThanOrEqual(values[1]);
  });

  test('Drawer: el clic en el fondo devuelve el foco al disparador', async ({ page }) => {
    await gotoStable(page, '/drawer/index.html');
    const trigger = page.locator('section#basic').getByRole('button', { name: 'Open navigation' });
    await trigger.click();
    const drawer = page.getByRole('dialog', { name: 'Mail' });
    await expect(drawer).toBeVisible();
    const viewport = page.viewportSize()!;
    await page.mouse.click(viewport.width - 10, viewport.height / 2);
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('Popover: Tab desde el último elemento no deja el foco perdido en <body>', async ({ page }) => {
    await gotoStable(page, '/popover/index.html');
    const trigger = page.locator('section#basic').getByRole('button', { name: 'Open popover' });
    await trigger.click();
    const popover = page.getByRole('dialog', { name: 'Basic popover' });
    await expect(popover).toBeVisible();
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => document.activeElement?.tagName);
    expect(active, 'el foco no cae en <body>').not.toBe('BODY');
  });

  test('TextField moneda: Backspace reduce el importe', async ({ page }) => {
    await gotoStable(page, '/text-field/index.html');
    const price = page.locator('section#masks').getByRole('textbox', { name: 'Price' });
    await price.click();
    await price.pressSequentially('125000', { delay: 15 });
    await expect(price).toHaveValue(/1,250\.00/);
    await page.keyboard.press('Backspace');
    await expect(price).toHaveValue(/125\.00/);
  });
});

test.describe('Autocomplete', () => {
  test('filtra al escribir (sin tildes) y elige con teclado', async ({ page }) => {
    await gotoStable(page, '/autocomplete/index.html');
    const section = page.locator('section#basic');
    const input = section.getByRole('combobox', { name: 'Country' });
    await input.click();
    await input.pressSequentially('perú', { delay: 20 });
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    const listboxId = await input.getAttribute('aria-controls');
    expect(listboxId, 'aria-controls apunta al listbox').toBeTruthy();
    const listbox = page.locator(`[id="${listboxId}"]`);
    await expect(listbox).toBeVisible();
    // «perú» debe coincidir sin tildes ni mayúsculas con la única opción «Peru».
    await expect(listbox.getByRole('option')).toHaveCount(1);
    await expect(listbox.getByRole('option').first()).toContainText(/^Peru/);

    await page.keyboard.press('ArrowDown');
    await expect(input).toHaveAttribute('aria-activedescendant', /.+/);
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('Peru');
    await expect(section.locator('input[type="hidden"][name="country"]')).toHaveValue('pe');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape cierra la lista sin elegir y mantiene el foco', async ({ page }) => {
    await gotoStable(page, '/autocomplete/index.html');
    const section = page.locator('section#basic');
    const input = section.getByRole('combobox', { name: 'Country' });
    await input.click();
    await page.keyboard.press('ArrowDown');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toBeFocused();
    await expect(section.locator('input[type="hidden"][name="country"]')).toHaveValue('');
  });

  test('múltiple: Enter añade un chip y Backspace con el campo vacío quita el último', async ({ page }) => {
    await gotoStable(page, '/autocomplete/index.html');
    const section = page.locator('section#multiple');
    const input = section.getByRole('combobox', { name: 'Skills' });
    const root = section.locator('.mtx-autocomplete').filter({ has: page.getByRole('combobox', { name: 'Skills' }) });
    const hidden = section.locator('input[type="hidden"][name="skills"]');
    const chips = root.locator('.mtx-chip');
    await expect(chips).toHaveCount(2);
    await expect(hidden).toHaveCount(2);

    await input.click();
    await input.pressSequentially('pyth', { delay: 20 });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(chips).toHaveCount(3);
    await expect(chips.last()).toContainText('Python');
    await expect(input).toHaveValue('');

    await page.keyboard.press('Escape');
    await page.keyboard.press('Backspace');
    await expect(chips).toHaveCount(2);
    await expect(chips.last()).toContainText('Node.js');
    await expect(hidden).toHaveCount(2);
    await expect(input).toBeFocused();
  });
});

test.describe('DateTimePicker', () => {
  /**
   * Localiza el campo, su input y el botón de apertura del picker de la demo indicada.
   * @param {Page} page Página.
   * @param {string} sectionId Id de la sección de la demo.
   * @param {string} label Nombre accesible del input.
   */
  const locatePicker = (page: Page, sectionId: string, label: string) => {
    const section = page.locator(`section#${sectionId}`);
    const input = section.getByRole('textbox', { name: label, exact: true });
    const field = section.locator('.mtx-text-field').filter({ has: page.getByRole('textbox', { name: label, exact: true }) }).first();
    const button = field.locator('button[aria-haspopup="dialog"]');
    return { section, input, field, button };
  };

  test('DatePicker: abre con el botón, navega con flechas, confirma con Enter y devuelve el foco', async ({ page }) => {
    await gotoStable(page, '/date-time-picker/index.html');
    const { input, field, button } = locatePicker(page, 'keyboard', 'Date');
    const initial = await input.inputValue();

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    const dialog = page.locator(`[id="${await button.getAttribute('aria-controls')}"]`);
    await expect(dialog).toBeVisible();
    const focusedDay = dialog.locator('[role="gridcell"]:focus');
    await expect(focusedDay).toHaveCount(1);
    await expect(focusedDay).toHaveAttribute('data-date', '2026-10-20');

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await expect(dialog.locator('[role="gridcell"]:focus')).toHaveAttribute('data-date', '2026-10-28');
    await page.keyboard.press('Enter');

    await expect(dialog).toBeHidden();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(input).not.toHaveValue(initial);
    await expect(input).toHaveValue(/^(28\/10|10\/28)\/2026$/);
    await expect.poll(() => field.evaluate((el) => el.contains(document.activeElement)), 'el foco vuelve al campo').toBe(true);
  });

  test('DatePicker: Escape cierra sin cambiar el valor y devuelve el foco al botón', async ({ page }) => {
    await gotoStable(page, '/date-time-picker/index.html');
    const { input, button } = locatePicker(page, 'keyboard', 'Date');
    const initial = await input.inputValue();
    await button.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator(`[id="${await button.getAttribute('aria-controls')}"]`);
    await expect(dialog).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(input).toHaveValue(initial);
    await expect(button).toBeFocused();
  });

  test('TimePicker digital: las tarjetas aceptan dígitos y flechas; Enter en la última aplica y cierra', async ({ page }) => {
    await gotoStable(page, '/date-time-picker/index.html');
    const field = page.locator('section#time .mtx-text-field').first();
    const input = field.locator('input').first();
    const button = field.locator('button[aria-haspopup="dialog"]');

    await button.click();
    const dialog = page.locator(`[id="${await button.getAttribute('aria-controls')}"]`);
    await expect(dialog).toBeVisible();
    const cards = dialog.locator('input.mtx-time-picker__digit-card--input');
    await expect(cards.first()).toBeFocused();

    await page.keyboard.type('14');
    await expect(cards.first()).toHaveValue('14');
    await cards.nth(1).focus();
    await page.keyboard.type('05');
    await page.keyboard.press('ArrowUp');
    await expect(cards.nth(1)).toHaveValue('06');
    await page.keyboard.press('Enter');

    await expect(dialog).toBeHidden();
    await expect(input).toHaveValue('14:06');
    await expect.poll(() => field.evaluate((el) => el.contains(document.activeElement)), 'el foco vuelve al campo').toBe(true);
  });
});
