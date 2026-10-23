import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Accordion } from '../src/components/accordion/accordion.js';
import '../src/components/accordion/accordion.js';

const mount = (html) => {
  document.body.innerHTML = html;
  initAll();
};

describe('Accordion', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('auto-construye cabecera h3, botón y región desde un div con data-summary', () => {
    mount('<div data-mtx="accordion" data-summary="Pregunta">Respuesta <a href="#">enlace</a></div>');
    const el = document.querySelector('[data-mtx="accordion"]');
    const heading = el.querySelector(':scope > h3.mtx-accordion__heading');
    const summary = heading.querySelector('button.mtx-accordion__summary');
    const region = el.querySelector(':scope > .mtx-accordion__region');
    expect(el.classList.contains('mtx-accordion')).toBe(true);
    expect(summary.type).toBe('button');
    expect(summary.querySelector('.mtx-accordion__summary-content').textContent).toBe('Pregunta');
    expect(summary.querySelector('.mtx-accordion__expand-icon .material-icons').textContent).toBe('expand_more');
    expect(summary.getAttribute('aria-expanded')).toBe('false');
    expect(summary.getAttribute('aria-controls')).toBe(region.id);
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-labelledby')).toBe(summary.id);
    expect(region.hasAttribute('hidden')).toBe(true);
    expect(region.querySelector('.mtx-accordion__details').textContent).toContain('Respuesta');
  });

  it('respeta data-expanded, data-heading-level y data-expand-icon', () => {
    mount('<div data-mtx="accordion" data-summary="A" data-expanded data-heading-level="2" data-expand-icon="add">x</div>');
    const el = document.querySelector('.mtx-accordion');
    expect(el.querySelector(':scope > h2.mtx-accordion__heading')).not.toBeNull();
    expect(el.classList.contains('mtx-accordion--expanded')).toBe(true);
    expect(el.querySelector('.mtx-accordion__summary').getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('.mtx-accordion__region').hasAttribute('hidden')).toBe(false);
    expect(el.querySelector('.mtx-accordion__expand-icon').textContent).toBe('add');
  });

  it('data-expand-icon="false" omite el icono y data-heading-level="none" omite la cabecera', () => {
    mount('<div data-mtx="accordion" data-summary="A" data-expand-icon="false" data-heading-level="none">x</div>');
    const el = document.querySelector('.mtx-accordion');
    expect(el.querySelector('.mtx-accordion__expand-icon')).toBeNull();
    expect(el.querySelector('.mtx-accordion__heading')).toBeNull();
    expect(el.querySelector(':scope > .mtx-accordion__summary')).not.toBeNull();
  });

  it('alterna con clic, emite mtx:accordion:change y oculta la región al terminar la transición', () => {
    mount('<div data-mtx="accordion" data-summary="A" data-duration="300">x</div>');
    const el = document.querySelector('.mtx-accordion');
    const summary = el.querySelector('.mtx-accordion__summary');
    const region = el.querySelector('.mtx-accordion__region');
    const events = [];
    el.addEventListener('mtx:accordion:change', (e) => events.push(e.detail.expanded));

    summary.click();
    expect(summary.getAttribute('aria-expanded')).toBe('true');
    expect(region.hasAttribute('hidden')).toBe(false);

    summary.click();
    expect(summary.getAttribute('aria-expanded')).toBe('false');
    expect(region.hasAttribute('hidden')).toBe(false); // aún animando
    vi.runAllTimers();
    expect(region.hasAttribute('hidden')).toBe(true);
    expect(region.style.height).toBe('');
    expect(events).toEqual([true, false]);
  });

  it('expone expand(), collapse(), toggle() y el getter/setter expanded', () => {
    mount('<div data-mtx="accordion" data-summary="A" data-duration="0">x</div>');
    const el = document.querySelector('.mtx-accordion');
    const acc = getInstance(el);
    expect(acc).toBeInstanceOf(Accordion);
    acc.expand();
    expect(acc.expanded).toBe(true);
    acc.collapse();
    expect(acc.expanded).toBe(false);
    expect(el.querySelector('.mtx-accordion__region').hasAttribute('hidden')).toBe(true);
    acc.toggle();
    expect(acc.expanded).toBe(true);
    acc.expanded = false;
    expect(acc.expanded).toBe(false);
  });

  it('no alterna cuando está deshabilitado y disable()/enable() actualizan el botón', () => {
    mount('<div data-mtx="accordion" data-summary="A" data-disabled>x</div>');
    const el = document.querySelector('.mtx-accordion');
    const acc = getInstance(el);
    const summary = el.querySelector('.mtx-accordion__summary');
    expect(el.classList.contains('mtx-accordion--disabled')).toBe(true);
    expect(summary.disabled).toBe(true);
    summary.click();
    expect(acc.expanded).toBe(false);
    acc.enable();
    expect(summary.disabled).toBe(false);
    expect(acc.disabled).toBe(false);
  });

  it('mejora <details><summary> conservando el elemento y sincronizando open', () => {
    mount('<details data-mtx="accordion" data-duration="0"><summary>¿Pregunta?</summary><p>Respuesta</p></details>');
    const el = document.querySelector('details');
    const summary = el.querySelector(':scope > summary');
    const acc = getInstance(el);
    expect(summary.classList.contains('mtx-accordion__summary')).toBe(true);
    expect(summary.querySelector('.mtx-accordion__summary-content').textContent).toBe('¿Pregunta?');
    expect(el.querySelector('.mtx-accordion__region .mtx-accordion__details p').textContent).toBe('Respuesta');
    expect(el.open).toBe(false);
    summary.click();
    expect(acc.expanded).toBe(true);
    expect(el.open).toBe(true);
    acc.collapse();
    expect(el.open).toBe(false);
  });

  it('respeta details[open] como estado inicial y deshabilita summary con aria-disabled', () => {
    mount('<details data-mtx="accordion" open data-disabled><summary>Q</summary>A</details>');
    const el = document.querySelector('details');
    const summary = el.querySelector('summary');
    expect(getInstance(el).expanded).toBe(true);
    expect(summary.getAttribute('aria-disabled')).toBe('true');
    expect(summary.getAttribute('tabindex')).toBe('-1');
  });

  it('se vincula a la estructura BEM completa sin duplicar nodos', () => {
    mount(`
      <div class="mtx-accordion" data-mtx="accordion">
        <h3 class="mtx-accordion__heading">
          <button class="mtx-accordion__summary" id="q1" aria-expanded="true">
            <span class="mtx-accordion__summary-content">Q</span>
            <span class="mtx-accordion__expand-icon"><span class="material-icons">expand_more</span></span>
          </button>
        </h3>
        <div class="mtx-accordion__region" id="r1">
          <div class="mtx-accordion__details">A</div>
          <div class="mtx-accordion-actions"><button>OK</button></div>
        </div>
      </div>`);
    const el = document.querySelector('.mtx-accordion');
    expect(el.querySelectorAll('.mtx-accordion__summary').length).toBe(1);
    expect(el.querySelectorAll('.mtx-accordion__expand-icon').length).toBe(1);
    expect(el.querySelectorAll('.mtx-accordion__region').length).toBe(1);
    expect(getInstance(el).expanded).toBe(true);
    expect(document.getElementById('q1').getAttribute('aria-controls')).toBe('r1');
  });

  it('mueve AccordionActions dentro de la región, después de los detalles', () => {
    mount('<div data-mtx="accordion" data-summary="A">Texto<div data-mtx="accordion-actions"><button>Cancelar</button></div></div>');
    const region = document.querySelector('.mtx-accordion__region');
    expect(region.children[0].classList.contains('mtx-accordion__details')).toBe(true);
    expect(region.children[1].classList.contains('mtx-accordion-actions')).toBe(true);
  });

  it('aplica variantes y opciones heredadas del grupo', () => {
    mount(`
      <div data-mtx="accordion-group" data-variant="outlined" data-disable-gutters data-square>
        <div data-mtx="accordion" data-summary="A">a</div>
        <div data-mtx="accordion" data-summary="B" data-variant="standard">b</div>
      </div>`);
    const [a, b] = document.querySelectorAll('[data-mtx="accordion"]');
    expect(a.classList.contains('mtx-accordion--outlined')).toBe(true);
    expect(a.classList.contains('mtx-accordion--disable-gutters')).toBe(true);
    expect(a.classList.contains('mtx-accordion--square')).toBe(true);
    expect(b.classList.contains('mtx-accordion--outlined')).toBe(false);
  });

  it('el grupo exclusivo mantiene un solo panel abierto', () => {
    mount(`
      <div data-mtx="accordion-group">
        <div data-mtx="accordion" data-summary="A" data-expanded>a</div>
        <div data-mtx="accordion" data-summary="B" data-expanded>b</div>
        <div data-mtx="accordion" data-summary="C">c</div>
      </div>`);
    const items = Array.from(document.querySelectorAll('[data-mtx="accordion"]')).map(getInstance);
    expect(items.map((i) => i.expanded)).toEqual([true, false, false]);
    items[2].summary.click();
    expect(items.map((i) => i.expanded)).toEqual([false, false, true]);
  });

  it('data-exclusive="false" permite varios paneles y expandAll()/collapseAll()', () => {
    mount(`
      <div data-mtx="accordion-group" data-exclusive="false">
        <div data-mtx="accordion" data-summary="A" data-expanded>a</div>
        <div data-mtx="accordion" data-summary="B" data-expanded>b</div>
      </div>`);
    const group = getInstance(document.querySelector('.mtx-accordion-group'));
    expect(group.accordions.map((i) => i.expanded)).toEqual([true, true]);
    group.collapseAll();
    expect(group.accordions.every((i) => !i.expanded)).toBe(true);
    group.expandAll();
    expect(group.accordions.every((i) => i.expanded)).toBe(true);
  });

  it('las flechas, Home y End mueven el foco entre resúmenes del grupo saltando deshabilitados', () => {
    mount(`
      <div data-mtx="accordion-group">
        <div data-mtx="accordion" data-summary="A">a</div>
        <div data-mtx="accordion" data-summary="B" data-disabled>b</div>
        <div data-mtx="accordion" data-summary="C">c</div>
      </div>`);
    const summaries = document.querySelectorAll('.mtx-accordion__summary');
    summaries[0].focus();
    summaries[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(summaries[2]);
    summaries[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(summaries[0]);
    summaries[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).toBe(summaries[2]);
    summaries[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).toBe(summaries[0]);
  });

  it('un acordeón anidado no pertenece al grupo exterior', () => {
    mount(`
      <div data-mtx="accordion-group">
        <div data-mtx="accordion" data-summary="A" data-expanded>
          <div data-mtx="accordion" id="inner" data-summary="Interno">i</div>
        </div>
        <div data-mtx="accordion" data-summary="B">b</div>
      </div>`);
    const outerA = getInstance(document.querySelector('.mtx-accordion-group > .mtx-accordion'));
    const inner = getInstance(document.getElementById('inner'));
    inner.expand();
    expect(outerA.expanded).toBe(true);
    expect(getInstance(document.querySelector('.mtx-accordion-group')).accordions.length).toBe(2);
  });

  it('es idempotente', () => {
    mount('<div data-mtx="accordion" data-summary="A">x</div>');
    initAll();
    initAll();
    expect(document.querySelectorAll('.mtx-accordion__summary').length).toBe(1);
  });
});

describe('Accordion — resumen destacado', () => {
  const css = readFileSync('src/components/accordion/accordion.css', 'utf8');
  const tokens = readFileSync('src/styles/tokens.css', 'utf8');

  it('el resumen usa peso medio y fondo/divisor propios al expandirse mediante variables', () => {
    expect(css).toMatch(/font-weight: var\(--mtx-accordion-summary-font-weight, 500\)/);
    expect(css).toMatch(/\[aria-expanded='true'\] \{[^}]*background-color: var\(--mtx-accordion-summary-expanded-bg/);
    expect(css).toMatch(/\[aria-expanded='true'\] \{[^}]*box-shadow: inset 0 -1px 0 var\(--mtx-accordion-summary-expanded-divider/);
    expect(tokens).toMatch(/--mtx-accordion-summary-font-weight: 500;/);
    expect(tokens.match(/--mtx-accordion-summary-expanded-bg: var\(--mtx-color-action-selected\);/g)).toHaveLength(2);
  });

  it('el foco visible prevalece sobre el fondo de expandido', () => {
    expect(css).toMatch(/\.mtx-accordion \.mtx-accordion__summary:focus-visible \{[^}]*action-focus/);
  });

  it('data-summary-style="plain" (propio o del grupo) aplica el aspecto MUI plano', () => {
    document.body.innerHTML = `
      <div data-mtx="accordion-group" data-summary-style="plain">
        <div data-mtx="accordion" data-summary="A">a</div>
      </div>
      <div data-mtx="accordion" data-summary="B" data-summary-style="plain">b</div>
      <div data-mtx="accordion" data-summary="C">c</div>`;
    initAll();
    const [a, b, c] = document.querySelectorAll('.mtx-accordion');
    expect(a.classList.contains('mtx-accordion--plain-summary')).toBe(true);
    expect(b.classList.contains('mtx-accordion--plain-summary')).toBe(true);
    expect(c.classList.contains('mtx-accordion--plain-summary')).toBe(false);
    expect(css).toMatch(/\.mtx-accordion--plain-summary \{[^}]*--mtx-accordion-summary-font-weight: 400;[^}]*--mtx-accordion-summary-expanded-bg: transparent;/);
  });
});

describe('Accordion — destroy durante la animación', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fija el estado final (hidden y sin estilos en línea) si se destruye a mitad del colapso', () => {
    mount('<div data-mtx="accordion" data-summary="A" data-expanded data-duration="300">x</div>');
    const el = document.querySelector('.mtx-accordion');
    const region = el.querySelector('.mtx-accordion__region');
    el.querySelector('.mtx-accordion__summary').click();
    expect(region.hasAttribute('hidden')).toBe(false);
    getInstance(el).destroy();
    expect(region.hasAttribute('hidden')).toBe(true);
    expect(region.style.height).toBe('');
    expect(region.style.overflow).toBe('');
    expect(vi.getTimerCount()).toBe(0);
  });
});
