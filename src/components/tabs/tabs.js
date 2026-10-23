import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { uniqueId } from '../../core/id.js';
import { emit as emitEvent } from '../../core/events.js';

/**
 * Representa un grupo de pestañas de Materix UI.
 *
 * Sigue el patrón de `Tabs` de MUI. El indicador animado se coloca bajo la
 * pestaña activa.
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-tabs" data-mtx="tabs">
 *   <button class="mtx-tab" data-mtx="tab" data-panel="#panel1" data-active>Uno</button>
 *   <button class="mtx-tab" data-mtx="tab" data-panel="#panel2">Dos</button>
 *   <span class="mtx-tabs__indicator"></span>
 * </div>
 * ```
 */
export class Tabs extends ComponentBase {
  /**
   * Crea una instancia de las pestañas.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-tabs')) {
      element.classList.add('mtx-tabs');
    }

    this.tabs = Array.from(element.querySelectorAll('[data-mtx="tab"]'));

    let indicator = element.querySelector('.mtx-tabs__indicator');
    if (!indicator) {
      indicator = document.createElement('span');
      indicator.className = 'mtx-tabs__indicator';
      element.appendChild(indicator);
    }
    this.indicator = indicator;

    this.orientation = element.getAttribute('data-orientation') || 'horizontal';
    this.selectionFollowsFocus = element.hasAttribute('data-selection-follows-focus');
    if (this.orientation === 'vertical') element.classList.add('mtx-tabs--vertical');
    if (element.hasAttribute('data-full')) element.classList.add('mtx-tabs--full');
    if (element.hasAttribute('data-centered')) element.classList.add('mtx-tabs--centered');
    element.setAttribute('role', 'tablist');
    element.setAttribute('aria-orientation', this.orientation);

    this.panels = new Map();
    // Prefijo único por grupo: evita ids duplicados entre varios grupos sin id.
    const idPrefix = element.id || uniqueId('mtx-tabs');
    this.tabs.forEach((tab, index) => {
      if (!tab.classList.contains('mtx-tab')) {
        tab.classList.add('mtx-tab');
      }

      const iconName = tab.getAttribute('data-icon');
      if (iconName && !tab.querySelector('.material-icons') && !tab.querySelector('svg')) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-icons mtx-tab__icon';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.textContent = iconName;
        tab.insertBefore(iconSpan, tab.firstChild);
      }

      tab.setAttribute('role', 'tab');
      if (!tab.id) tab.id = `${idPrefix}-tab-${index + 1}`;
      const selector = tab.getAttribute('data-panel');
      const panel = selector ? document.querySelector(selector) : null;
      if (panel) {
        this.panels.set(tab, panel);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        if (!panel.id) panel.id = `${tab.id}-panel`;
        tab.setAttribute('aria-controls', panel.id);
      }
      const disabled = tab.hasAttribute('data-disabled') || tab.disabled;
      if (disabled) {
        tab.setAttribute('aria-disabled', 'true');
        tab.tabIndex = -1;
      }
    });

    this._handleKeydown = (event) => {
      if (!event.target.closest('.mtx-tab')) return;
      const enabled = this.tabs.filter((tab) => tab.getAttribute('aria-disabled') !== 'true');
      const current = enabled.indexOf(document.activeElement);
      const previousKeys = this.orientation === 'vertical' ? ['ArrowUp'] : ['ArrowLeft'];
      const nextKeys = this.orientation === 'vertical' ? ['ArrowDown'] : ['ArrowRight'];
      let target = null;
      if (nextKeys.includes(event.key)) target = enabled[(current + 1 + enabled.length) % enabled.length];
      else if (previousKeys.includes(event.key)) target = enabled[(current - 1 + enabled.length) % enabled.length];
      else if (event.key === 'Home') target = enabled[0];
      else if (event.key === 'End') target = enabled[enabled.length - 1];
      else if ((event.key === 'Enter' || event.key === ' ') && current >= 0) target = enabled[current];
      if (!target) return;
      event.preventDefault();
      if (this.selectionFollowsFocus || event.key === 'Enter' || event.key === ' ') {
        this._activate(target, { focus: true });
      } else {
        target.focus();
      }
    };

    this._handleClick = (event) => {
      const tab = event.target.closest('.mtx-tab');
      if (tab) this._activate(tab, { focus: true });
    };

    element.addEventListener('keydown', this._handleKeydown);
    element.addEventListener('click', this._handleClick);
    this._handleResize = () => this._updateIndicator();
    this.listen(window, 'resize', this._handleResize);

    this._handleWindowLoad = () => this._updateIndicator();
    this.listen(window, 'load', this._handleWindowLoad);

    if (typeof requestAnimationFrame !== 'undefined') {
      const frame = requestAnimationFrame(() => this._updateIndicator());
      this.onDestroy(() => cancelAnimationFrame(frame));
    }

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!this.destroyed) this._updateIndicator();
      });
    }

    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        this._updateIndicator();
      });
      this._resizeObserver.observe(element);
      this.tabs.forEach((tab) => this._resizeObserver.observe(tab));
      this.onDestroy(() => {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
      });
    }

    const initial = this.tabs.find(
      (tab) => (tab.hasAttribute('data-active') || tab.classList.contains('mtx-tab--active'))
        && tab.getAttribute('aria-disabled') !== 'true'
    ) || this.tabs.find((tab) => tab.getAttribute('aria-disabled') !== 'true');
    if (initial) this._activate(initial, { focus: false, emit: false });
  }

  /**
   * Activa una pestaña.
   *
   * @param {HTMLElement} tab Pestaña a activar.
   */
  _activate(tab, { focus = true, emit = true } = {}) {
    if (!tab || tab.getAttribute('aria-disabled') === 'true' || tab.disabled) return;
    if (tab.classList.contains('mtx-tab--active')) return;

    let targetPanel = this.panels.get(tab) || null;
    let previousTab = this.tabs.find((t) => t.classList.contains('mtx-tab--active'));
    let previousPanel = previousTab ? this.panels.get(previousTab) || null : null;

    if (emit) {
      const allowed = emitEvent(this.element, 'mtx:tabs:before-change', {
        tab,
        panel: targetPanel,
        previousTab,
        previousPanel,
      }, { cancelable: true });

      if (typeof this.onBeforeChange === 'function') {
        if (this.onBeforeChange(tab, targetPanel, previousTab, previousPanel) === false) {
          return;
        }
      }

      if (!allowed) return;
    }

    this.tabs.forEach((current) => {
      const active = current === tab;
      current.classList.toggle('mtx-tab--active', active);
      current.setAttribute('aria-selected', String(active));
      current.tabIndex = active ? 0 : -1;
      const currentPanel = this.panels.get(current);
      if (currentPanel) {
        currentPanel.hidden = !active;
        currentPanel.setAttribute('aria-hidden', String(!active));
      }
    });

    this._updateIndicator();
    if (focus) tab.focus();

    if (emit) {
      if (typeof this.onChange === 'function') {
        this.onChange(tab, targetPanel, previousTab, previousPanel);
      }
      emitEvent(this.element, 'mtx:tabs:change', {
        tab,
        panel: targetPanel,
        previousTab,
        previousPanel,
      });
    }
  }

  /** Valor de la pestaña activa (data-value, id o índice). */
  get value() {
    const tab = this.tabs.find((item) => item.getAttribute('aria-selected') === 'true');
    if (!tab) return null;
    return tab.getAttribute('data-value') || tab.id || String(this.tabs.indexOf(tab));
  }

  /** Activa una pestaña por valor, id, índice o elemento. */
  select(value) {
    const tab = value instanceof HTMLElement
      ? value
      : this.tabs.find((item, index) => (
        item.getAttribute('data-value') === String(value)
        || item.id === String(value)
        || index === Number(value)
      ));
    this._activate(tab, { focus: false });
  }

  /**
   * Reposiciona el indicador bajo la pestaña activa.
   */
  _updateIndicator() {
    if (!this.indicator) return;
    const active = this.tabs.find((t) => t.classList.contains('mtx-tab--active')) || this.tabs[0];
    if (!active) return;
    if (this.orientation === 'vertical') {
      this.indicator.style.height = `${active.offsetHeight}px`;
      this.indicator.style.width = '';
      this.indicator.style.transform = `translateY(${active.offsetTop}px)`;
    } else {
      this.indicator.style.width = `${active.offsetWidth}px`;
      this.indicator.style.height = '';
      this.indicator.style.transform = `translateX(${active.offsetLeft}px)`;
    }
  }

  /**
   * Destruye la instancia.
   */
  destroy() {
    this.element.removeEventListener('keydown', this._handleKeydown);
    this.element.removeEventListener('click', this._handleClick);
    super.destroy();
  }
}

/**
 * Pestaña individual.
 */
export class Tab extends ComponentBase {
  /**
   * Crea una instancia de la pestaña.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    this._handlePointerDown = (event) => {
      if (element.hasAttribute('data-disabled') || event.button !== 0) return;
      createRipple(element, event);
    };
    element.addEventListener('pointerdown', this._handlePointerDown);
  }

  /**
   * Destruye la instancia.
   */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    super.destroy();
  }
}

registerComponent('tabs', Tabs);
registerComponent('tab', Tab);
registerComponent('tab-panel', ComponentBase);