import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Breadcrumbs } from '../src/components/breadcrumbs/breadcrumbs.js';
import { Link } from '../src/components/link/link.js';
import { resetLocale } from '../src/i18n/index.js';

/**
 * Monta HTML en el body e inicializa.
 * @param {string} html Marcado.
 * @returns {HTMLElement} Primer elemento.
 */
function mount(html) {
  document.body.innerHTML = html;
  const first = document.body.firstElementChild;
  initAll();
  return first;
}

const longPath = `
  <ol data-mtx="breadcrumbs" data-max-items="3">
    <li><a href="/">Home</a></li>
    <li><a href="/a">A</a></li>
    <li><a href="/b">B</a></li>
    <li><a href="/c">C</a></li>
    <li>Current</li>
  </ol>`;

describe('Breadcrumbs', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
    resetLocale();
  });

  it('envuelve un <ol> en <nav aria-label> y registra la instancia en ambos', () => {
    const ol = mount('<ol data-mtx="breadcrumbs"><li><a href="/">Home</a></li><li>Invoices</li></ol>');
    const nav = document.querySelector('nav');
    expect(nav.classList.contains('mtx-breadcrumbs')).toBe(true);
    expect(nav.getAttribute('aria-label')).toBe('breadcrumb');
    expect(ol.parentElement).toBe(nav);
    expect(ol.classList.contains('mtx-breadcrumbs__ol')).toBe(true);
    const instance = getInstance(ol);
    expect(instance).toBeInstanceOf(Breadcrumbs);
    expect(getInstance(nav)).toBe(instance);
  });

  it('usa Link (color inherit, underline hover) y marca el último como página actual', () => {
    mount('<ol data-mtx="breadcrumbs"><li><a href="/">Home</a></li><li>Invoices</li></ol>');
    const link = document.querySelector('a');
    expect(getInstance(link)).toBeInstanceOf(Link);
    expect(link.classList.contains('mtx-link--inherit')).toBe(true);
    expect(link.classList.contains('mtx-link--underline-hover')).toBe(true);
    const current = document.querySelector('[aria-current="page"]');
    expect(current.textContent).toBe('Invoices');
    expect(current.classList.contains('mtx-breadcrumbs__text')).toBe(true);
  });

  it('respeta un aria-current existente', () => {
    mount('<ol data-mtx="breadcrumbs"><li><a href="/" aria-current="page">Home</a></li><li><a href="/x">X</a></li></ol>');
    expect(document.querySelectorAll('[aria-current="page"]').length).toBe(1);
    expect(document.querySelector('[aria-current="page"]').textContent).toBe('Home');
  });

  it('inserta separadores aria-hidden de texto o icono', () => {
    mount('<ol data-mtx="breadcrumbs"><li><a href="/">A</a></li><li><a href="/b">B</a></li><li>C</li></ol>');
    const seps = document.querySelectorAll('.mtx-breadcrumbs__separator');
    expect(seps.length).toBe(2);
    expect(seps[0].getAttribute('aria-hidden')).toBe('true');
    expect(seps[0].textContent).toBe('/');

    mount('<ol data-mtx="breadcrumbs" data-separator="navigate_next"><li><a href="/">A</a></li><li>B</li></ol>');
    expect(document.querySelector('.mtx-breadcrumbs__separator .material-icons').textContent).toBe('navigate_next');

    mount('<ol data-mtx="breadcrumbs" data-separator="›"><li><a href="/">A</a></li><li>B</li></ol>');
    expect(document.querySelector('.mtx-breadcrumbs__separator').textContent).toBe('›');
  });

  it('construye la lista desde un <nav> con enlaces directos', () => {
    const nav = mount('<nav data-mtx="breadcrumbs" aria-label="You are here"><a href="/">Home</a><a href="/docs">Docs</a><span>API</span></nav>');
    expect(nav.querySelector('ol.mtx-breadcrumbs__ol')).not.toBeNull();
    expect(nav.querySelectorAll('.mtx-breadcrumbs__li').length).toBe(3);
    expect(nav.getAttribute('aria-label')).toBe('You are here');
    expect(nav.querySelector('span[aria-current="page"]').textContent).toBe('API');
  });

  it('añade role="navigation" si el contenedor no es <nav>', () => {
    const div = mount('<div data-mtx="breadcrumbs"><a href="/">Home</a><span>Here</span></div>');
    expect(div.getAttribute('role')).toBe('navigation');
  });

  it('añade iconos desde data-icon', () => {
    mount('<ol data-mtx="breadcrumbs"><li><a href="/" data-icon="home">Home</a></li><li>X</li></ol>');
    const icon = document.querySelector('a .mtx-breadcrumbs__icon');
    expect(icon.textContent).toBe('home');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(getInstance(document.querySelector('ol')).getItems()[0]).toMatchObject({ label: 'Home', icon: 'home', href: '/' });
  });

  it('colapsa con data-max-items y expande con el botón accesible', () => {
    const ol = mount(longPath);
    const instance = getInstance(ol);
    expect(ol.querySelectorAll('.mtx-breadcrumbs__li').length).toBe(2);
    const button = ol.querySelector('.mtx-breadcrumbs__collapse-button');
    expect(button.getAttribute('aria-label')).toBe('Show path');
    expect(button.getAttribute('type')).toBe('button');
    let expanded = 0;
    ol.parentElement.addEventListener('mtx:breadcrumbs:expand', () => { expanded += 1; });
    button.click();
    expect(instance.expanded).toBe(true);
    expect(ol.querySelectorAll('.mtx-breadcrumbs__li').length).toBe(5);
    expect(ol.querySelector('.mtx-breadcrumbs__collapse-button')).toBeNull();
    expect(document.activeElement.textContent).toBe('A');
    expect(expanded).toBe(1);
    instance.collapse();
    expect(ol.querySelectorAll('.mtx-breadcrumbs__li').length).toBe(2);
  });

  it('respeta items-before/after-collapse', () => {
    mount(longPath.replace('data-max-items="3"', 'data-max-items="3" data-items-before-collapse="2" data-items-after-collapse="2"'));
    const labels = Array.from(document.querySelectorAll('.mtx-breadcrumbs__li')).map((li) => li.textContent);
    expect(labels).toEqual(['Home', 'A', 'C', 'Current']);
  });

  it('no colapsa si before + after cubren todos los ítems', () => {
    mount(longPath.replace('data-max-items="3"', 'data-max-items="2" data-items-before-collapse="3" data-items-after-collapse="2"'));
    expect(document.querySelector('.mtx-breadcrumbs__collapse-button')).toBeNull();
  });

  it('emite mtx:breadcrumbs:navigate cancelable con index y href', () => {
    const ol = mount('<ol data-mtx="breadcrumbs"><li><a href="#home" data-folder="root">Home</a></li><li>X</li></ol>');
    const nav = ol.parentElement;
    let detail = null;
    nav.addEventListener('mtx:breadcrumbs:navigate', (event) => {
      detail = event.detail;
      event.preventDefault();
    });
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    document.querySelector('a').dispatchEvent(click);
    expect(detail.index).toBe(0);
    expect(detail.href).toBe('#home');
    expect(detail.label).toBe('Home');
    expect(detail.item.data).toEqual({ folder: 'root' });
    expect(click.defaultPrevented).toBe(true);
  });

  it('setItems() reconstruye la ruta con enlaces, botones, iconos y data', () => {
    const ol = mount('<ol data-mtx="breadcrumbs"><li>Start</li></ol>');
    const instance = getInstance(ol);
    instance.setItems([
      { label: 'My Drive', icon: 'folder', data: { folder: '' } },
      { label: 'Projects', href: '#projects' },
      { label: 'Q3' },
    ]);
    const lis = ol.querySelectorAll('.mtx-breadcrumbs__li');
    expect(lis.length).toBe(3);
    const first = lis[0].firstElementChild;
    expect(first.tagName).toBe('BUTTON');
    expect(first.getAttribute('data-folder')).toBe('');
    expect(first.querySelector('.mtx-breadcrumbs__icon').textContent).toBe('folder');
    expect(lis[1].firstElementChild.tagName).toBe('A');
    expect(lis[2].firstElementChild.tagName).toBe('SPAN');
    expect(lis[2].firstElementChild.getAttribute('aria-current')).toBe('page');
    expect(instance.getItems().map((i) => i.label)).toEqual(['My Drive', 'Projects', 'Q3']);
    expect(() => instance.setItems('x')).toThrow(TypeError);
  });

  it('es idempotente', () => {
    const ol = mount('<ol data-mtx="breadcrumbs"><li><a href="/">A</a></li><li>B</li></ol>');
    const instance = getInstance(ol);
    initAll();
    initAll();
    expect(getInstance(ol)).toBe(instance);
    expect(document.querySelectorAll('nav').length).toBe(1);
    expect(document.querySelectorAll('.mtx-breadcrumbs__separator').length).toBe(1);
  });

  it('traduce aria-label y botón de colapso según el idioma', () => {
    document.documentElement.setAttribute('lang', 'es');
    const ol = mount(longPath);
    expect(ol.parentElement.getAttribute('aria-label')).toBe('ruta de navegación');
    expect(ol.querySelector('.mtx-breadcrumbs__collapse-button').getAttribute('aria-label')).toBe('Mostrar ruta');
  });

  it('CSS: tokens, sin font-size en material-icons y reduced motion', () => {
    const css = readFileSync('src/components/breadcrumbs/breadcrumbs.css', 'utf8');
    expect(css).not.toMatch(/\.material-icons[^{]*\{[^}]*font-size/);
    expect(css).toMatch(/prefers-reduced-motion/);
    expect(css).toMatch(/var\(--mtx-breadcrumbs-collapse-bg\)/);
    const tokens = readFileSync('src/styles/tokens.css', 'utf8');
    expect(tokens.match(/--mtx-breadcrumbs-collapse-bg:/g)).toHaveLength(2);
  });

  it('CSS: el icono sale del flujo para que el subrayado de hover no lo alcance', () => {
    const css = readFileSync('src/components/breadcrumbs/breadcrumbs.css', 'utf8');
    const item = css.match(/\.mtx-breadcrumbs \.mtx-breadcrumbs__item--with-icon \{([^}]*)\}/)[1];
    expect(item).toMatch(/position:\s*relative/);
    expect(item).toMatch(/padding-inline-start:\s*calc\(24px/);
    expect(item).not.toMatch(/\bgap:/);
    const icon = css.match(/\.mtx-breadcrumbs__item--with-icon > \.mtx-breadcrumbs__icon \{([^}]*)\}/)[1];
    expect(icon).toMatch(/position:\s*absolute/);
    expect(icon).toMatch(/inset-inline-start:\s*0/);
    expect(icon).toMatch(/translateY\(-50%\)/);
    expect(icon).not.toMatch(/font-size/);
  });
});
