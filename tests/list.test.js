import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import {
  List, ListItem, ListItemButton, ListSubheader, ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction,
} from '../src/components/list/list.js';

function createList(attrs = {}) {
  const ul = document.createElement('ul');
  ul.className = 'mtx-list';
  ul.setAttribute('data-mtx', 'list');
  Object.entries(attrs).forEach(([k, v]) => ul.setAttribute(k, v));
  document.body.appendChild(ul);
  return ul;
}

describe('List components', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('List', () => {
    it('se inicializa con modificadores dense y disable-padding', () => {
      const ul = createList({ 'data-dense': '', 'data-disable-padding': '' });
      initAll();
      const list = getInstance(ul);
      expect(list).toBeInstanceOf(List);
      expect(ul.classList.contains('mtx-list--dense')).toBe(true);
      expect(ul.classList.contains('mtx-list--disable-padding')).toBe(true);
    });
  });

  describe('ListItem', () => {
    it('aplica las clases según data-disabled y data-divider', () => {
      const li = document.createElement('li');
      li.className = 'mtx-list-item';
      li.setAttribute('data-mtx', 'list-item');
      li.setAttribute('data-disabled', '');
      li.setAttribute('data-divider', '');
      document.body.appendChild(li);

      initAll();
      const item = getInstance(li);
      expect(item).toBeInstanceOf(ListItem);
      expect(li.classList.contains('mtx-list-item--disabled')).toBe(true);
      expect(li.classList.contains('mtx-list-item--divider')).toBe(true);
      expect(li.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('ListItemButton', () => {
    it('soporta seleccionados, deshabilitado y alternancia mediante getters/setters', () => {
      const button = document.createElement('button');
      button.className = 'mtx-list-item-button';
      button.setAttribute('data-mtx', 'list-item-button');
      button.setAttribute('data-selected', '');
      document.body.appendChild(button);

      initAll();
      const itemBtn = getInstance(button);
      expect(itemBtn).toBeInstanceOf(ListItemButton);
      expect(itemBtn.selected).toBe(true);

      itemBtn.selected = false;
      expect(itemBtn.selected).toBe(false);
      expect(button.classList.contains('mtx-list-item--selected')).toBe(false);

      itemBtn.disable();
      expect(itemBtn.disabled).toBe(true);
      expect(button.disabled).toBe(true);

      itemBtn.enable();
      expect(itemBtn.disabled).toBe(false);
      expect(button.disabled).toBe(false);
    });

    it('marca el item como seleccionado y deselecciona los demás al hacer click', () => {
      const ul = document.createElement('ul');
      ul.className = 'mtx-list';
      ul.innerHTML = `
        <li class="mtx-list-item-button mtx-list-item--selected" id="item-1">Item 1</li>
        <li class="mtx-list-item-button" id="item-2">Item 2</li>
        <li class="mtx-list-item-button" id="item-3" data-no-select>Item 3</li>
        <li class="mtx-list-item-button mtx-list-item--disabled" id="item-4">Item 4</li>
      `;
      document.body.appendChild(ul);

      const item1 = ul.querySelector('#item-1');
      const item2 = ul.querySelector('#item-2');
      const item3 = ul.querySelector('#item-3');
      const item4 = ul.querySelector('#item-4');

      expect(item1.classList.contains('mtx-list-item--selected')).toBe(true);
      expect(item2.classList.contains('mtx-list-item--selected')).toBe(false);

      // Clic en item 2: selecciona item 2 y deselecciona item 1
      item2.click();
      expect(item1.classList.contains('mtx-list-item--selected')).toBe(false);
      expect(item2.classList.contains('mtx-list-item--selected')).toBe(true);
      // <li> sin rol seleccionable: aria-current="true", nunca aria-selected (A6)
      expect(item2.getAttribute('aria-selected')).toBeNull();
      expect(item2.getAttribute('aria-current')).toBe('true');
      expect(item1.hasAttribute('aria-current')).toBe(false);

      // Clic en item 3 con data-no-select: no debe cambiar la selección
      item3.click();
      expect(item2.classList.contains('mtx-list-item--selected')).toBe(true);
      expect(item3.classList.contains('mtx-list-item--selected')).toBe(false);

      // Clic en item deshabilitado: no debe cambiar la selección
      item4.click();
      expect(item2.classList.contains('mtx-list-item--selected')).toBe(true);
      expect(item4.classList.contains('mtx-list-item--selected')).toBe(false);
    });
  });

  describe('ListSubheader', () => {
    it('aplica modificadores inset y sticky', () => {
      const div = document.createElement('div');
      div.className = 'mtx-list-subheader';
      div.setAttribute('data-mtx', 'list-subheader');
      div.setAttribute('data-inset', '');
      div.setAttribute('data-sticky', '');
      document.body.appendChild(div);

      initAll();
      const subheader = getInstance(div);
      expect(subheader).toBeInstanceOf(ListSubheader);
      expect(div.classList.contains('mtx-list-subheader--inset')).toBe(true);
      expect(div.classList.contains('mtx-list-subheader--sticky')).toBe(true);
    });
  });

  describe('Correcciones de plantillas', () => {
    it('ListSubheader, ListItemText, ListItemIcon, ListItemAvatar y SecondaryAction añaden su clase', () => {
      document.body.innerHTML = `
        <li id="sh" data-mtx="list-subheader">Grupo</li>
        <span id="tx" data-mtx="list-item-text" data-secondary="Detalle">Principal</span>
        <span id="ic" data-mtx="list-item-icon" data-icon="inbox"></span>
        <span id="av" data-mtx="list-item-avatar"></span>
        <span id="sa" data-mtx="list-item-secondary-action"></span>`;
      initAll();
      const byId = (id) => document.getElementById(id);
      expect(byId('sh').classList.contains('mtx-list-subheader')).toBe(true);
      expect(getInstance(byId('sh'))).toBeInstanceOf(ListSubheader);
      expect(byId('tx').classList.contains('mtx-list-item-text')).toBe(true);
      expect(getInstance(byId('tx'))).toBeInstanceOf(ListItemText);
      expect(byId('tx').querySelector('.mtx-list-item-text__primary').textContent).toBe('Principal');
      expect(byId('tx').querySelector('.mtx-list-item-text__secondary').textContent).toBe('Detalle');
      expect(byId('ic').classList.contains('mtx-list-item-icon')).toBe(true);
      expect(getInstance(byId('ic'))).toBeInstanceOf(ListItemIcon);
      expect(byId('ic').querySelector('.material-icons').textContent).toBe('inbox');
      expect(getInstance(byId('av'))).toBeInstanceOf(ListItemAvatar);
      expect(byId('av').classList.contains('mtx-list-item-avatar')).toBe(true);
      expect(getInstance(byId('sa'))).toBeInstanceOf(ListItemSecondaryAction);
      expect(byId('sa').classList.contains('mtx-list-item-secondary-action')).toBe(true);
    });

    it('data-secondary no borra acciones, controles ni componentes hijos', () => {
      document.body.innerHTML = `
        <ul data-mtx="list"><li id="row" data-mtx="list-item" data-icon="description" data-secondary="2,4 MB">
          Informe <strong>anual</strong>.pdf
          <button id="del" data-mtx="icon-button" data-icon="delete" aria-label="Eliminar"></button>
          <div class="mtx-list-item-secondary-action"><input id="chk" type="checkbox" aria-label="Marcar"></div>
        </li></ul>`;
      initAll();
      const row = document.getElementById('row');
      const children = Array.from(row.children).map((el) => el.className.split(' ')[0] || el.tagName);
      expect(children[0]).toBe('mtx-list-item-icon');
      expect(children[1]).toBe('mtx-list-item-text');
      expect(row.querySelector('#del')).not.toBeNull();
      expect(row.querySelector('#chk')).not.toBeNull();
      expect(row.querySelector('.mtx-list-item-text__primary').textContent.trim()).toBe('Informe anual.pdf');
      expect(row.querySelector('.mtx-list-item-text__primary strong')).not.toBeNull();
      expect(row.querySelector('.mtx-list-item-text__secondary').textContent).toBe('2,4 MB');
      // Idempotente
      initAll();
      expect(row.querySelectorAll('.mtx-list-item-text').length).toBe(1);
    });

    it('envuelve avatares sueltos en mtx-list-item-avatar y genera data-avatar', () => {
      document.body.innerHTML = `
        <ul data-mtx="list">
          <li id="a" data-mtx="list-item" data-secondary="ana@ejemplo.com"><span data-mtx="avatar">AG</span>Ana García</li>
          <li id="b" data-mtx="list-item" data-avatar="https://example.com/a.png" data-avatar-alt="">Luis</li>
        </ul>`;
      initAll();
      const a = document.getElementById('a');
      expect(a.firstElementChild.classList.contains('mtx-list-item-avatar')).toBe(true);
      expect(a.querySelector('.mtx-list-item-avatar [data-mtx="avatar"]')).not.toBeNull();
      expect(a.querySelector('.mtx-list-item-text__primary').textContent).toBe('Ana García');
      const b = document.getElementById('b');
      expect(b.querySelector('.mtx-list-item-avatar [data-mtx="avatar"]').getAttribute('data-src')).toBe('https://example.com/a.png');
    });

    it('A6: aria-current="page" en <a>, aria-selected solo con role option/tab y setter sincronizado', () => {
      document.body.innerHTML = `
        <nav><ul data-mtx="list">
          <li><a id="l1" href="#a" data-mtx="list-item-button" data-selected>Uno</a></li>
          <li><a id="l2" href="#b" data-mtx="list-item-button">Dos</a></li>
        </ul></nav>
        <ul data-mtx="list" role="listbox">
          <li id="o1" role="option" data-mtx="list-item-button">A</li>
          <li id="o2" role="option" data-mtx="list-item-button">B</li>
        </ul>
        <ul data-mtx="list"><li><button id="b1" data-mtx="list-item-button">Btn</button></li></ul>`;
      initAll();
      const byId = (id) => document.getElementById(id);
      expect(byId('l1').getAttribute('aria-current')).toBe('page');
      expect(byId('l1').hasAttribute('aria-selected')).toBe(false);
      byId('l2').click();
      expect(byId('l2').getAttribute('aria-current')).toBe('page');
      expect(byId('l1').hasAttribute('aria-current')).toBe(false);
      expect(byId('l1').classList.contains('mtx-list-item--selected')).toBe(false);

      byId('o2').click();
      expect(byId('o2').getAttribute('aria-selected')).toBe('true');
      expect(byId('o2').hasAttribute('aria-current')).toBe(false);
      getInstance(byId('o1')).selected = true;
      expect(byId('o1').getAttribute('aria-selected')).toBe('true');
      getInstance(byId('o1')).selected = false;
      expect(byId('o1').getAttribute('aria-selected')).toBe('false');

      const btn = getInstance(byId('b1'));
      btn.selected = true;
      expect(byId('b1').getAttribute('aria-current')).toBe('true');
      expect(byId('b1').hasAttribute('aria-selected')).toBe(false);
      btn.selected = false;
      expect(byId('b1').hasAttribute('aria-current')).toBe(false);
    });
  });
});
