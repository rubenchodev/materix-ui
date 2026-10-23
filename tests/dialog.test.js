import { readFileSync } from 'node:fs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/dialog/dialog.js';
import '../src/components/text-field/text-field.js';

function createDialog() {
  const root = document.createElement('div');
  root.className = 'mtx-dialog';
  root.setAttribute('data-mtx', 'dialog');
  root.setAttribute('aria-labelledby', 't');
  root.innerHTML =
    '<div class="mtx-dialog__backdrop" data-mtx-dialog-close></div>' +
    '<div class="mtx-dialog__paper" role="dialog" aria-modal="true">' +
    '<h2 class="mtx-dialog__title" id="t">Título</h2>' +
    '<div class="mtx-dialog__content">Contenido</div>' +
    '<div class="mtx-dialog__actions">' +
    '<button type="button" data-mtx-dialog-close>Cancelar</button>' +
    '<button type="button" data-mtx-dialog-close>Aceptar</button>' +
    '</div></div>';
  document.body.appendChild(root);
  return root;
}

describe('Dialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = createDialog();
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('open() muestra el diálogo y close() lo oculta', () => {
    const el = createDialog();
    initAll();
    const dlg = getInstance(el);
    expect(dlg.isOpen).toBe(false);
    dlg.open();
    expect(dlg.isOpen).toBe(true);
    expect(el.classList.contains('mtx-dialog--open')).toBe(true);
    dlg.close();
    expect(dlg.isOpen).toBe(false);
  });

  it('emite eventos mtx:dialog:open y close', () => {
    const el = createDialog();
    initAll();
    const dlg = getInstance(el);
    const opened = vi.fn();
    const closed = vi.fn();
    el.addEventListener('mtx:dialog:open', opened);
    el.addEventListener('mtx:dialog:close', closed);
    dlg.open();
    dlg.close();
    expect(opened).toHaveBeenCalledTimes(1);
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('Escape cierra el diálogo', () => {
    const el = createDialog();
    initAll();
    const dlg = getInstance(el);
    dlg.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(dlg.isOpen).toBe(false);
  });

  it('clic en elemento con data-mtx-dialog-close cierra', () => {
    const el = createDialog();
    initAll();
    const dlg = getInstance(el);
    dlg.open();
    const closeBtn = el.querySelector('[data-mtx-dialog-close]');
    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(dlg.isOpen).toBe(false);
  });
});

describe('Dialog — A11 (sintaxis simplificada y ARIA)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('data-title genera un título con id y aria-labelledby en el panel', () => {
    document.body.innerHTML = '<div data-mtx="dialog" id="dlg-a" data-title="Delete file?"><p>Body</p></div>';
    initAll();
    const paper = document.querySelector('#dlg-a .mtx-dialog__paper');
    const title = paper.querySelector('.mtx-dialog__title');
    expect(title.id).toBe('dlg-a-title');
    expect(paper.getAttribute('aria-labelledby')).toBe('dlg-a-title');
  });

  it('genera ids únicos cuando el contenedor no tiene id', () => {
    document.body.innerHTML = '<div data-mtx="dialog" data-title="A"></div><div data-mtx="dialog" data-title="B"></div>';
    initAll();
    const ids = Array.from(document.querySelectorAll('.mtx-dialog__title')).map((el) => el.id);
    expect(ids[0]).toBeTruthy();
    expect(ids[0]).not.toBe(ids[1]);
  });

  it('respeta aria-label del autor', () => {
    document.body.innerHTML = '<div data-mtx="dialog" data-title="X" aria-label="Custom"></div>';
    initAll();
    const paper = document.querySelector('.mtx-dialog__paper');
    expect(paper.getAttribute('aria-label')).toBe('Custom');
    expect(paper.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('las acciones no se mueven al contenido aunque no exista .mtx-dialog__content', () => {
    document.body.innerHTML = '<div data-mtx="dialog" data-title="T"><p>Text</p><div class="mtx-dialog__actions"><button data-mtx-dialog-close>OK</button></div></div>';
    initAll();
    const paper = document.querySelector('.mtx-dialog__paper');
    const kids = Array.from(paper.children).map((el) => el.className);
    expect(kids).toEqual(['mtx-dialog__title', 'mtx-dialog__content', 'mtx-dialog__actions']);
    expect(paper.querySelector('.mtx-dialog__content p').textContent).toBe('Text');
    expect(paper.querySelector('.mtx-dialog__content .mtx-dialog__actions')).toBeNull();
  });

  it('data-description genera .mtx-dialog__content-text enlazado con aria-describedby', () => {
    document.body.innerHTML = '<div data-mtx="dialog" id="dlg-d" data-title="T" data-description="Cannot be undone."></div>';
    initAll();
    const paper = document.querySelector('.mtx-dialog__paper');
    const text = paper.querySelector('.mtx-dialog__content-text');
    expect(text.textContent).toBe('Cannot be undone.');
    expect(paper.getAttribute('aria-describedby')).toBe(text.id);
  });

  it('enlaza un .mtx-dialog__title BEM sin aria-labelledby', () => {
    document.body.innerHTML = '<div data-mtx="dialog" id="dlg-b"><div class="mtx-dialog__paper"><h2 class="mtx-dialog__title">BEM</h2><div class="mtx-dialog__content"><p class="mtx-dialog__content-text">Desc</p></div></div></div>';
    initAll();
    const paper = document.querySelector('.mtx-dialog__paper');
    expect(paper.getAttribute('aria-labelledby')).toBe('dlg-b-title');
    expect(paper.getAttribute('aria-describedby')).toBe('dlg-b-description');
  });

  it('data-scroll="body" desplaza el contenedor', () => {
    document.body.innerHTML = '<div data-mtx="dialog" data-scroll="body" data-title="T"></div>';
    initAll();
    expect(document.querySelector('.mtx-dialog').classList.contains('mtx-dialog--scroll-body')).toBe(true);
    const css = readFileSync('src/components/dialog/dialog.css', 'utf8');
    expect(css).toMatch(/\.mtx-dialog--scroll-body\.mtx-dialog--open\s*\{[^}]*overflow-y:\s*auto/);
  });
});

describe('Dialog — data-dialog-autofocus con TextField single-element', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('enfoca el <input> aunque el atributo se copie al wrapper generado', () => {
    document.body.innerHTML =
      '<div data-mtx="dialog" id="dlg" data-title="Renombrar">' +
      '<button type="button" id="first">Primero</button>' +
      '<input data-mtx="text-field" data-label="Nombre" id="name" data-dialog-autofocus>' +
      '</div>';
    initAll();
    const input = document.getElementById('name');
    expect(input.closest('.mtx-text-field')).not.toBe(input);
    getInstance(document.getElementById('dlg')).open();
    expect(document.activeElement).toBe(input);
  });

  it('un contenedor no enfocable marcado delega en su primer control', () => {
    const el = createDialog();
    el.querySelector('.mtx-dialog__content').innerHTML =
      '<div data-dialog-autofocus><span>x</span><button type="button" id="inner">Ok</button></div>';
    initAll();
    getInstance(el).open();
    expect(document.activeElement.id).toBe('inner');
  });
});

describe('DialogActions — alineación', () => {
  const css = readFileSync('src/components/dialog/dialog.css', 'utf8');

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('por defecto las acciones quedan a la derecha (justify-content: flex-end)', () => {
    expect(css).toMatch(/\.mtx-dialog__actions \{[^}]*justify-content: flex-end/);
    const el = createDialog();
    initAll();
    const actions = el.querySelector('.mtx-dialog__actions');
    ['start', 'center', 'between'].forEach((v) => {
      expect(actions.classList.contains(`mtx-dialog__actions--${v}`)).toBe(false);
    });
  });

  it('data-align en las acciones añade la clase modificadora', () => {
    const el = createDialog();
    el.querySelector('.mtx-dialog__actions').setAttribute('data-align', 'between');
    initAll();
    expect(el.querySelector('.mtx-dialog__actions').classList.contains('mtx-dialog__actions--between')).toBe(true);
    expect(css).toMatch(/\.mtx-dialog__actions--between,[^{]*\{ justify-content: space-between; \}/);
    expect(css).toMatch(/\.mtx-dialog__actions--start,[^{]*\{ justify-content: flex-start; \}/);
    expect(css).toMatch(/\.mtx-dialog__actions--center,[^{]*\{ justify-content: center; \}/);
  });

  it('data-actions-align del diálogo se propaga a las acciones generadas sin pisar su data-align', () => {
    document.body.innerHTML = `
      <div data-mtx="dialog" id="d" data-title="T" data-actions-align="start">
        <p>Texto</p>
        <div class="mtx-dialog__actions"><button type="button">A</button></div>
        <div data-mtx="dialog-actions" data-align="center"><button type="button">B</button></div>
      </div>`;
    initAll();
    const [first, second] = document.querySelectorAll('.mtx-dialog__paper > .mtx-dialog__actions');
    expect(first.classList.contains('mtx-dialog__actions--start')).toBe(true);
    expect(second.classList.contains('mtx-dialog__actions--center')).toBe(true);
    expect(second.classList.contains('mtx-dialog__actions--start')).toBe(false);
    // data-mtx="dialog-actions" se coloca tras el contenido, fuera de él.
    expect(document.querySelector('.mtx-dialog__content .mtx-dialog__actions')).toBeNull();
  });

  it('DialogActions expone align y data-disable-spacing', () => {
    document.body.innerHTML = '<div data-mtx="dialog-actions" data-disable-spacing><button>A</button></div>';
    initAll();
    const el = document.querySelector('[data-mtx="dialog-actions"]');
    const inst = getInstance(el);
    expect(el.classList.contains('mtx-dialog__actions')).toBe(true);
    expect(el.classList.contains('mtx-dialog__actions--disable-spacing')).toBe(true);
    expect(inst.align).toBe('end');
    inst.align = 'start';
    expect(el.classList.contains('mtx-dialog__actions--start')).toBe(true);
    inst.align = 'end';
    expect(el.classList.contains('mtx-dialog__actions--start')).toBe(false);
    expect(() => { inst.align = 'left'; }).toThrow(RangeError);
  });

  it('es idempotente', () => {
    const el = createDialog();
    el.querySelector('.mtx-dialog__actions').setAttribute('data-align', 'center');
    initAll();
    initAll();
    const actions = el.querySelector('.mtx-dialog__actions');
    expect([...actions.classList].filter((c) => c.startsWith('mtx-dialog__actions--'))).toEqual(['mtx-dialog__actions--center']);
  });
});
