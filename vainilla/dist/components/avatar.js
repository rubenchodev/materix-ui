import "./avatar.css";
import { r as h, C as c, t as m, h as p, q as g } from "../chunks/core-CJdkPtZx.js";
class b extends c {
  /**
   * Crea una instancia del avatar.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-avatar") || t.classList.add("mtx-avatar");
    const a = t.querySelector("img"), i = t.getAttribute("data-src");
    if (a)
      this.img = a, t.hasAttribute("data-alt") && !a.hasAttribute("alt") && (a.alt = t.getAttribute("data-alt"));
    else if (i) {
      this.img = document.createElement("img"), this.img.alt = t.getAttribute("data-alt") || "";
      const e = t.getAttribute("data-srcset"), r = t.getAttribute("data-sizes");
      e && (this.img.srcset = e), r && (this.img.sizes = r), this.img.src = i, t.appendChild(this.img);
    } else
      t.classList.add("mtx-avatar--fallback");
    this.img && (this._handleImageError = () => {
      if (this.img.hidden = !0, t.classList.add("mtx-avatar--fallback"), !Array.from(t.childNodes).some(
        (r) => r !== this.img && r.textContent && r.textContent.trim()
      )) {
        const r = document.createElement("span");
        r.className = "mtx-avatar__fallback";
        const d = this.img.alt || t.getAttribute("data-alt") || "";
        r.textContent = d.trim().charAt(0).toUpperCase() || "●", t.appendChild(r);
      }
    }, this.img.addEventListener("error", this._handleImageError), this.img.complete && this.img.naturalWidth === 0 && this._handleImageError());
    const s = t.getAttribute("data-icon");
    if (s && !this.img && !t.querySelector(".material-icons") && !t.querySelector("svg")) {
      const e = document.createElement("span");
      e.className = "material-icons", e.setAttribute("aria-hidden", "true"), e.textContent = s, t.appendChild(e), t.classList.remove("mtx-avatar--fallback");
    }
    const l = t.getAttribute("data-variant");
    l && l !== "circular" && t.classList.add(`mtx-avatar--${l}`);
    const u = t.getAttribute("data-color");
    u && t.classList.add(`mtx-avatar--${u}`);
    const o = t.getAttribute("data-size");
    o && (o === "small" ? t.classList.add("mtx-avatar--small") : o === "medium" ? t.classList.add("mtx-avatar--medium") : o === "large" ? t.classList.add("mtx-avatar--large") : isNaN(Number(o)) || (t.style.width = t.style.height = `${o}px`, t.style.fontSize = `${Math.round(Number(o) * 0.45)}px`));
  }
  /** Elimina el listener de error de imagen. */
  destroy() {
    this.img && this._handleImageError && this.img.removeEventListener("error", this._handleImageError), super.destroy();
  }
}
class x extends c {
  /**
   * Crea un grupo de avatares.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-avatar-group"), t.hasAttribute("data-label") && !t.hasAttribute("aria-label") && t.setAttribute("aria-label", t.getAttribute("data-label")), this._max = this._readInteger("data-max", 5, 2), this._total = this._readInteger("data-total", null, 0), this._applySpacing(t.getAttribute("data-spacing") || "medium"), this.refresh();
  }
  /** @returns {number} Máximo de avatares visibles, incluido el excedente. */
  get max() {
    return this._max;
  }
  /** @param {number} value Nuevo máximo visible. */
  set max(t) {
    this._max = Math.max(2, Number.parseInt(t, 10) || 5), this.element.setAttribute("data-max", String(this._max)), this.refresh();
  }
  /** @returns {number} Total lógico de avatares. */
  get total() {
    return Math.max(this._total ?? 0, this._getAvatars().length);
  }
  /** @param {number|null} value Nuevo total lógico. */
  set total(t) {
    t == null ? (this._total = null, this.element.removeAttribute("data-total")) : (this._total = Math.max(0, Number.parseInt(t, 10) || 0), this.element.setAttribute("data-total", String(this._total))), this.refresh();
  }
  /** Recalcula avatares visibles e indicador de excedente. */
  refresh() {
    this._surplus && this._surplus.remove(), this._surplus = null;
    const t = this._getAvatars();
    t.forEach((l) => {
      l.hidden = !1;
    });
    const a = Math.max(this._total ?? t.length, t.length);
    if (a <= this._max) return;
    const i = Math.max(1, this._max - 1);
    t.slice(i).forEach((l) => {
      l.hidden = !0;
    });
    const s = a - i;
    this._surplus = document.createElement("span"), this._surplus.className = "mtx-avatar mtx-avatar--surplus", this._surplus.textContent = `+${s}`, this._surplus.setAttribute("aria-label", this._surplusLabel(s)), this.element.appendChild(this._surplus);
  }
  /** Restaura todos los avatares del grupo. */
  destroy() {
    this._surplus && this._surplus.remove(), this._getAvatars().forEach((t) => {
      t.hidden = !1;
    }), this.element.style.removeProperty("--mtx-avatar-group-overlap"), super.destroy();
  }
  /** @returns {HTMLElement[]} Avatares originales del grupo. */
  _getAvatars() {
    return Array.from(this.element.children).filter((t) => (t.classList.contains("mtx-avatar") || t.getAttribute("data-mtx") === "avatar") && !t.classList.contains("mtx-avatar--surplus"));
  }
  /**
   * Lee un entero acotado desde el elemento.
   *
   * @param {string} name Nombre del atributo.
   * @param {number|null} fallback Valor alternativo.
   * @param {number} minimum Mínimo permitido.
   * @returns {number|null} Entero normalizado.
   */
  _readInteger(t, a, i) {
    if (!this.element.hasAttribute(t)) return a;
    const s = Number.parseInt(this.element.getAttribute(t), 10);
    return Number.isFinite(s) ? Math.max(i, s) : a;
  }
  /** @param {string} spacing Espaciado MUI o valor numérico en píxeles. */
  _applySpacing(t) {
    const a = { small: 16, medium: 8 }, i = Number.parseFloat(t), s = Object.prototype.hasOwnProperty.call(a, t) ? a[t] : Math.max(0, i || 0);
    this.element.style.setProperty("--mtx-avatar-group-overlap", `${s}px`);
  }
  /** @param {number} surplus Cantidad excedente. @returns {string} Etiqueta accesible. */
  _surplusLabel(t) {
    return (this.element.getAttribute("data-surplus-label") || m("avatarGroup", "surplus", null, "{count} more", p(this.element))).replace("{count}", String(t));
  }
}
h("avatar", b);
h("avatar-group", x);
g();
export {
  b as Avatar,
  x as AvatarGroup
};
