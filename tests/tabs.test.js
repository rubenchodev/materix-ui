import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Tabs, Tab } from '../src/components/tabs/tabs.js';

function createTabsContainer() {
  const container = document.createElement('div');
  container.className = 'mtx-tabs';
  container.setAttribute('data-mtx', 'tabs');
  container.id = 'testTabs';

  const tab1 = document.createElement('button');
  tab1.className = 'mtx-tab';
  tab1.setAttribute('data-mtx', 'tab');
  tab1.setAttribute('data-value', 'tab1');
  tab1.setAttribute('data-panel', '#panel1');
  tab1.setAttribute('data-active', '');
  tab1.textContent = 'Pestaña 1';

  const tab2 = document.createElement('button');
  tab2.className = 'mtx-tab';
  tab2.setAttribute('data-mtx', 'tab');
  tab2.setAttribute('data-value', 'tab2');
  tab2.setAttribute('data-panel', '#panel2');
  tab2.textContent = 'Pestaña 2';

  const indicator = document.createElement('span');
  indicator.className = 'mtx-tabs__indicator';

  container.appendChild(tab1);
  container.appendChild(tab2);
  container.appendChild(indicator);

  const panel1 = document.createElement('div');
  panel1.id = 'panel1';
  panel1.textContent = 'Contenido 1';

  const panel2 = document.createElement('div');
  panel2.id = 'panel2';
  panel2.textContent = 'Contenido 2';

  document.body.appendChild(container);
  document.body.appendChild(panel1);
  document.body.appendChild(panel2);

  return { container, tab1, tab2, panel1, panel2 };
}

describe('Tabs & Tab', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y selecciona la pestaña por defecto', () => {
    const { container, tab1, tab2, panel1, panel2 } = createTabsContainer();
    initAll();

    const tabs = getInstance(container);
    expect(tabs).toBeInstanceOf(Tabs);
    expect(tabs.value).toBe('tab1');
    expect(tab1.getAttribute('aria-selected')).toBe('true');
    expect(panel1.hidden).toBe(false);
    expect(panel2.hidden).toBe(true);
  });

  it('cambia de pestaña al hacer clic y emite evento mtx:tabs:change', () => {
    const { container, tab2, panel1, panel2 } = createTabsContainer();
    initAll();

    const tabs = getInstance(container);
    const changeSpy = vi.fn();
    container.addEventListener('mtx:tabs:change', changeSpy);

    tab2.click();
    expect(tabs.value).toBe('tab2');
    expect(tab2.getAttribute('aria-selected')).toBe('true');
    expect(panel1.hidden).toBe(true);
    expect(panel2.hidden).toBe(false);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });

  it('permite seleccionar mediante el método select()', () => {
    const { container, panel2 } = createTabsContainer();
    initAll();

    const tabs = getInstance(container);
    tabs.select('tab2');
    expect(tabs.value).toBe('tab2');
    expect(panel2.hidden).toBe(false);
  });

  it('permite la navegación por teclado con flechas derecha e izquierda', () => {
    const { container, tab1, tab2 } = createTabsContainer();
    initAll();

    const tabs = getInstance(container);
    tab1.focus();
    tab1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(tab2);
  });

  it('actualiza el indicador y limpia los observadores en destroy', () => {
    const { container } = createTabsContainer();
    initAll();

    const tabs = getInstance(container);
    expect(tabs.indicator).toBeTruthy();
    tabs._updateIndicator();

    expect(() => tabs.destroy()).not.toThrow();
  });
  it('emite mtx:tabs:before-change cancelable y mtx:tabs:change con el mismo detail', () => {
    const { container, tab1, tab2, panel1, panel2 } = createTabsContainer();
    initAll();
    const tabs = getInstance(container);
    const before = [];
    const changes = [];
    document.body.addEventListener('mtx:tabs:before-change', (e) => before.push(e));
    document.body.addEventListener('mtx:tabs:change', (e) => changes.push(e));

    tab2.click();
    expect(before).toHaveLength(1);
    expect(before[0].bubbles).toBe(true);
    expect(before[0].cancelable).toBe(true);
    expect(before[0].detail).toEqual({ tab: tab2, panel: panel2, previousTab: tab1, previousPanel: panel1 });
    expect(changes).toHaveLength(1);
    expect(changes[0].cancelable).toBe(false);
    expect(changes[0].detail).toEqual({ tab: tab2, panel: panel2, previousTab: tab1, previousPanel: panel1 });

    container.addEventListener('mtx:tabs:before-change', (e) => e.preventDefault());
    tab1.click();
    expect(tabs.value).toBe('tab2');
    expect(changes).toHaveLength(1);
  });
});
