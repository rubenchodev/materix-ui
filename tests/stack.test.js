import { describe, it, expect, beforeEach } from 'vitest';
import { Stack } from '../src/components/stack/stack.js';
import { initAll, getInstance } from '../src/core/registry.js';

describe('Stack', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa desde un solo elemento con dirección y espaciado responsive', () => {
    document.body.innerHTML = `
      <div id="s" data-mtx="stack" data-direction="column" data-direction-sm="row"
           data-spacing="1" data-spacing-md="3" data-align="center" data-justify="space-between" data-wrap>
        <span>A</span><span>B</span>
      </div>`;
    initAll();
    const el = document.getElementById('s');
    expect(getInstance(el)).toBeInstanceOf(Stack);
    ['mtx-stack', 'mtx-stack--column', 'mtx-stack--sm-row', 'mtx-stack--spacing-1', 'mtx-stack--md-spacing-3',
      'mtx-stack--align-center', 'mtx-stack--justify-between', 'mtx-stack--wrap']
      .forEach((c) => expect(el.classList.contains(c), c).toBe(true));
  });

  it('normaliza espaciados decimales (1.5 → 1_5)', () => {
    const el = document.createElement('div');
    el.setAttribute('data-spacing', '1.5');
    new Stack(el);
    expect(el.classList.contains('mtx-stack--spacing-1_5')).toBe(true);
  });

  it('valores inválidos avisan sin lanzar durante la inicialización', () => {
    document.body.innerHTML = '<div id="s" data-mtx="stack" data-spacing="7" data-direction="diagonal"></div>';
    expect(() => initAll()).not.toThrow();
    const el = document.getElementById('s');
    expect(Array.from(el.classList).some((c) => c.includes('spacing'))).toBe(false);
  });

  it('setDirection y setSpacing sustituyen solo su breakpoint', () => {
    const el = document.createElement('div');
    const s = new Stack(el);
    s.setDirection('row');
    s.setDirection('row', 'md');
    s.setDirection('column-reverse');
    s.setSpacing(2);
    s.setSpacing(4, 'md');
    s.setSpacing(1);
    expect(el.classList.contains('mtx-stack--row')).toBe(false);
    expect(el.classList.contains('mtx-stack--column-reverse')).toBe(true);
    expect(el.classList.contains('mtx-stack--md-row')).toBe(true);
    expect(el.classList.contains('mtx-stack--spacing-2')).toBe(false);
    expect(el.classList.contains('mtx-stack--spacing-1')).toBe(true);
    expect(el.classList.contains('mtx-stack--md-spacing-4')).toBe(true);
    expect(() => s.setDirection('diagonal')).toThrow(RangeError);
    expect(() => s.setSpacing(7)).toThrow(RangeError);
  });

  it('data-divider inserta divisores decorativos entre hijos de forma idempotente', () => {
    document.body.innerHTML = '<div id="s" data-mtx="stack" data-divider><a>1</a><a>2</a><a>3</a></div>';
    initAll();
    initAll();
    const el = document.getElementById('s');
    const dividers = el.querySelectorAll(':scope > .mtx-stack__divider');
    expect(dividers.length).toBe(2);
    dividers.forEach((d) => {
      expect(d.tagName).toBe('HR');
      expect(d.classList.contains('mtx-divider')).toBe(true);
      expect(d.getAttribute('aria-hidden')).toBe('true');
    });
    expect(el.children[1].classList.contains('mtx-stack__divider')).toBe(true);

    const s = getInstance(el);
    el.appendChild(document.createElement('a'));
    s.refresh();
    expect(el.querySelectorAll('.mtx-stack__divider').length).toBe(3);
    s.setDivider(false);
    expect(el.querySelectorAll('.mtx-stack__divider').length).toBe(0);
  });

  it('acepta el alias heredado col y conserva las clases BEM existentes', () => {
    document.body.innerHTML = '<div id="s" class="mtx-stack mtx-stack--row mtx-stack--spacing-2" data-mtx="stack"></div>';
    initAll();
    const el = document.getElementById('s');
    expect(el.className).toBe('mtx-stack mtx-stack--row mtx-stack--spacing-2');
    getInstance(el).setDirection('col');
    expect(el.classList.contains('mtx-stack--column')).toBe(true);
  });
});
