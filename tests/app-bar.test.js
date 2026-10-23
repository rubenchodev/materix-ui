import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { AppBar } from '../src/components/app-bar/app-bar.js';

describe('AppBar', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa declarativamente con data-mtx="app-bar"', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    document.body.appendChild(el);

    initAll();

    const instance = getInstance(el);
    expect(instance).toBeInstanceOf(AppBar);
    expect(el.classList.contains('mtx-app-bar')).toBe(true);
    expect(el.classList.contains('mtx-app-bar--fixed')).toBe(true);
    expect(el.classList.contains('mtx-app-bar--default')).toBe(true);
  });

  it('aplica variante de posición desde data-position', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-position', 'static');
    document.body.appendChild(el);

    initAll();

    expect(el.classList.contains('mtx-app-bar--static')).toBe(true);
  });

  it('aplica variante de color desde data-color', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-color', 'primary');
    document.body.appendChild(el);

    initAll();

    expect(el.classList.contains('mtx-app-bar--primary')).toBe(true);
  });

  it('permite cambiar posición y color mediante API programática', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    document.body.appendChild(el);

    initAll();
    const appbar = getInstance(el);

    appbar.setPosition('sticky');
    expect(el.classList.contains('mtx-app-bar--sticky')).toBe(true);
    expect(el.classList.contains('mtx-app-bar--fixed')).toBe(false);

    appbar.setColor('secondary');
    expect(el.classList.contains('mtx-app-bar--secondary')).toBe(true);
    expect(el.classList.contains('mtx-app-bar--default')).toBe(false);
  });

  it('aplica elevate-on-scroll correctamente', async () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-elevate-on-scroll', 'true');
    document.body.appendChild(el);

    initAll();

    // Estado inicial (scroll 0)
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('none');

    // Simular scroll hacia abajo
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    // Esperar al requestAnimationFrame
    await new Promise(r => requestAnimationFrame(r));
    
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('var(--mtx-elevation-4)');

    // Simular scroll arriba
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    await new Promise(r => requestAnimationFrame(r));

    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('none');
  });

  it('aplica hide-on-scroll correctamente', async () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-hide-on-scroll', 'true');
    document.body.appendChild(el);

    initAll();

    expect(el.classList.contains('mtx-app-bar--hidden')).toBe(false);

    // Bajar más de 50px
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    await new Promise(r => requestAnimationFrame(r));

    expect(el.classList.contains('mtx-app-bar--hidden')).toBe(true);

    // Subir
    Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    await new Promise(r => requestAnimationFrame(r));

    expect(el.classList.contains('mtx-app-bar--hidden')).toBe(false);
  });

  it('auto-construye la estructura con sintaxis simplificada y elementos hijos (ej. botón Login)', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-title', 'News');
    el.setAttribute('data-start-icon', 'menu');

    const loginBtn = document.createElement('button');
    loginBtn.className = 'mtx-button mtx-button--text';
    loginBtn.textContent = 'Login';
    el.appendChild(loginBtn);

    document.body.appendChild(el);

    initAll();

    const toolbar = el.querySelector('.mtx-toolbar');
    expect(toolbar).not.toBeNull();

    const navIcon = toolbar.querySelector('.mtx-toolbar__navigation-icon');
    expect(navIcon).not.toBeNull();
    expect(navIcon.textContent).toBe('menu');

    const title = toolbar.querySelector('.mtx-toolbar__title');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('News');

    const btn = toolbar.querySelector('.mtx-button');
    expect(btn).toBe(loginBtn);
  });

  it('soporta contenedor personalizado con data-scroll-target', async () => {
    const container = document.createElement('div');
    container.id = 'scroll-box';
    Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });
    document.body.appendChild(container);

    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-elevate-on-scroll', 'true');
    el.setAttribute('data-scroll-target', '#scroll-box');
    document.body.appendChild(el);

    initAll();

    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('none');

    // Simular scroll dentro del contenedor
    container.scrollTop = 150;
    container.dispatchEvent(new Event('scroll'));

    await new Promise(r => requestAnimationFrame(r));
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('var(--mtx-elevation-4)');

    // Destruir instancia y verificar que ya no responde
    const instance = getInstance(el);
    instance.destroy();

    container.scrollTop = 0;
    container.dispatchEvent(new Event('scroll'));
    await new Promise(r => requestAnimationFrame(r));

    // Mantiene la sombra previa porque el listener fue removido
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('var(--mtx-elevation-4)');
  });

  it('no fija box-shadow en línea: --transparent y --flat pueden anular la sombra', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-color', 'transparent');
    el.setAttribute('data-elevation', '8');
    document.body.appendChild(el);
    initAll();
    expect(el.style.boxShadow).toBe('');
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('var(--mtx-elevation-8)');
  });

  it('data-elevation="0" añade el modificador --flat (divisor único en color default)', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-color', 'default');
    el.setAttribute('data-elevation', '0');
    document.body.appendChild(el);
    initAll();
    expect(el.classList.contains('mtx-app-bar--flat')).toBe(true);
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('var(--mtx-elevation-0)');
  });

  it('sin data-elevation no escribe la variable de sombra (usa la elevación 4 del CSS)', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    document.body.appendChild(el);
    initAll();
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('');
    expect(el.classList.contains('mtx-app-bar--flat')).toBe(false);
  });

  it('el icono de navegación usa un aria-label legible (i18n) y data-start-icon-label', () => {
    const a = document.createElement('header');
    a.setAttribute('data-mtx', 'app-bar');
    a.setAttribute('data-start-icon', 'menu');
    a.setAttribute('data-title', 'App');
    const b = document.createElement('header');
    b.setAttribute('data-mtx', 'app-bar');
    b.setAttribute('data-start-icon', 'arrow_back');
    b.setAttribute('data-start-icon-label', 'Volver');
    b.setAttribute('data-end-icon', 'search');
    b.setAttribute('data-end-icon-label', 'Buscar');
    document.body.append(a, b);
    initAll();
    expect(a.querySelector('.mtx-toolbar__navigation-icon').getAttribute('aria-label')).toBe('Open navigation');
    expect(b.querySelector('.mtx-toolbar__navigation-icon').getAttribute('aria-label')).toBe('Volver');
    const end = b.querySelectorAll('.mtx-icon-button')[1];
    expect(end.getAttribute('aria-label')).toBe('Buscar');
    expect(end.querySelector('.material-icons').getAttribute('aria-hidden')).toBe('true');
  });

  it('data-drawer convierte el icono de navegación en disparador del Drawer', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-start-icon', 'menu');
    el.setAttribute('data-drawer', 'app-nav');
    el.setAttribute('data-title', 'App');
    document.body.appendChild(el);
    initAll();
    const nav = el.querySelector('.mtx-toolbar__navigation-icon');
    expect(nav.getAttribute('data-mtx-drawer-toggle')).toBe('app-nav');
    expect(nav.getAttribute('aria-controls')).toBe('app-nav');
    expect(nav.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('AppBar — botones en la toolbar (regresión de contraste)', () => {
  const css = readFileSync('src/components/app-bar/app-bar.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const inheritSelectors = [...css.matchAll(/([^{}]+)\{[^}]*color:\s*inherit[^}]*\}/g)]
    .flatMap((m) => m[1].split(',').map((s) => s.trim()))
    .filter((s) => /\.mtx-toolbar\b/.test(s) && /\.mtx-button\b/.test(s));

  it('existe la regla que hereda el color en botones text/outlined', () => {
    expect(inheritSelectors.length).toBeGreaterThan(0);
  });

  it('ninguna regla color:inherit de la toolbar alcanza a .mtx-button--contained', () => {
    inheritSelectors.forEach((selector) => {
      expect(selector).toMatch(/:not\(\.mtx-button--contained\)/);
    });
  });

  it('el selector no coincide con un botón contained ni disabled y sí con uno text', () => {
    document.body.innerHTML = '<div class="mtx-toolbar">'
      + '<button class="mtx-button mtx-button--contained" id="c">A</button>'
      + '<button class="mtx-button mtx-button--text" id="t">B</button>'
      + '<button class="mtx-button mtx-button--outlined" id="d" disabled>C</button></div>';
    const matches = (id) => inheritSelectors.some((s) => document.getElementById(id).matches(s));
    expect(matches('c')).toBe(false);
    expect(matches('t')).toBe(true);
    expect(matches('d')).toBe(false);
  });
});

describe('AppBar — scroll-padding-top automático', () => {
  const css = readFileSync('src/components/app-bar/app-bar.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('html con AppBar fixed/sticky reserva la altura de la barra para las anclas', () => {
    expect(css).toMatch(/html:not\(\[data-mtx-scroll-padding="false"\]\):has\(\.mtx-app-bar--fixed, \.mtx-app-bar--sticky\)\s*\{\s*scroll-padding-top:\s*var\(--mtx-scroll-padding-top, var\(--mtx-app-bar-height/);
  });
});

describe('AppBar — separación entre acciones de la Toolbar', () => {
  it('declara margen entre acciones consecutivas con el token --mtx-toolbar-action-gap', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const css = fs.readFileSync(path.resolve(__dirname, '../src/components/app-bar/app-bar.css'), 'utf-8');
    expect(css).toMatch(/\.mtx-toolbar > :is\([^)]*\.mtx-icon-button[^)]*\)\s*\+\s*:is\([^)]*\.mtx-avatar[^)]*\)\s*\{\s*margin-inline-start: var\(--mtx-toolbar-action-gap/);
  });
  it('destroy() cancela el frame de scroll pendiente', () => {
    const el = document.createElement('header');
    el.setAttribute('data-mtx', 'app-bar');
    el.setAttribute('data-elevate-on-scroll', 'true');
    document.body.appendChild(el);
    initAll();
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(987);
    const caf = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    try {
      window.dispatchEvent(new Event('scroll'));
      expect(raf).toHaveBeenCalled();
      getInstance(el).destroy();
      expect(caf).toHaveBeenCalledWith(987);
    } finally {
      raf.mockRestore();
      caf.mockRestore();
    }
  });
});
