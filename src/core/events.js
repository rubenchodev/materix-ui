/**
 * Utilidades de eventos de Materix UI.
 *
 * Convención: `mtx:{componente}:{acción}` (p. ej. `mtx:list:select`).
 * Los nombres antiguos se emiten como alias deprecados hasta la versión 1.0.
 */

/**
 * Emite un `CustomEvent` y, opcionalmente, sus alias deprecados con el mismo `detail`.
 *
 * @param {EventTarget} target Destino del evento.
 * @param {string} name Nombre canónico (`mtx:{componente}:{acción}`).
 * @param {*} [detail] Datos del evento.
 * @param {{aliases?: string[], bubbles?: boolean, cancelable?: boolean, composed?: boolean}} [options] Opciones.
 * @returns {boolean} `false` si el evento o algún alias cancelable fue cancelado.
 */
export function emit(target, name, detail, options = {}) {
  if (!target || typeof target.dispatchEvent !== 'function') return true;
  const {
    aliases = [],
    bubbles = true,
    cancelable = false,
    composed = false,
  } = options;
  const init = { bubbles, cancelable, composed };
  if (detail !== undefined) init.detail = detail;

  let allowed = target.dispatchEvent(new CustomEvent(name, init));
  aliases.forEach((alias) => {
    if (!alias || alias === name) return;
    if (!target.dispatchEvent(new CustomEvent(alias, init))) allowed = false;
  });
  return allowed;
}
