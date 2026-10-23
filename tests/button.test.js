import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/button/button.js';

function createButton(attrs = {}) {
  const btn = document.createElement('button');
  btn.className = 'mtx-button mtx-button--contained';
  btn.setAttribute('data-mtx', 'button');
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'disabled') {
      btn.disabled = v;
    } else {
      btn.setAttribute(k, v);
    }
  });
  document.body.appendChild(btn);
  return btn;
}

function createAnchor() {
  const a = document.createElement('a');
  a.className = 'mtx-button mtx-button--contained';
  a.setAttribute('data-mtx', 'button');
  a.href = '#';
  document.body.appendChild(a);
  return a;
}

describe('Button', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = createButton();
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('la variante por defecto (sin modificadores) se inicializa', () => {
    const el = document.createElement('button');
    el.className = 'mtx-button';
    el.setAttribute('data-mtx', 'button');
    document.body.appendChild(el);
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('disable() y enable() controlan el atributo nativo', () => {
    const el = createButton();
    initAll();
    const button = getInstance(el);

    button.disable();
    expect(el.disabled).toBe(true);

    button.enable();
    expect(el.disabled).toBe(false);
  });

  it('enable() restaura el estado deshabilitado', () => {
    const el = createButton({ disabled: true });
    initAll();
    const button = getInstance(el);

    button.enable();
    expect(el.disabled).toBe(false);
    expect(button.disabled).toBe(false);
  });

  it('expone el estado disabled', () => {
    const el = createButton({ disabled: true });
    initAll();
    expect(getInstance(el).disabled).toBe(true);
  });

  it('soporta enlaces <a> con aria-disabled', () => {
    const el = createAnchor();
    el.setAttribute('aria-disabled', 'true');
    initAll();

    const button = getInstance(el);
    expect(button.disabled).toBe(true);

    button.enable();
    expect(el.hasAttribute('aria-disabled')).toBe(false);
    expect(button.disabled).toBe(false);

    button.disable();
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.tabIndex).toBe(-1);
  });

  it('impide la navegación de un enlace deshabilitado', () => {
    const el = createAnchor();
    initAll();
    const button = getInstance(el);

    button.disable();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('destroy() elimina los listeners de ripple', () => {
    const el = createButton();
    initAll();
    const button = getInstance(el);

    button.destroy();
    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
    }));

    expect(el.querySelector('.mtx-ripple')).toBeNull();
  });

  it('añade ripple al recibir pointerdown', () => {
    const el = createButton();
    initAll();

    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
    }));

    expect(el.querySelector('.mtx-ripple')).not.toBeNull();
  });

  it('no genera ripple si está deshabilitado', () => {
    const el = createButton({ disabled: true });
    initAll();

    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
    }));

    expect(el.querySelector('.mtx-ripple')).toBeNull();
  });
});

describe('Button — correcciones de plantillas (A5, A17)', () => {
  const css = readFileSync('src/components/button/button.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('data-color añade el modificador de color, incluido inherit', () => {
    const inherit = createButton({ 'data-color': 'inherit' });
    const error = createButton({ 'data-color': 'error' });
    initAll();
    expect(inherit.classList.contains('mtx-button--inherit')).toBe(true);
    expect(error.classList.contains('mtx-button--error')).toBe(true);
  });

  it('define mtx-button--inherit con currentColor', () => {
    expect(css).toMatch(/\.mtx-button--inherit\s*\{[^}]*--mtx-btn-color:\s*currentColor/);
  });

  it('el SVG dentro de __icon mide 24px y no se fuerza font-size en el icono', () => {
    expect(css).toMatch(/\.mtx-button__icon svg\s*\{[^}]*width:\s*24px;[^}]*height:\s*24px/);
    const iconRule = css.match(/\.mtx-button__icon\s*\{[^}]*\}/)[0];
    expect(iconRule).not.toMatch(/font-size/);
  });

  it('<a> sin subrayado y con estilo deshabilitado por aria-disabled', () => {
    expect(css).toMatch(/\.mtx-button\s*\{[^}]*text-decoration:\s*none/);
    expect(css).toMatch(/\.mtx-button\[aria-disabled="true"\]/);
  });
});

describe('Button — data-start-icon / data-end-icon', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('genera iconos decorativos al inicio y al final', () => {
    document.body.innerHTML = '<button class="mtx-button mtx-button--contained" data-mtx="button" data-start-icon="add" data-end-icon="send">Enviar</button>';
    initAll();
    const btn = document.querySelector('button');
    const icons = btn.querySelectorAll(':scope > .mtx-button__icon');
    expect(icons).toHaveLength(2);
    expect(btn.firstElementChild).toBe(icons[0]);
    expect(btn.lastElementChild).toBe(icons[1]);
    expect(icons[0].textContent).toBe('add');
    expect(icons[0].className).toBe('mtx-button__icon mtx-button__icon--start material-icons');
    expect(icons[1].className).toBe('mtx-button__icon mtx-button__icon--end material-icons');
    icons.forEach((icon) => expect(icon.getAttribute('aria-hidden')).toBe('true'));
    expect(btn.textContent.replace(/add|send/g, '').trim()).toBe('Enviar');
  });

  it('es idempotente y no duplica iconos BEM ya presentes', () => {
    document.body.innerHTML = '<button class="mtx-button" data-mtx="button" data-start-icon="add"><span class="mtx-button__icon material-icons" aria-hidden="true">add</span>Nuevo</button>';
    initAll();
    initAll();
    expect(document.querySelectorAll('.mtx-button__icon')).toHaveLength(1);
  });

  it('funciona en enlaces <a>', () => {
    document.body.innerHTML = '<a class="mtx-button mtx-button--outlined" data-mtx="button" href="#x" data-end-icon="arrow_forward">Siguiente</a>';
    initAll();
    expect(document.querySelector('a > .mtx-button__icon--end').textContent).toBe('arrow_forward');
  });

  it('data-loading-position="start" sustituye el icono generado y lo restaura', () => {
    document.body.innerHTML = '<button class="mtx-button mtx-button--contained" data-mtx="button" data-start-icon="save" data-loading data-loading-position="start">Guardar</button>';
    initAll();
    const btn = document.querySelector('button');
    const icon = btn.querySelector('.mtx-button__icon--start.material-icons');
    expect(icon.classList.contains('mtx-button__icon--loading-hidden')).toBe(true);
    const indicator = btn.querySelector('.mtx-button__loading-indicator');
    expect(indicator.nextElementSibling).toBe(icon);
    expect(indicator.classList.contains('mtx-button__icon--start')).toBe(true);
    getInstance(btn).setLoading(false);
    expect(icon.classList.contains('mtx-button__icon--loading-hidden')).toBe(false);
  });

  it('data-loading-position="end" sustituye el icono final generado', () => {
    document.body.innerHTML = '<button class="mtx-button" data-mtx="button" data-end-icon="send" data-loading data-loading-position="end">Enviar</button>';
    initAll();
    const btn = document.querySelector('button');
    expect(btn.querySelector('.mtx-button__icon--end').classList.contains('mtx-button__icon--loading-hidden')).toBe(true);
    expect(btn.lastElementChild.classList.contains('mtx-button__loading-indicator')).toBe(true);
  });
});

describe('Button sobre superficie de color (data-surface)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('data-surface="primary" añade mtx-button--on-primary sin perder clases', () => {
    const el = createButton({ 'data-surface': 'primary', 'data-color': 'inherit' });
    initAll();
    expect(el.classList.contains('mtx-button--on-primary')).toBe(true);
    expect(el.classList.contains('mtx-button--contained')).toBe(true);
    expect(el.classList.contains('mtx-button--inherit')).toBe(true);
  });

  it('acepta secondary e ignora superficies desconocidas', () => {
    const a = createButton({ 'data-surface': 'secondary' });
    const b = createButton({ 'data-surface': 'banana' });
    initAll();
    expect(a.classList.contains('mtx-button--on-secondary')).toBe(true);
    expect([...b.classList].some((c) => c.startsWith('mtx-button--on-'))).toBe(false);
  });

  it('el CSS invierte contained (fondo papel + texto del color) y hereda en text/outlined', () => {
    const css = readFileSync('src/components/button/button.css', 'utf8');
    const rule = css.match(/\.mtx-button--on-primary,\s*\.mtx-button--on-secondary \{([^}]*)\}/)[1];
    expect(rule).toContain('--mtx-btn-bg: var(--mtx-color-background-paper)');
    expect(rule).toContain('--mtx-btn-fg: var(--mtx-color-primary-text)');
    expect(rule).toContain('--mtx-btn-color: currentColor');
  });
});
