import "./tooltip.css";
import "./fab.css";
import "./speed-dial.css";
import { r as p, C as u, t as m, h as _, v as b, z as f, g as d, A as l, q as A } from "../chunks/core-CJdkPtZx.js";
import { t as c } from "../chunks/tooltip-DU4A22l1.js";
class x extends u {
  /**
   * Crea una instancia de SpeedDial.
   *
   * @param {HTMLElement} element Elemento contenedor `.mtx-speed-dial`.
   */
  constructor(t) {
    super(t), this.element.classList.add("mtx-speed-dial");
    const e = t.getAttribute("data-direction") || "up";
    this.direction = e, this._eventMode = t.getAttribute("data-event") || "click", this._tooltipHover = t.hasAttribute("data-tooltip-hover"), this._tooltipHover && t.classList.add("mtx-speed-dial--tooltip-hover");
    let i = t.querySelector(".mtx-speed-dial__fab") || t.querySelector(".mtx-fab");
    if (!i && t.getAttribute("data-icon")) {
      i = document.createElement("button");
      const a = t.getAttribute("data-color") || "primary";
      i.className = `mtx-fab mtx-fab--${a} mtx-speed-dial__fab`, i.setAttribute("type", "button"), i.setAttribute("aria-label", t.getAttribute("data-label") || m("speedDial", "actions", null, "Actions", _(t)));
      const s = document.createElement("span");
      s.className = "material-icons", s.setAttribute("aria-hidden", "true"), s.textContent = t.getAttribute("data-icon"), i.appendChild(s), t.insertBefore(i, t.firstChild);
    }
    this._fab = i, this._fab && (this._fab.setAttribute("aria-expanded", "false"), this._fab.setAttribute("aria-haspopup", "true"));
    let o = t.querySelector(".mtx-speed-dial__actions");
    if (!o) {
      const a = Array.from(t.querySelectorAll("button:not(.mtx-speed-dial__fab)"));
      a.length > 0 && (o = document.createElement("div"), o.className = "mtx-speed-dial__actions", a.forEach((s) => {
        const h = s.getAttribute("data-color") ? `mtx-fab--${s.getAttribute("data-color")}` : "mtx-fab--secondary";
        s.classList.add("mtx-fab", "mtx-fab--small", h, "mtx-speed-dial__action"), s.getAttribute("type") || s.setAttribute("type", "button");
        const r = s.getAttribute("data-icon");
        if (r && !s.querySelector(".material-icons") && !s.querySelector("svg")) {
          const n = document.createElement("span");
          n.className = "material-icons", n.setAttribute("aria-hidden", "true"), n.textContent = r, s.appendChild(n);
        }
        o.appendChild(s);
      }), t.appendChild(o));
    }
    this._actionsContainer = o, this._setupTooltips(), this._setupActionsA11y(), this._handleFabClick = (a) => {
      a.stopPropagation(), this.toggle();
    }, this._handleMouseEnter = () => {
      this._eventMode === "hover" && this.open();
    }, this._handleMouseLeave = () => {
      this._eventMode === "hover" && this.close();
    }, this._handleDocumentClick = (a) => {
      this.isOpen && !this.element.contains(a.target) && this.close();
    }, this._fab && this.listen(this._fab, "click", this._handleFabClick), this._eventMode === "hover" && (this.listen(this.element, "mouseenter", this._handleMouseEnter), this.listen(this.element, "mouseleave", this._handleMouseLeave)), this.listen(document, "click", this._handleDocumentClick);
  }
  /**
   * Genera las etiquetas de las acciones con `data-tooltip`: estáticas y visibles mientras está
   * abierto (modo por defecto, `tooltipOpen` de MUI) o Tooltip en hover/foco con `data-tooltip-hover`.
   * @private
   */
  _setupTooltips() {
    if (!this._actionsContainer) return;
    this._actionsContainer.querySelectorAll(".mtx-speed-dial__action").forEach((e) => {
      const i = e.getAttribute("data-tooltip");
      if (!i || e.parentElement.classList.contains("mtx-speed-dial__action-wrapper")) return;
      const o = document.createElement("div");
      if (o.className = "mtx-speed-dial__action-wrapper", e.parentNode.insertBefore(o, e), this._tooltipHover)
        e.hasAttribute("data-mtx-tooltip") || (e.setAttribute("data-mtx-tooltip", i), e.setAttribute("data-mtx-speed-dial-tooltip", ""));
      else {
        const a = document.createElement("span");
        a.className = "mtx-speed-dial__tooltip", a.setAttribute("aria-hidden", "true"), a.textContent = i, o.appendChild(a);
      }
      o.appendChild(e);
    }), this._syncTooltipPlacement();
  }
  /**
   * Coloca los Tooltip de las acciones según la dirección (izquierda en vertical, arriba en horizontal).
   * @private
   */
  _syncTooltipPlacement() {
    if (!this._tooltipHover || !this._actionsContainer) return;
    const t = this.direction === "left" || this.direction === "right" ? "top" : "left";
    this._actionsContainer.querySelectorAll("[data-mtx-speed-dial-tooltip]").forEach((e) => {
      e.setAttribute("data-tooltip-placement", t);
    });
  }
  /**
   * Nombra las acciones desde `data-tooltip` y las saca del orden de tabulación mientras está cerrado.
   * @private
   */
  _setupActionsA11y() {
    this._actionsContainer && (this._actionsContainer.id || (this._actionsContainer.id = b("mtx-speed-dial-actions")), this._fab && this._fab.setAttribute("aria-controls", this._actionsContainer.id), this._getActions().forEach((t) => {
      const e = t.getAttribute("data-tooltip");
      e && !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && t.setAttribute("aria-label", e);
    }), this._syncActionsA11y());
  }
  /**
   * Acciones secundarias del SpeedDial.
   * @returns {HTMLElement[]} Botones de acción.
   * @private
   */
  _getActions() {
    return this._actionsContainer ? Array.from(this._actionsContainer.querySelectorAll(".mtx-speed-dial__action")) : [];
  }
  /**
   * Sincroniza `inert`, `aria-hidden` y `tabindex` de las acciones con el estado abierto.
   * @private
   */
  _syncActionsA11y() {
    if (!this._actionsContainer) return;
    const t = this.isOpen;
    this._actionsContainer.inert = !t, t ? this._actionsContainer.removeAttribute("aria-hidden") : this._actionsContainer.setAttribute("aria-hidden", "true"), this._getActions().forEach((e) => {
      if (t) {
        if (e.hasAttribute("data-mtx-speed-dial-tabindex")) {
          const i = e.getAttribute("data-mtx-speed-dial-tabindex");
          i ? e.setAttribute("tabindex", i) : e.removeAttribute("tabindex"), e.removeAttribute("data-mtx-speed-dial-tabindex");
        }
      } else e.hasAttribute("data-mtx-speed-dial-tabindex") || (e.setAttribute("data-mtx-speed-dial-tabindex", e.getAttribute("tabindex") || ""), e.setAttribute("tabindex", "-1"));
    });
  }
  /** @returns {boolean} `true` si el SpeedDial está abierto. */
  get isOpen() {
    return this.element.classList.contains("mtx-speed-dial--open");
  }
  /** @returns {string} Dirección del SpeedDial. */
  get direction() {
    return this._direction || "up";
  }
  /** @param {string} value Nueva dirección (`up`, `down`, `left`, `right`). */
  set direction(t) {
    this._direction = t, this.element.classList.remove(
      "mtx-speed-dial--direction-up",
      "mtx-speed-dial--direction-down",
      "mtx-speed-dial--direction-left",
      "mtx-speed-dial--direction-right"
    ), this.element.classList.add(`mtx-speed-dial--direction-${t}`), this._syncTooltipPlacement();
  }
  /**
   * Abre el menú SpeedDial.
   */
  open() {
    this.isOpen || (this.element.classList.add("mtx-speed-dial--open"), this._fab && this._fab.setAttribute("aria-expanded", "true"), f(this, {
      kind: "popup",
      nodes: this.element,
      onEscape: () => {
        this.close(), this._fab && this._fab.focus();
      }
    }), this._syncActionsA11y(), d(this.element, "mtx:speed-dial:open", { speedDial: this }, { aliases: ["mtx-speed-dial-open"] }));
  }
  /**
   * Cierra el menú SpeedDial.
   */
  close() {
    this.isOpen && (this.element.classList.remove("mtx-speed-dial--open"), l(this), this._fab && this._fab.setAttribute("aria-expanded", "false"), this._getActions().forEach((t) => c.hide(t)), this._actionsContainer && this._actionsContainer.contains(document.activeElement) && this._fab && this._fab.focus(), this._syncActionsA11y(), d(this.element, "mtx:speed-dial:close", { speedDial: this }, { aliases: ["mtx-speed-dial-close"] }));
  }
  /**
   * Alterna el estado de apertura.
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  /**
   * Destruye la instancia y remueve event listeners.
   */
  destroy() {
    l(this), this._getActions().forEach((t) => c.hide(t)), super.destroy();
  }
}
p("speed-dial", x);
A();
export {
  x as SpeedDial
};
