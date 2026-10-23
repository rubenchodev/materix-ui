import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Drawer } from '../src/components/drawer/drawer.js';

function createDrawer(attrs = {}, content = '<p>Contenido del drawer</p>') {
  const el = document.createElement('div');
  el.setAttribute('data-mtx', 'drawer');
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  el.innerHTML = content;
  document.body.appendChild(el);
  return el;
}

describe('Drawer (MUI / MD2)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  describe('Inicialización y Auto-Scaffolding (Single-Element)', () => {
    it('inicializa y registra una instancia de Drawer en el registry', () => {
      const el = createDrawer();
      initAll();
      const drawer = getInstance(el);
      expect(drawer).toBeInstanceOf(Drawer);
      expect(el.classList.contains('mtx-drawer')).toBe(true);
      expect(el.classList.contains('mtx-drawer--left')).toBe(true);
    });

    it('auto-genera .mtx-drawer__content envolviendo los nodos hijos existentes', () => {
      const el = createDrawer({}, '<p id="child1">Hola</p><button id="btn1">Acción</button>');
      initAll();
      const content = el.querySelector('.mtx-drawer__content');
      expect(content).not.toBeNull();
      expect(content.querySelector('#child1')).not.toBeNull();
      expect(content.querySelector('#btn1')).not.toBeNull();
    });

    it('auto-genera cabecera con data-title y botón de cierre', () => {
      const el = createDrawer({
        'data-title': 'Mi Menú Principal',
        'data-subtitle': 'Configuración de cuenta',
      }, '<p>Opciones...</p>');
      initAll();

      const header = el.querySelector('.mtx-drawer__header');
      expect(header).not.toBeNull();
      const title = header.querySelector('.mtx-drawer__title');
      expect(title.textContent).toBe('Mi Menú Principal');
      const subtitle = header.querySelector('.mtx-drawer__subtitle');
      expect(subtitle.textContent).toBe('Configuración de cuenta');
      const closeBtn = header.querySelector('.mtx-drawer__close');
      expect(closeBtn).not.toBeNull();
      expect(closeBtn.hasAttribute('data-mtx-drawer-close')).toBe(true);
    });

    it('respeta la estructura BEM preexistente sin duplicar cabecera ni contenido', () => {
      const el = document.createElement('div');
      el.className = 'mtx-drawer mtx-drawer--right';
      el.setAttribute('data-mtx', 'drawer');
      el.innerHTML = `
        <div class="mtx-drawer__header">
          <h2 class="custom-title">Manual</h2>
        </div>
        <div class="mtx-drawer__content">
          <p>Manual Content</p>
        </div>
      `;
      document.body.appendChild(el);
      initAll();

      expect(el.querySelectorAll('.mtx-drawer__header').length).toBe(1);
      expect(el.querySelectorAll('.mtx-drawer__content').length).toBe(1);
    });
  });

  describe('Anclas (Anchors) y Modificadores', () => {
    it('soporta las cuatro anclas canónicas de MUI: left, right, top, bottom', () => {
      const left = createDrawer({ 'data-anchor': 'left' });
      const right = createDrawer({ 'data-anchor': 'right' });
      const top = createDrawer({ 'data-anchor': 'top' });
      const bottom = createDrawer({ 'data-anchor': 'bottom' });
      initAll();

      expect(left.classList.contains('mtx-drawer--left')).toBe(true);
      expect(right.classList.contains('mtx-drawer--right')).toBe(true);
      expect(top.classList.contains('mtx-drawer--top')).toBe(true);
      expect(bottom.classList.contains('mtx-drawer--bottom')).toBe(true);
    });

    it('aplica modificadores de ancho: wide, narrow, full y medidas CSS', () => {
      const wide = createDrawer({ 'data-width': 'wide' });
      const narrow = createDrawer({ 'data-width': 'narrow' });
      const full = createDrawer({ 'data-width': 'full' });
      const custom = createDrawer({ 'data-width': '420px' });
      initAll();

      expect(wide.classList.contains('mtx-drawer--wide')).toBe(true);
      expect(narrow.classList.contains('mtx-drawer--narrow')).toBe(true);
      expect(full.classList.contains('mtx-drawer--full-width')).toBe(true);
      expect(custom.style.getPropertyValue('--mtx-drawer-width')).toBe('420px');
    });

    it('aplica elevación personalizada mediante data-elevation', () => {
      const el = createDrawer({ 'data-elevation': '8' });
      initAll();
      expect(el.style.boxShadow).toBe('var(--mtx-elevation-8)');
    });

    it('aplica clase para patrón clipped debajo de AppBar', () => {
      const el = createDrawer({ 'data-clipped': 'true' });
      initAll();
      expect(el.classList.contains('mtx-drawer--clipped')).toBe(true);
    });

    it('aplica modificador de contenido con relleno mediante data-padded="true"', () => {
      const el = createDrawer({ 'data-padded': 'true' });
      initAll();
      const content = el.querySelector('.mtx-drawer__content');
      expect(content.classList.contains('mtx-drawer__content--padded')).toBe(true);
    });

    it('transfiere el padding del contenedor raíz al panel interno para preservar borde a borde', () => {
      const el = createDrawer();
      el.style.padding = '20px';
      initAll();
      const content = el.querySelector('.mtx-drawer__content');
      expect(content.style.padding).toBe('20px');
      expect(el.style.padding).toBe('');
    });
  });

  describe('Variantes: Temporary, Persistent y Permanent', () => {
    it('variante temporary (default) crea backdrop y gestiona modal stack', () => {
      const el = createDrawer({ id: 'temp-drawer' });
      initAll();
      const drawer = getInstance(el);

      const backdrop = document.querySelector('.mtx-drawer__backdrop');
      expect(backdrop).not.toBeNull();
      expect(backdrop.classList.contains('mtx-drawer__backdrop--open')).toBe(false);

      drawer.open();
      expect(drawer.isOpen).toBe(true);
      expect(backdrop.classList.contains('mtx-drawer__backdrop--open')).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');

      drawer.close();
      expect(drawer.isOpen).toBe(false);
      expect(backdrop.classList.contains('mtx-drawer__backdrop--open')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });

    it('variante persistent no crea backdrop ni bloquea overflow de página', () => {
      const el = createDrawer({ 'data-variant': 'persistent', id: 'pers-drawer' });
      initAll();
      const drawer = getInstance(el);

      expect(el.classList.contains('mtx-drawer--persistent')).toBe(true);
      expect(document.querySelector('.mtx-drawer__backdrop')).toBeNull();

      drawer.open();
      expect(drawer.isOpen).toBe(true);
      expect(document.body.style.overflow).not.toBe('hidden');

      drawer.close();
      expect(drawer.isOpen).toBe(false);
    });

    it('variante permanent siempre está abierta y no puede cerrarse', () => {
      const el = createDrawer({ 'data-variant': 'permanent', id: 'perm-drawer' });
      initAll();
      const drawer = getInstance(el);

      expect(el.classList.contains('mtx-drawer--permanent')).toBe(true);
      expect(el.classList.contains('mtx-drawer--open')).toBe(true);
      expect(drawer.isOpen).toBe(true);

      drawer.close();
      expect(drawer.isOpen).toBe(true);
      expect(el.classList.contains('mtx-drawer--open')).toBe(true);
    });
  });

  describe('Interacción, Eventos y Métodos Públicos', () => {
    it('emite eventos mtx:drawer:open y mtx:drawer:close con motivo detallado', () => {
      const el = createDrawer();
      initAll();
      const drawer = getInstance(el);

      const openSpy = vi.fn();
      const closeSpy = vi.fn();
      el.addEventListener('mtx:drawer:open', openSpy);
      el.addEventListener('mtx:drawer:close', closeSpy);

      drawer.open();
      expect(openSpy).toHaveBeenCalledTimes(1);

      drawer.close('customReason');
      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(closeSpy.mock.calls[0][0].detail.reason).toBe('customReason');
    });

    it('alterna el estado con toggle()', () => {
      const el = createDrawer();
      initAll();
      const drawer = getInstance(el);

      expect(drawer.isOpen).toBe(false);
      drawer.toggle();
      expect(drawer.isOpen).toBe(true);
      drawer.toggle();
      expect(drawer.isOpen).toBe(false);
    });

    it('cierra al hacer clic en el backdrop', () => {
      const el = createDrawer();
      initAll();
      const drawer = getInstance(el);

      drawer.open();
      const backdrop = document.querySelector('.mtx-drawer__backdrop');
      backdrop.click();
      expect(drawer.isOpen).toBe(false);
    });

    it('no cierra en backdrop si tiene data-disable-backdrop-click', () => {
      const el = createDrawer({ 'data-disable-backdrop-click': 'true' });
      initAll();
      const drawer = getInstance(el);

      drawer.open();
      const backdrop = document.querySelector('.mtx-drawer__backdrop');
      backdrop.click();
      expect(drawer.isOpen).toBe(true);
      drawer.close();
    });

    it('cierra con la tecla Escape', () => {
      const el = createDrawer();
      initAll();
      const drawer = getInstance(el);

      drawer.open();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(drawer.isOpen).toBe(false);
    });

    it('no cierra con Escape si data-disable-escape está presente', () => {
      const el = createDrawer({ 'data-disable-escape': 'true' });
      initAll();
      const drawer = getInstance(el);

      drawer.open();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(drawer.isOpen).toBe(true);
      drawer.close();
    });
  });

  describe('Disparadores Declarativos y Accesibilidad (ARIA)', () => {
    it('soporta data-mtx-drawer-open, data-mtx-drawer-close y data-mtx-drawer-toggle', () => {
      const triggerOpen = document.createElement('button');
      triggerOpen.setAttribute('data-mtx-drawer-open', 'demo-drawer');
      document.body.appendChild(triggerOpen);

      const triggerToggle = document.createElement('button');
      triggerToggle.setAttribute('data-mtx-drawer-toggle', 'demo-drawer');
      document.body.appendChild(triggerToggle);

      const el = createDrawer({ id: 'demo-drawer' }, `
        <button id="inner-close" data-mtx-drawer-close>Cerrar</button>
      `);
      initAll();
      const drawer = getInstance(el);

      // Abrir mediante trigger
      triggerOpen.click();
      expect(drawer.isOpen).toBe(true);
      expect(triggerOpen.getAttribute('aria-expanded')).toBe('true');
      expect(triggerToggle.getAttribute('aria-expanded')).toBe('true');

      // Cerrar desde botón interno
      const innerClose = el.querySelector('#inner-close');
      innerClose.click();
      expect(drawer.isOpen).toBe(false);
      expect(triggerOpen.getAttribute('aria-expanded')).toBe('false');
      expect(triggerToggle.getAttribute('aria-expanded')).toBe('false');

      // Alternar mediante trigger
      triggerToggle.click();
      expect(drawer.isOpen).toBe(true);
      triggerToggle.click();
      expect(drawer.isOpen).toBe(false);
    });

    it('sincroniza aria-hidden en el contenedor del drawer', () => {
      const el = createDrawer();
      initAll();
      const drawer = getInstance(el);

      expect(el.getAttribute('aria-hidden')).toBe('true');
      drawer.open();
      expect(el.getAttribute('aria-hidden')).toBe('false');
      drawer.close();
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Modo Contenedor / Absoluto y Destrucción', () => {
    it('soporta modo absoluto insertando backdrop en el contenedor padre', () => {
      const container = document.createElement('div');
      container.style.position = 'relative';
      document.body.appendChild(container);

      const el = document.createElement('div');
      el.setAttribute('data-mtx', 'drawer');
      el.setAttribute('data-absolute', 'true');
      el.innerHTML = '<p>Local Drawer</p>';
      container.appendChild(el);

      initAll();
      const drawer = getInstance(el);
      expect(el.classList.contains('mtx-drawer--absolute')).toBe(true);

      const backdrop = container.querySelector('.mtx-drawer__backdrop--absolute');
      expect(backdrop).not.toBeNull();

      drawer.open();
      // En modo absoluto no bloquea el scroll de la ventana
      expect(document.body.style.overflow).toBe('');
    });

    it('limpia elementos de backdrop y eventos en destroy()', () => {
      const el = createDrawer();
      initAll();
      const drawer = getInstance(el);
      drawer.open();

      drawer.destroy();
      expect(document.querySelector('.mtx-drawer__backdrop')).toBeNull();
    });
  });

  describe('Header Fijo, Footer Fijo y Submenús Colapsables', () => {
    it('mantiene header y footer fuera de .mtx-drawer__content para scroll independiente', () => {
      const el = createDrawer({
        'data-title': 'Materix Suite',
      }, `
        <ul class="mtx-list">
          <li class="mtx-list-item">Ítem 1</li>
          <li class="mtx-list-item">Ítem 2</li>
        </ul>
        <div class="mtx-drawer__footer" id="my-footer">
          <span>v1.0</span>
          <button id="logout-btn">Salir</button>
        </div>
      `);
      initAll();

      const drawer = getInstance(el);
      expect(drawer.header).not.toBeNull();
      expect(drawer.panel).not.toBeNull();
      expect(drawer.footer).not.toBeNull();

      // El panel de contenido no debe contener el header ni el footer
      expect(drawer.panel.contains(drawer.header)).toBe(false);
      expect(drawer.panel.contains(drawer.footer)).toBe(false);

      // El footer debe ser hijo directo del drawer
      expect(el.querySelector('#my-footer').parentElement).toBe(el);
      expect(el.lastElementChild).toBe(drawer.footer);
    });

    it('permite alternar submenús colapsables declarativos con data-mtx-collapse-trigger', () => {
      const el = createDrawer({}, `
        <li class="mtx-list-item mtx-list-item-button" id="trigger-sub" data-mtx-collapse-trigger="sub-1" aria-expanded="false">
          <span>Proyectos</span>
        </li>
        <div id="sub-1" class="mtx-collapse" hidden>
          <ul class="mtx-list mtx-list--nested">
            <li class="mtx-list-item">Sub-ítem A</li>
          </ul>
        </div>
      `);
      initAll();

      const trigger = el.querySelector('#trigger-sub');
      const sub = el.querySelector('#sub-1');

      expect(sub.hasAttribute('hidden')).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      // Clic para abrir submenú
      trigger.click();
      expect(sub.hasAttribute('hidden')).toBe(false);
      expect(sub.hasAttribute('inert')).toBe(false);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      // Clic para cerrar submenú: hidden + inert (sin foco durante la animación de cierre)
      trigger.click();
      expect(sub.hasAttribute('hidden')).toBe(true);
      expect(sub.hasAttribute('inert')).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      trigger.click();
      expect(sub.hasAttribute('inert')).toBe(false);
    });
  });
});
