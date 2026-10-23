import "./list.css";
import { r as c, d as b, g as L, C as l, q as A } from "../chunks/core-CJdkPtZx.js";
class g extends l {
  /**
   * Crea una instancia de la lista.
   *
   * @param {HTMLElement} element Elemento `<ul>` o `<nav>` asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-list") || t.classList.add("mtx-list"), t.hasAttribute("data-dense") && t.classList.add("mtx-list--dense"), t.hasAttribute("data-nested") && t.classList.add("mtx-list--nested"), t.hasAttribute("data-disable-padding") && t.classList.add("mtx-list--disable-padding");
  }
}
const v = [
  ".mtx-list-item-icon",
  ".mtx-list-item-avatar",
  ".mtx-list-item-secondary-action",
  ".mtx-ripple-container",
  "[data-mtx]",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "ul",
  "ol",
  "nav"
].join(","), E = ["option", "tab", "treeitem", "gridcell", "row", "columnheader", "rowheader"];
function f(s) {
  const t = document.createElement("span");
  t.className = "mtx-list-item-icon";
  const i = document.createElement("span");
  return i.className = "material-icons", i.setAttribute("aria-hidden", "true"), i.textContent = s, t.appendChild(i), t;
}
function x(s, t, i, e) {
  const d = document.createElement("span");
  if (d.className = "mtx-list-item-text__primary", i !== null ? d.textContent = i : t.forEach((r) => d.appendChild(r)), s.appendChild(d), e) {
    const r = document.createElement("span");
    r.className = "mtx-list-item-text__secondary", r.textContent = e, s.appendChild(r);
  }
}
function h(s) {
  const t = s.getAttribute("data-icon");
  t && !s.querySelector(":scope > .mtx-list-item-icon") && s.insertBefore(f(t), s.firstChild);
  const i = s.getAttribute("data-avatar");
  if (i && !s.querySelector(":scope > .mtx-list-item-avatar")) {
    const a = document.createElement("span");
    a.className = "mtx-list-item-avatar";
    const n = document.createElement("span");
    n.setAttribute("data-mtx", "avatar"), n.setAttribute("data-src", i), n.setAttribute("data-alt", s.getAttribute("data-avatar-alt") || ""), a.appendChild(n), s.insertBefore(a, s.firstChild);
  }
  if (Array.from(s.children).forEach((a) => {
    if (a.matches('.mtx-avatar, [data-mtx="avatar"]')) {
      const n = document.createElement("span");
      n.className = "mtx-list-item-avatar", s.insertBefore(n, a), n.appendChild(a);
    }
  }), s.querySelector(":scope > .mtx-list-item-text")) return;
  const e = Array.from(s.childNodes).filter((a) => a.nodeType === Node.TEXT_NODE ? !0 : a.nodeType === Node.ELEMENT_NODE && !a.matches(v)), d = e.some((a) => a.textContent.trim() !== ""), r = s.getAttribute("data-primary"), m = s.getAttribute("data-secondary");
  if (!d && r === null && !m) return;
  const o = document.createElement("span");
  o.className = "mtx-list-item-text";
  const p = e.find((a) => a.textContent.trim() !== "") || Array.from(s.children).find((a) => !a.matches(".mtx-list-item-icon, .mtx-list-item-avatar")) || null;
  s.insertBefore(o, p), r !== null ? (e.forEach((a) => {
    a.textContent.trim() === "" && a.remove();
  }), x(o, [], r, m)) : x(o, e, null, m);
}
function u(s, t) {
  s.classList.toggle("mtx-list-item--selected", t);
  const i = s.getAttribute("role") || "";
  if (E.includes(i)) {
    s.setAttribute("aria-selected", String(t)), s.removeAttribute("aria-current");
    return;
  }
  s.removeAttribute("aria-selected"), t ? s.setAttribute("aria-current", s.tagName === "A" || i === "link" ? "page" : "true") : s.removeAttribute("aria-current");
}
class y extends l {
  /**
   * Crea una instancia del item.
   *
   * @param {HTMLElement} element Elemento `<li>` asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-list-item") || t.classList.add("mtx-list-item"), t.hasAttribute("data-disabled") && t.classList.add("mtx-list-item--disabled"), t.classList.contains("mtx-list-item--disabled") && !t.hasAttribute("aria-disabled") && t.setAttribute("aria-disabled", "true"), (t.hasAttribute("data-dense") || t.closest(".mtx-list--dense")) && t.classList.add("mtx-list-item--dense"), t.hasAttribute("data-disable-padding") && t.classList.add("mtx-list-item--disable-padding"), t.hasAttribute("data-align-start") && t.classList.add("mtx-list-item--align-start"), t.hasAttribute("data-divider") && t.classList.add("mtx-list-item--divider"), t.hasAttribute("data-disable-gutters") && t.classList.add("mtx-list-item--disable-gutters"), h(t);
  }
}
class C extends l {
  /**
   * Crea una instancia del item interactivo.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-list-item") || t.classList.add("mtx-list-item"), t.classList.contains("mtx-list-item-button") || t.classList.add("mtx-list-item-button"), this._isLink = t.tagName === "A", (t.hasAttribute("data-dense") || t.closest(".mtx-list--dense")) && t.classList.add("mtx-list-item--dense"), t.hasAttribute("data-disable-gutters") && t.classList.add("mtx-list-item--disable-gutters"), t.hasAttribute("data-divider") && t.classList.add("mtx-list-item--divider"), t.hasAttribute("data-align-start") && t.classList.add("mtx-list-item--align-start"), t.hasAttribute("data-disabled") && this.disable(), h(t), this._handlePointerDown = (i) => {
      this.disabled || i.button !== 0 || (i._mtxRippleHandled = !0, b(t, i));
    }, t.addEventListener("pointerdown", this._handlePointerDown), (t.hasAttribute("data-selected") || t.classList.contains("mtx-list-item--selected")) && u(t, !0), this._handleClick = (i) => {
      this.disabled && (i.preventDefault(), i.stopPropagation());
    }, t.addEventListener("click", this._handleClick);
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita el item interactivo. */
  disable() {
    this.element.classList.add("mtx-list-item--disabled"), "disabled" in this.element ? this.element.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.tabIndex = -1);
  }
  /** Habilita el item interactivo. */
  enable() {
    this.element.classList.remove("mtx-list-item--disabled"), "disabled" in this.element ? this.element.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.tabIndex = 0);
  }
  /** @returns {boolean} Estado seleccionado. */
  get selected() {
    return this.element.classList.contains("mtx-list-item--selected");
  }
  /** @param {boolean} value Nuevo estado seleccionado (sincroniza `aria-current` / `aria-selected`). */
  set selected(t) {
    u(this.element, !!t);
  }
  /**
   * Destruye la instancia.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
class _ extends l {
  /**
   * Crea una instancia de la subcabecera.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-list-subheader"), t.hasAttribute("data-inset") && t.classList.add("mtx-list-subheader--inset"), t.hasAttribute("data-sticky") && t.classList.add("mtx-list-subheader--sticky");
  }
}
class N extends l {
  /**
   * Crea una instancia del texto; envuelve el contenido en `__primary` si falta.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    if (super(t), t.classList.add("mtx-list-item-text"), t.querySelector(":scope > .mtx-list-item-text__primary")) return;
    const i = t.getAttribute("data-primary"), e = Array.from(t.childNodes);
    i !== null && e.forEach((d) => d.remove()), x(t, i !== null ? [] : e, i, t.getAttribute("data-secondary"));
  }
}
class S extends l {
  /**
   * Crea una instancia; con `data-icon` y sin contenido genera el Material Icon.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-list-item-icon");
    const i = t.getAttribute("data-icon");
    i && t.children.length === 0 && t.textContent.trim() === "" && t.appendChild(f(i).firstChild);
  }
}
class I extends l {
  /**
   * Crea una instancia del contenedor de avatar.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-list-item-avatar");
  }
}
class T extends l {
  /**
   * Crea una instancia de la acción secundaria.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-list-item-secondary-action");
  }
}
c("list", g);
c("list-item", y);
c("list-item-button", C);
c("list-item-text", N);
c("list-item-icon", S);
c("list-item-avatar", I);
c("list-item-secondary-action", T);
c("list-subheader", _);
typeof document < "u" && (document.addEventListener("pointerdown", (s) => {
  if (s._mtxRippleHandled || s.button !== 0) return;
  const t = s.target.closest('.mtx-list-item-button, [data-mtx="list-item-button"]');
  t && (t.classList.contains("mtx-list-item--disabled") || t.disabled || t.getAttribute("aria-disabled") === "true" || (s._mtxRippleHandled = !0, b(t, s)));
}), document.addEventListener("click", (s) => {
  const t = s.target.closest('.mtx-list-item-button, [data-mtx="list-item-button"]');
  if (!t || t.classList.contains("mtx-list-item--disabled") || t.disabled || t.getAttribute("aria-disabled") === "true" || t.hasAttribute("data-no-select") || t.getAttribute("data-selectable") === "false" || t.closest('[data-selectable="false"]'))
    return;
  const i = t.closest('.mtx-drawer, [data-mtx="drawer"], nav, [data-mtx="nav"]') || t.closest(".mtx-list:not(.mtx-list--nested)") || t.closest(".mtx-list") || t.parentElement;
  i && i.querySelectorAll('.mtx-list-item-button.mtx-list-item--selected, [data-mtx="list-item-button"].mtx-list-item--selected').forEach((e) => {
    e !== t && u(e, !1);
  }), u(t, !0), L(t, "mtx:list:select", { item: t }, { aliases: ["mtx-select"] });
}));
A();
export {
  g as List,
  y as ListItem,
  I as ListItemAvatar,
  C as ListItemButton,
  S as ListItemIcon,
  T as ListItemSecondaryAction,
  N as ListItemText,
  _ as ListSubheader,
  u as setListItemSelected
};
