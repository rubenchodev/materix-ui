import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/index.js';
import { setLocale } from '../src/i18n/index.js';

/** Monta HTML y devuelve la instancia del input indicado. */
function mount(html, id) {
  document.body.innerHTML = html;
  initAll();
  const input = document.getElementById(id);
  return { input, field: getInstance(input) };
}

describe('TextField — adornos interactivos y correcciones', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
    setLocale('en');
  });

  it('data-password-toggle crea un IconButton edge-end accesible', () => {
    const { input, field } = mount(
      '<input id="pw" data-mtx="text-field" data-label="Password" type="password" data-password-toggle />',
      'pw',
    );
    const btn = field.element.querySelector('.mtx-text-field__adornment--end button');
    expect(btn).not.toBeNull();
    expect(btn.type).toBe('button');
    expect(btn.classList.contains('mtx-icon-button')).toBe(true);
    expect(btn.getAttribute('aria-label')).toBe('Show password');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.getAttribute('aria-controls')).toBe('pw');
    expect(btn.textContent.trim()).toBe('visibility');
    expect(field.element.classList.contains('mtx-text-field--adorned-end')).toBe(true);

    btn.click();
    expect(input.type).toBe('text');
    expect(field.passwordVisible).toBe(true);
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.textContent.trim()).toBe('visibility_off');

    field.togglePasswordVisibility(false);
    expect(input.type).toBe('password');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  it('el toggle emite mtx:text-field:password-visibility y respeta disable()', () => {
    const { field } = mount(
      '<input id="pw" data-mtx="text-field" data-label="Password" type="password" data-password-toggle />',
      'pw',
    );
    const spy = vi.fn();
    field.element.addEventListener('mtx:text-field:password-visibility', spy);
    field.togglePasswordVisibility();
    expect(spy.mock.calls[0][0].detail.visible).toBe(true);
    field.disable();
    expect(field.passwordToggle.disabled).toBe(true);
    field.enable();
    expect(field.passwordToggle.disabled).toBe(false);
  });

  it('el toggle tiene prioridad sobre data-end-icon y conserva contador y error', () => {
    const { input, field } = mount(
      '<input id="pw" data-mtx="text-field" data-label="Password" type="password" data-end-icon="key" data-password-toggle maxlength="20" />',
      'pw',
    );
    expect(field.element.querySelectorAll('.mtx-text-field__adornment--end').length).toBe(1);
    field.value = 'secret';
    field.togglePasswordVisibility(true);
    expect(input.value).toBe('secret');
    expect(field.counterEl.textContent).toBe('6 / 20');
    field.setError('Too weak');
    field.togglePasswordVisibility(false);
    expect(field.element.classList.contains('mtx-text-field--error')).toBe(true);
  });

  it('el nombre del toggle se traduce con el locale del componente', () => {
    const { field } = mount(
      '<div lang="es"><input id="pw" data-mtx="text-field" data-label="Clave" type="password" data-password-toggle /></div>',
      'pw',
    );
    expect(field.passwordToggle.getAttribute('aria-label')).toBe('Mostrar contraseña');
  });

  it('data-password-toggle-label personaliza el nombre accesible', () => {
    const { field } = mount(
      '<input id="pw" data-mtx="text-field" type="password" data-label="P" data-password-toggle data-password-toggle-label="Show passwords" />',
      'pw',
    );
    expect(field.passwordToggle.getAttribute('aria-label')).toBe('Show passwords');
  });

  it('data-password-toggle se ignora si el input no es password', () => {
    const { field } = mount('<input id="t" data-mtx="text-field" data-label="T" data-password-toggle />', 't');
    expect(field.passwordToggle).toBeUndefined();
  });

  it('data-end-action / data-start-action emiten mtx:text-field:adornment-click', () => {
    const { field, input } = mount(
      '<input id="s" data-mtx="text-field" data-label="Search" data-start-action="search" data-start-action-label="Search" data-end-action="clear" data-end-action-label="Clear" />',
      's',
    );
    const spy = vi.fn();
    field.element.addEventListener('mtx:text-field:adornment-click', spy);
    expect(field.startAction.getAttribute('aria-label')).toBe('Search');
    expect(field.element.classList.contains('mtx-text-field--adorned-start')).toBe(true);
    field.endAction.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail.position).toBe('end');
    expect(spy.mock.calls[0][0].detail.input).toBe(input);
  });

  it('en tamaño small el botón usa mtx-icon-button--small', () => {
    const { field } = mount(
      '<input id="pw" data-mtx="text-field" data-size="small" type="password" data-label="P" data-password-toggle />',
      'pw',
    );
    expect(field.passwordToggle.classList.contains('mtx-icon-button--small')).toBe(true);
  });

  it('data-error vacío activa el error conservando el helper text', () => {
    const { input, field } = mount(
      '<input id="e" data-mtx="text-field" data-label="Email" data-helper-text="Usa tu correo" data-error />',
      'e',
    );
    expect(field.element.classList.contains('mtx-text-field--error')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(field.helperEl.textContent).toBe('Usa tu correo');
  });

  it('data-error="false" no activa el error', () => {
    const { field } = mount('<input id="e" data-mtx="text-field" data-label="Email" data-error="false" />', 'e');
    expect(field.element.classList.contains('mtx-text-field--error')).toBe(false);
  });

  it('las clases del input se concatenan al wrapper sin perder mtx-text-field', () => {
    const { field } = mount(
      '<input id="c" class="my-field mtx-text-field--margin-dense" data-mtx="text-field" data-label="C" />',
      'c',
    );
    expect(field.element.classList.contains('mtx-text-field')).toBe(true);
    expect(field.element.classList.contains('my-field')).toBe(true);
    expect(field.element.classList.contains('mtx-text-field--margin-dense')).toBe(true);
  });

  it('un <select> recibe un único chevron', () => {
    const { field } = mount(
      '<select id="sel" data-mtx="text-field" data-label="Country"><option>Spain</option></select>',
      'sel',
    );
    expect(field.element.querySelectorAll('.mtx-text-field__chevron').length).toBe(1);
  });

  it('los sufijos del contador se traducen (en/es)', () => {
    const { field } = mount('<textarea id="w" data-mtx="text-field" data-label="Bio" data-counter="words"></textarea>', 'w');
    field.value = 'one two three';
    expect(field.counterEl.textContent).toBe('3 words');

    const es = mount(
      '<div lang="es"><textarea id="b" data-mtx="text-field" data-label="Bio" data-counter="both" data-max-words="10" data-max-chars="100"></textarea></div>',
      'b',
    );
    es.field.value = 'uno dos';
    expect(es.field.counterEl.textContent).toBe('2/10 pal. | 7/100 car.');
  });

  it('re-traduce el contador al cambiar el locale global', () => {
    const { field } = mount('<textarea id="w" data-mtx="text-field" data-label="Bio" data-counter="words"></textarea>', 'w');
    field.value = 'a b';
    setLocale('es');
    expect(field.counterEl.textContent).toBe('2 palabras');
    setLocale('en');
    field.destroy();
  });

  it('CSS: oculta los decoradores nativos de type="search" y centra el label small', () => {
    const css = readFileSync('src/components/text-field/text-field.css', 'utf8');
    const pseudos = [
      '-webkit-search-cancel-button',
      '-webkit-search-decoration',
      '-webkit-search-results-button',
      '-webkit-search-results-decoration',
    ];
    for (const pseudo of pseudos) {
      const selector = `.mtx-text-field__input[type='search']::${pseudo} {`;
      const start = css.indexOf(selector);
      expect(start, pseudo).toBeGreaterThan(-1);
      const body = css.slice(start + selector.length, css.indexOf('}', start));
      expect(body).toMatch(/display:\s*none/);
    }
    expect(css).toMatch(/\.mtx-text-field__input::-ms-clear \{[^}]*display:\s*none/);
    // Cada pseudo-elemento propietario va en su propia regla (uno desconocido invalida la lista)
    expect(css).not.toMatch(/::-webkit-search-[a-z-]+,/);
    // Outlined small (40px): label en reposo centrado (10px + 20.125px de línea ≈ 20px)
    expect(css).toMatch(/\.mtx-text-field__label \{\s*transform: translate\(0, 10px\) scale\(1\);\s*font-size: 0\.875rem;/);
  });
});
