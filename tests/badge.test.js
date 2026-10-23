import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Badge } from '../src/components/badge/badge.js';

function createBadge(attrs = {}, contentHTML = '<span>Mail</span>') {
  const el = document.createElement('div');
  el.className = 'mtx-badge';
  el.setAttribute('data-mtx', 'badge');
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  el.innerHTML = contentHTML;
  document.body.appendChild(el);
  return el;
}

describe('Badge', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y crea la insignia interior', () => {
    const el = createBadge({ 'data-content': '4' });
    initAll();
    const badge = getInstance(el);
    expect(badge).toBeInstanceOf(Badge);

    const badgeSpan = el.querySelector('.mtx-badge__badge');
    expect(badgeSpan).not.toBeNull();
    expect(badgeSpan.textContent).toBe('4');
  });

  it('aplica el formato max+ a valores numéricos superiores al máximo', () => {
    const el = createBadge({ 'data-content': '150', 'data-max': '99' });
    initAll();
    const badgeSpan = el.querySelector('.mtx-badge__badge');
    expect(badgeSpan.textContent).toBe('99+');
  });

  it('oculta el badge cuando el valor es 0 a menos que data-show-zero esté presente', () => {
    const el1 = createBadge({ 'data-content': '0' });
    initAll();
    expect(el1.classList.contains('mtx-badge--invisible')).toBe(true);

    const el2 = createBadge({ 'data-content': '0', 'data-show-zero': '' });
    initAll();
    expect(el2.classList.contains('mtx-badge--invisible')).toBe(false);
  });

  it('soporta la variante dot sin texto', () => {
    const el = createBadge({ 'data-variant': 'dot' });
    initAll();
    expect(el.classList.contains('mtx-badge--dot')).toBe(true);
    expect(el.classList.contains('mtx-badge--invisible')).toBe(false);
  });

  it('permite cambiar el contenido e invisibilidad mediante setters', () => {
    const el = createBadge({ 'data-content': '5' });
    initAll();
    const badge = getInstance(el);

    badge.content = '10';
    expect(el.querySelector('.mtx-badge__badge').textContent).toBe('10');

    badge.invisible = true;
    expect(badge.invisible).toBe(true);
    expect(el.classList.contains('mtx-badge--invisible')).toBe(true);
  });

  it('aplica color default explícito y colores de paleta', () => {
    const a = createBadge({ 'data-content': '1' });
    const b = createBadge({ 'data-content': '1', 'data-color': 'error' });
    initAll();
    expect(a.classList.contains('mtx-badge--default')).toBe(true);
    expect(b.classList.contains('mtx-badge--error')).toBe(true);
  });

  it('data-standalone muestra la insignia en línea y accesible sin hijo', () => {
    const el = createBadge({ 'data-content': '4', 'data-standalone': '', 'data-color': 'primary' }, '');
    initAll();
    expect(el.classList.contains('mtx-badge--standalone')).toBe(true);
    const badge = el.querySelector('.mtx-badge__badge');
    expect(badge.textContent).toBe('4');
    expect(badge.hasAttribute('aria-hidden')).toBe(false);
    getInstance(el).content = 0;
    expect(el.classList.contains('mtx-badge--invisible')).toBe(true);
  });

  it('data-label genera texto accesible con el contenido interpolado', () => {
    const el = createBadge({ 'data-content': '150', 'data-label': '{0} sin leer' });
    initAll();
    expect(el.querySelector('.mtx-badge__badge').getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelector('.mtx-badge__label').textContent).toBe('99+ sin leer');
    getInstance(el).invisible = true;
    expect(el.querySelector('.mtx-badge__label').textContent).toBe('');
  });
});
