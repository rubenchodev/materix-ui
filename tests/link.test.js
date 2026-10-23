import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Link } from '../src/components/link/link.js';

function createLink(attrs = {}, text = 'Enlace de prueba') {
  const a = document.createElement('a');
  a.className = 'mtx-link';
  a.setAttribute('data-mtx', 'link');
  a.href = 'https://example.com';
  Object.entries(attrs).forEach(([k, v]) => a.setAttribute(k, v));
  a.textContent = text;
  document.body.appendChild(a);
  return a;
}

describe('Link', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y registra como una instancia de Link', () => {
    const el = createLink();
    initAll();
    const link = getInstance(el);
    expect(link).toBeInstanceOf(Link);
    expect(el.href).toBe('https://example.com/');
  });

  it('aplica clases de color y subrayado declarativo', () => {
    const el = createLink({ 'data-color': 'secondary', 'data-underline': 'always' });
    initAll();
    expect(el.classList.contains('mtx-link--secondary')).toBe(true);
    expect(el.classList.contains('mtx-link--underline-always')).toBe(true);
  });
});

describe('Link — correcciones de plantillas (A15)', () => {
  const css = readFileSync('src/components/link/link.css', 'utf8');

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('hereda la tipografía (sin font-size fijo)', () => {
    const base = css.match(/\.mtx-link\s*\{[^}]*\}/)[0];
    expect(base).not.toMatch(/font-size/);
    expect(base).toMatch(/font:\s*inherit/);
  });

  it('sobre <button>: type="button", sin borde nativo y deshabilitable', () => {
    const btn = document.createElement('button');
    btn.setAttribute('data-mtx', 'link');
    btn.textContent = 'Reenviar código';
    document.body.appendChild(btn);
    initAll();
    expect(btn.classList.contains('mtx-link')).toBe(true);
    expect(btn.getAttribute('type')).toBe('button');
    expect(css).toMatch(/button\.mtx-link\s*\{[^}]*border:\s*0/);
    expect(css).toMatch(/\.mtx-link:disabled/);
    const link = getInstance(btn);
    link.disable();
    expect(btn.disabled).toBe(true);
    link.enable();
    expect(btn.disabled).toBe(false);
  });

  it('respeta un type explícito y bloquea <a> con data-disabled', () => {
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.setAttribute('data-mtx', 'link');
    document.body.appendChild(submit);
    const a = createLink({ 'data-disabled': '' });
    initAll();
    expect(submit.getAttribute('type')).toBe('submit');
    expect(a.getAttribute('aria-disabled')).toBe('true');
    expect(a.tabIndex).toBe(-1);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    a.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});

describe('Link — subrayado por defecto (MUI v5, axe link-in-text-block)', () => {
  const css = readFileSync('src/components/link/link.css', 'utf8');
  const crumbsCss = readFileSync('src/components/breadcrumbs/breadcrumbs.css', 'utf8');

  it('el bloque base subraya siempre y hover/none siguen disponibles', () => {
    const base = css.match(/\.mtx-link\s*\{[^}]*\}/)[0];
    expect(base).toMatch(/text-decoration:\s*underline/);
    expect(css).toMatch(/\.mtx-link--underline-hover\s*\{\s*text-decoration:\s*none/);
    expect(css).toMatch(/\.mtx-link--underline-hover:hover\s*\{[^}]*text-decoration:\s*underline/);
    expect(css).toMatch(/\.mtx-link--underline-none:hover\s*\{\s*text-decoration:\s*none/);
  });

  it('Breadcrumbs conserva el subrayado en hover para sus enlaces', () => {
    expect(crumbsCss).toMatch(/\.mtx-breadcrumbs__link\.mtx-link:not\(\[class\*='mtx-link--underline-'\]\)\s*\{\s*text-decoration:\s*none/);
  });
});
