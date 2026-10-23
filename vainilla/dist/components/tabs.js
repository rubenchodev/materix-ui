import "./tabs.css";
import { r as h, C as u, v as p, g as f, d as g, q as m } from "../chunks/core-CJdkPtZx.js";
class y extends u {
  /**
   * Crea una instancia de las pestañas.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-tabs") || t.classList.add("mtx-tabs"), this.tabs = Array.from(t.querySelectorAll('[data-mtx="tab"]'));
    let a = t.querySelector(".mtx-tabs__indicator");
    a || (a = document.createElement("span"), a.className = "mtx-tabs__indicator", t.appendChild(a)), this.indicator = a, this.orientation = t.getAttribute("data-orientation") || "horizontal", this.selectionFollowsFocus = t.hasAttribute("data-selection-follows-focus"), this.orientation === "vertical" && t.classList.add("mtx-tabs--vertical"), t.hasAttribute("data-full") && t.classList.add("mtx-tabs--full"), t.hasAttribute("data-centered") && t.classList.add("mtx-tabs--centered"), t.setAttribute("role", "tablist"), t.setAttribute("aria-orientation", this.orientation), this.panels = /* @__PURE__ */ new Map();
    const l = t.id || p("mtx-tabs");
    if (this.tabs.forEach((e, i) => {
      e.classList.contains("mtx-tab") || e.classList.add("mtx-tab");
      const s = e.getAttribute("data-icon");
      if (s && !e.querySelector(".material-icons") && !e.querySelector("svg")) {
        const c = document.createElement("span");
        c.className = "material-icons mtx-tab__icon", c.setAttribute("aria-hidden", "true"), c.textContent = s, e.insertBefore(c, e.firstChild);
      }
      e.setAttribute("role", "tab"), e.id || (e.id = `${l}-tab-${i + 1}`);
      const r = e.getAttribute("data-panel"), n = r ? document.querySelector(r) : null;
      n && (this.panels.set(e, n), n.setAttribute("role", "tabpanel"), n.setAttribute("aria-labelledby", e.id), n.id || (n.id = `${e.id}-panel`), e.setAttribute("aria-controls", n.id)), (e.hasAttribute("data-disabled") || e.disabled) && (e.setAttribute("aria-disabled", "true"), e.tabIndex = -1);
    }), this._handleKeydown = (e) => {
      if (!e.target.closest(".mtx-tab")) return;
      const i = this.tabs.filter((c) => c.getAttribute("aria-disabled") !== "true"), s = i.indexOf(document.activeElement), r = this.orientation === "vertical" ? ["ArrowUp"] : ["ArrowLeft"], n = this.orientation === "vertical" ? ["ArrowDown"] : ["ArrowRight"];
      let d = null;
      n.includes(e.key) ? d = i[(s + 1 + i.length) % i.length] : r.includes(e.key) ? d = i[(s - 1 + i.length) % i.length] : e.key === "Home" ? d = i[0] : e.key === "End" ? d = i[i.length - 1] : (e.key === "Enter" || e.key === " ") && s >= 0 && (d = i[s]), d && (e.preventDefault(), this.selectionFollowsFocus || e.key === "Enter" || e.key === " " ? this._activate(d, { focus: !0 }) : d.focus());
    }, this._handleClick = (e) => {
      const i = e.target.closest(".mtx-tab");
      i && this._activate(i, { focus: !0 });
    }, t.addEventListener("keydown", this._handleKeydown), t.addEventListener("click", this._handleClick), this._handleResize = () => this._updateIndicator(), this.listen(window, "resize", this._handleResize), this._handleWindowLoad = () => this._updateIndicator(), this.listen(window, "load", this._handleWindowLoad), typeof requestAnimationFrame < "u") {
      const e = requestAnimationFrame(() => this._updateIndicator());
      this.onDestroy(() => cancelAnimationFrame(e));
    }
    typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
      this.destroyed || this._updateIndicator();
    }), typeof ResizeObserver < "u" && (this._resizeObserver = new ResizeObserver(() => {
      this._updateIndicator();
    }), this._resizeObserver.observe(t), this.tabs.forEach((e) => this._resizeObserver.observe(e)), this.onDestroy(() => {
      this._resizeObserver.disconnect(), this._resizeObserver = null;
    }));
    const o = this.tabs.find(
      (e) => (e.hasAttribute("data-active") || e.classList.contains("mtx-tab--active")) && e.getAttribute("aria-disabled") !== "true"
    ) || this.tabs.find((e) => e.getAttribute("aria-disabled") !== "true");
    o && this._activate(o, { focus: !1, emit: !1 });
  }
  /**
   * Activa una pestaña.
   *
   * @param {HTMLElement} tab Pestaña a activar.
   */
  _activate(t, { focus: a = !0, emit: l = !0 } = {}) {
    if (!t || t.getAttribute("aria-disabled") === "true" || t.disabled || t.classList.contains("mtx-tab--active")) return;
    let o = this.panels.get(t) || null, e = this.tabs.find((s) => s.classList.contains("mtx-tab--active")), i = e && this.panels.get(e) || null;
    if (l) {
      const s = f(this.element, "mtx:tabs:before-change", {
        tab: t,
        panel: o,
        previousTab: e,
        previousPanel: i
      }, { cancelable: !0 });
      if (typeof this.onBeforeChange == "function" && this.onBeforeChange(t, o, e, i) === !1 || !s) return;
    }
    this.tabs.forEach((s) => {
      const r = s === t;
      s.classList.toggle("mtx-tab--active", r), s.setAttribute("aria-selected", String(r)), s.tabIndex = r ? 0 : -1;
      const n = this.panels.get(s);
      n && (n.hidden = !r, n.setAttribute("aria-hidden", String(!r)));
    }), this._updateIndicator(), a && t.focus(), l && (typeof this.onChange == "function" && this.onChange(t, o, e, i), f(this.element, "mtx:tabs:change", {
      tab: t,
      panel: o,
      previousTab: e,
      previousPanel: i
    }));
  }
  /** Valor de la pestaña activa (data-value, id o índice). */
  get value() {
    const t = this.tabs.find((a) => a.getAttribute("aria-selected") === "true");
    return t ? t.getAttribute("data-value") || t.id || String(this.tabs.indexOf(t)) : null;
  }
  /** Activa una pestaña por valor, id, índice o elemento. */
  select(t) {
    const a = t instanceof HTMLElement ? t : this.tabs.find((l, o) => l.getAttribute("data-value") === String(t) || l.id === String(t) || o === Number(t));
    this._activate(a, { focus: !1 });
  }
  /**
   * Reposiciona el indicador bajo la pestaña activa.
   */
  _updateIndicator() {
    if (!this.indicator) return;
    const t = this.tabs.find((a) => a.classList.contains("mtx-tab--active")) || this.tabs[0];
    t && (this.orientation === "vertical" ? (this.indicator.style.height = `${t.offsetHeight}px`, this.indicator.style.width = "", this.indicator.style.transform = `translateY(${t.offsetTop}px)`) : (this.indicator.style.width = `${t.offsetWidth}px`, this.indicator.style.height = "", this.indicator.style.transform = `translateX(${t.offsetLeft}px)`));
  }
  /**
   * Destruye la instancia.
   */
  destroy() {
    this.element.removeEventListener("keydown", this._handleKeydown), this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
class A extends u {
  /**
   * Crea una instancia de la pestaña.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), this._handlePointerDown = (a) => {
      t.hasAttribute("data-disabled") || a.button !== 0 || g(t, a);
    }, t.addEventListener("pointerdown", this._handlePointerDown);
  }
  /**
   * Destruye la instancia.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
}
h("tabs", y);
h("tab", A);
h("tab-panel", u);
m();
export {
  A as Tab,
  y as Tabs
};
