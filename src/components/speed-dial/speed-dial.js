import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { tooltip } from '../tooltip/tooltip.js';
import { emit } from '../../core/events.js';
import { uniqueId } from '../../core/id.js';
import { pushLayer, removeLayer } from '../../core/layers.js';

/**
 * Componente SpeedDial de Materix UI.
 * Basado en la especificación de Material UI (MUI).
 *
 * Muestra un botón de acción flotante (FAB) principal que despliega un menú
 * de acciones secundarias con etiquetas/tooltips al hacer clic o pasar el cursor.
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-speed-dial" data-mtx="speed-dial" data-direction="up">
 *   <button class="mtx-fab mtx-fab--primary mtx-speed-dial__fab" aria-label="Acciones">
 *     <span class="material-icons mtx-speed-dial__icon">add</span>
 *   </button>
 *   <div class="mtx-speed-dial__actions">
 *     <button class="mtx-fab mtx-fab--small mtx-fab--secondary mtx-speed-dial__action" data-tooltip="Estadísticas" aria-label="Estadísticas">
 *       <span class="material-icons">insert_chart</span>
 *     </button>
 *     <button class="mtx-fab mtx-fab--small mtx-fab--success mtx-speed-dial__action" data-tooltip="Publicar" aria-label="Publicar">
 *       <span class="material-icons">publish</span>
 *     </button>
 *   </div>
 * </div>
 * ```
 */
export class SpeedDial extends ComponentBase {
  /**
   * Crea una instancia de SpeedDial.
   *
   * @param {HTMLElement} element Elemento contenedor `.mtx-speed-dial`.
   */
  constructor(element) {
    super(element);

    this.element.classList.add('mtx-speed-dial');

    // Dirección (up, down, left, right)
    const direction = element.getAttribute('data-direction') || 'up';
    this.direction = direction;

    // Modo de evento (click u hover)
    this._eventMode = element.getAttribute('data-event') || 'click';

    // Etiquetas solo al pasar/enfocar: usan el Tooltip global (como SpeedDialAction de MUI).
    this._tooltipHover = element.hasAttribute('data-tooltip-hover');
    if (this._tooltipHover) {
      element.classList.add('mtx-speed-dial--tooltip-hover');
    }

    // FAB principal (auto-construir si tiene data-icon)
    let fab = element.querySelector('.mtx-speed-dial__fab') || element.querySelector('.mtx-fab');
    if (!fab && element.getAttribute('data-icon')) {
      fab = document.createElement('button');
      const color = element.getAttribute('data-color') || 'primary';
      fab.className = `mtx-fab mtx-fab--${color} mtx-speed-dial__fab`;
      fab.setAttribute('type', 'button');
      fab.setAttribute('aria-label', element.getAttribute('data-label') || t('speedDial', 'actions', null, 'Actions', getComponentLocale(element)));
      const iconSpan = document.createElement('span');
      iconSpan.className = 'material-icons';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = element.getAttribute('data-icon');
      fab.appendChild(iconSpan);
      element.insertBefore(fab, element.firstChild);
    }
    this._fab = fab;
    if (this._fab) {
      this._fab.setAttribute('aria-expanded', 'false');
      this._fab.setAttribute('aria-haspopup', 'true');
    }

    // Contenedor de acciones (auto-construir si hay botones secundarios)
    let actionsContainer = element.querySelector('.mtx-speed-dial__actions');
    if (!actionsContainer) {
      const actionButtons = Array.from(element.querySelectorAll('button:not(.mtx-speed-dial__fab)'));
      if (actionButtons.length > 0) {
        actionsContainer = document.createElement('div');
        actionsContainer.className = 'mtx-speed-dial__actions';
        actionButtons.forEach(btn => {
          const color = btn.getAttribute('data-color') ? `mtx-fab--${btn.getAttribute('data-color')}` : 'mtx-fab--secondary';
          btn.classList.add('mtx-fab', 'mtx-fab--small', color, 'mtx-speed-dial__action');
          if (!btn.getAttribute('type')) btn.setAttribute('type', 'button');
          const icon = btn.getAttribute('data-icon');
          if (icon && !btn.querySelector('.material-icons') && !btn.querySelector('svg')) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-icons';
            iconSpan.setAttribute('aria-hidden', 'true');
            iconSpan.textContent = icon;
            btn.appendChild(iconSpan);
          }
          actionsContainer.appendChild(btn);
        });
        element.appendChild(actionsContainer);
      }
    }
    this._actionsContainer = actionsContainer;

    // Procesar tooltips en las acciones
    this._setupTooltips();
    this._setupActionsA11y();

    // Event Listeners
    this._handleFabClick = (event) => {
      event.stopPropagation();
      this.toggle();
    };

    this._handleMouseEnter = () => {
      if (this._eventMode === 'hover') this.open();
    };

    this._handleMouseLeave = () => {
      if (this._eventMode === 'hover') this.close();
    };

    this._handleDocumentClick = (event) => {
      if (this.isOpen && !this.element.contains(event.target)) {
        this.close();
      }
    };


    if (this._fab) {
      this.listen(this._fab, 'click', this._handleFabClick);
    }

    if (this._eventMode === 'hover') {
      this.listen(this.element, 'mouseenter', this._handleMouseEnter);
      this.listen(this.element, 'mouseleave', this._handleMouseLeave);
    }

    this.listen(document, 'click', this._handleDocumentClick);
  }

  /**
   * Genera las etiquetas de las acciones con `data-tooltip`: estáticas y visibles mientras está
   * abierto (modo por defecto, `tooltipOpen` de MUI) o Tooltip en hover/foco con `data-tooltip-hover`.
   * @private
   */
  _setupTooltips() {
    if (!this._actionsContainer) return;
    const actions = this._actionsContainer.querySelectorAll('.mtx-speed-dial__action');
    actions.forEach((action) => {
      const tooltipText = action.getAttribute('data-tooltip');
      if (!tooltipText || action.parentElement.classList.contains('mtx-speed-dial__action-wrapper')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'mtx-speed-dial__action-wrapper';
      action.parentNode.insertBefore(wrapper, action);

      if (this._tooltipHover) {
        if (!action.hasAttribute('data-mtx-tooltip')) {
          action.setAttribute('data-mtx-tooltip', tooltipText);
          action.setAttribute('data-mtx-speed-dial-tooltip', '');
        }
      } else {
        const label = document.createElement('span');
        label.className = 'mtx-speed-dial__tooltip';
        // Decorativa: el nombre accesible de la acción ya es su aria-label.
        label.setAttribute('aria-hidden', 'true');
        label.textContent = tooltipText;
        wrapper.appendChild(label);
      }
      wrapper.appendChild(action);
    });
    this._syncTooltipPlacement();
  }

  /**
   * Coloca los Tooltip de las acciones según la dirección (izquierda en vertical, arriba en horizontal).
   * @private
   */
  _syncTooltipPlacement() {
    if (!this._tooltipHover || !this._actionsContainer) return;
    const placement = this.direction === 'left' || this.direction === 'right' ? 'top' : 'left';
    this._actionsContainer.querySelectorAll('[data-mtx-speed-dial-tooltip]').forEach((action) => {
      action.setAttribute('data-tooltip-placement', placement);
    });
  }

  /**
   * Nombra las acciones desde `data-tooltip` y las saca del orden de tabulación mientras está cerrado.
   * @private
   */
  _setupActionsA11y() {
    if (!this._actionsContainer) return;
    if (!this._actionsContainer.id) {
      this._actionsContainer.id = uniqueId('mtx-speed-dial-actions');
    }
    if (this._fab) this._fab.setAttribute('aria-controls', this._actionsContainer.id);
    this._getActions().forEach((action) => {
      const tooltip = action.getAttribute('data-tooltip');
      if (tooltip && !action.hasAttribute('aria-label') && !action.hasAttribute('aria-labelledby')) {
        action.setAttribute('aria-label', tooltip);
      }
    });
    this._syncActionsA11y();
  }

  /**
   * Acciones secundarias del SpeedDial.
   * @returns {HTMLElement[]} Botones de acción.
   * @private
   */
  _getActions() {
    return this._actionsContainer
      ? Array.from(this._actionsContainer.querySelectorAll('.mtx-speed-dial__action'))
      : [];
  }

  /**
   * Sincroniza `inert`, `aria-hidden` y `tabindex` de las acciones con el estado abierto.
   * @private
   */
  _syncActionsA11y() {
    if (!this._actionsContainer) return;
    const open = this.isOpen;
    this._actionsContainer.inert = !open;
    if (open) this._actionsContainer.removeAttribute('aria-hidden');
    else this._actionsContainer.setAttribute('aria-hidden', 'true');
    this._getActions().forEach((action) => {
      if (open) {
        if (action.hasAttribute('data-mtx-speed-dial-tabindex')) {
          const original = action.getAttribute('data-mtx-speed-dial-tabindex');
          if (original) action.setAttribute('tabindex', original);
          else action.removeAttribute('tabindex');
          action.removeAttribute('data-mtx-speed-dial-tabindex');
        }
      } else if (!action.hasAttribute('data-mtx-speed-dial-tabindex')) {
        action.setAttribute('data-mtx-speed-dial-tabindex', action.getAttribute('tabindex') || '');
        action.setAttribute('tabindex', '-1');
      }
    });
  }

  /** @returns {boolean} `true` si el SpeedDial está abierto. */
  get isOpen() {
    return this.element.classList.contains('mtx-speed-dial--open');
  }

  /** @returns {string} Dirección del SpeedDial. */
  get direction() {
    return this._direction || 'up';
  }

  /** @param {string} value Nueva dirección (`up`, `down`, `left`, `right`). */
  set direction(value) {
    this._direction = value;
    this.element.classList.remove(
      'mtx-speed-dial--direction-up',
      'mtx-speed-dial--direction-down',
      'mtx-speed-dial--direction-left',
      'mtx-speed-dial--direction-right'
    );
    this.element.classList.add(`mtx-speed-dial--direction-${value}`);
    this._syncTooltipPlacement();
  }

  /**
   * Abre el menú SpeedDial.
   */
  open() {
    if (this.isOpen) return;
    this.element.classList.add('mtx-speed-dial--open');
    if (this._fab) this._fab.setAttribute('aria-expanded', 'true');
    // Escape (pila de capas) cierra y devuelve el foco al FAB.
    pushLayer(this, {
      kind: 'popup',
      nodes: this.element,
      onEscape: () => {
        this.close();
        if (this._fab) this._fab.focus();
      },
    });
    this._syncActionsA11y();
    emit(this.element, 'mtx:speed-dial:open', { speedDial: this }, { aliases: ['mtx-speed-dial-open'] });
  }

  /**
   * Cierra el menú SpeedDial.
   */
  close() {
    if (!this.isOpen) return;
    this.element.classList.remove('mtx-speed-dial--open');
    removeLayer(this);
    if (this._fab) this._fab.setAttribute('aria-expanded', 'false');
    this._getActions().forEach((action) => tooltip.hide(action));
    if (this._actionsContainer && this._actionsContainer.contains(document.activeElement) && this._fab) {
      this._fab.focus();
    }
    this._syncActionsA11y();
    emit(this.element, 'mtx:speed-dial:close', { speedDial: this }, { aliases: ['mtx-speed-dial-close'] });
  }

  /**
   * Alterna el estado de apertura.
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }


  /**
   * Destruye la instancia y remueve event listeners.
   */
  destroy() {
    removeLayer(this);
    this._getActions().forEach((action) => tooltip.hide(action));
    super.destroy();
  }
}

registerComponent('speed-dial', SpeedDial);
