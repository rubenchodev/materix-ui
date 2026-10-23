import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/card/card.js';

describe('Card', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = document.createElement('div');
    el.className = 'mtx-card';
    el.setAttribute('data-mtx', 'card');
    document.body.appendChild(el);
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('expone focus()', () => {
    const el = document.createElement('div');
    el.className = 'mtx-card';
    el.setAttribute('data-mtx', 'card');
    el.tabIndex = 0;
    document.body.appendChild(el);
    initAll();
    getInstance(el).focus();
    expect(document.activeElement).toBe(el);
  });

  it('auto-scaffolds header con estructura en columna para título y subheader', () => {
    const el = document.createElement('div');
    el.setAttribute('data-mtx', 'card');
    el.setAttribute('data-avatar', 'R');
    el.setAttribute('data-title', 'Paella Valenciana');
    el.setAttribute('data-subheader', 'Receta Tradicional');
    document.body.appendChild(el);
    initAll();

    const header = el.querySelector('.mtx-card__header');
    expect(header).not.toBeNull();

    const avatar = header.querySelector('.mtx-card__header-avatar');
    expect(avatar).not.toBeNull();
    expect(avatar.textContent).toBe('R');

    const content = header.querySelector('.mtx-card__header-content');
    expect(content).not.toBeNull();

    const title = content.querySelector('.mtx-card__title');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Paella Valenciana');

    const subheader = content.querySelector('.mtx-card__subheader');
    expect(subheader).not.toBeNull();
    expect(subheader.textContent).toBe('Receta Tradicional');
  });

  it('auto-scaffolds media cuando se especifica data-image', () => {
    const el = document.createElement('div');
    el.setAttribute('data-mtx', 'card');
    el.setAttribute('data-image', 'https://example.com/paella.jpg');
    el.setAttribute('data-media-height', '200');
    document.body.appendChild(el);
    initAll();

    const media = el.querySelector('.mtx-card__media');
    expect(media).not.toBeNull();
    expect(media.style.backgroundImage).toContain('https://example.com/paella.jpg');
    expect(media.style.height).toBe('200px');
  });

  it('gestiona CardActionArea y estados disabled', () => {
    const card = document.createElement('div');
    card.setAttribute('data-mtx', 'card');
    const area = document.createElement('button');
    area.setAttribute('data-mtx', 'card-action-area');
    area.textContent = 'Acción';
    card.appendChild(area);
    document.body.appendChild(card);
    initAll();

    const instance = getInstance(area);
    expect(instance).toBeDefined();
    expect(instance.disabled).toBe(false);

    instance.disable();
    expect(instance.disabled).toBe(true);
    expect(area.getAttribute('aria-disabled')).toBe('true');

    instance.enable();
    expect(instance.disabled).toBe(false);
  });
});
describe('Card — clases tipográficas en el contenido (plantillas)', () => {
  const css = readFileSync('src/components/card/card.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('los h1–h6 y p de .mtx-card__content usan :where (especificidad 0) para que mtx-typography--* gane', () => {
    // Selectores de nivel superior (comas fuera de paréntesis): ningún h/p sin :where.
    const topLevel = [...css.matchAll(/([^{}]+)\{/g)].flatMap((m) => {
      const out = [];
      let depth = 0;
      let cur = '';
      for (const ch of m[1]) {
        if (ch === '(') depth += 1;
        if (ch === ')') depth -= 1;
        if (ch === ',' && depth === 0) {
          out.push(cur.trim());
          cur = '';
        } else cur += ch;
      }
      out.push(cur.trim());
      return out;
    });
    expect(topLevel.filter((sel) => /^\.mtx-card__content > (h[1-6]|p)\b/.test(sel))).toEqual([]);
    expect(css).toMatch(/:where\(\.mtx-card__content > h1, [^)]*\.mtx-card__content > h6\)/);
    expect(css).toMatch(/:where\(\.mtx-card__content > p\)/);
  });

  it('.mtx-card__title dentro del contenido mantiene la especificidad que vence a .mtx-card__title base', () => {
    expect(css).toMatch(/\.mtx-card__content > \.mtx-card__title \{[^}]*font-size: 1\.25rem/);
  });
});

describe('CardActions — alineación', () => {
  const css = readFileSync('src/components/card/card.css', 'utf8');

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('las acciones van a la derecha por defecto (desviación consciente de MUI)', () => {
    expect(css).toMatch(/\.mtx-card-actions \{[^}]*justify-content: flex-end/);
    document.body.innerHTML = '<div data-mtx="card"><div data-mtx="card-actions"><button>A</button></div></div>';
    initAll();
    const el = document.querySelector('[data-mtx="card-actions"]');
    expect(getInstance(el).align).toBe('end');
    expect([...el.classList].filter((c) => /--(start|center|between)$/.test(c))).toEqual([]);
  });

  it('data-align="start" recupera la alineación MUI y las demás alineaciones añaden su clase', () => {
    document.body.innerHTML = `
      <div data-mtx="card">
        <div data-mtx="card-actions" data-align="start"><button>A</button></div>
        <div class="mtx-card__actions" data-mtx="card-actions" data-align="between"><button>B</button></div>
      </div>`;
    initAll();
    const [a, b] = document.querySelectorAll('.mtx-card__actions');
    expect(a.classList.contains('mtx-card__actions--start')).toBe(true);
    expect(b.classList.contains('mtx-card__actions--between')).toBe(true);
    expect(css).toMatch(/\.mtx-card__actions--start,[^{]*\{ justify-content: flex-start; \}/);
  });

  it('data-actions-align de la tarjeta se propaga a sus acciones (también BEM sin data-mtx)', () => {
    document.body.innerHTML = `
      <div data-mtx="card" data-actions-align="center">
        <div class="mtx-card__actions"><button>A</button></div>
        <div data-mtx="card-actions" data-align="end"><button>B</button></div>
      </div>`;
    initAll();
    const [a, b] = document.querySelectorAll('.mtx-card__actions');
    expect(a.classList.contains('mtx-card__actions--center')).toBe(true);
    expect(b.classList.contains('mtx-card__actions--center')).toBe(false);
  });

  it('el setter align valida el valor y es idempotente', () => {
    document.body.innerHTML = '<div data-mtx="card-actions" data-disable-spacing><button>A</button></div>';
    initAll();
    initAll();
    const el = document.querySelector('[data-mtx="card-actions"]');
    const inst = getInstance(el);
    expect(el.classList.contains('mtx-card__actions--disable-spacing')).toBe(true);
    inst.align = 'center';
    expect(el.classList.contains('mtx-card__actions--center')).toBe(true);
    expect(() => { inst.align = 'right'; }).toThrow(RangeError);
  });
});
