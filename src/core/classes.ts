/**
 * Generación de clases CSS BEM comunes a todos los componentes.
 */

/** Valor aceptado por `cx`: las cadenas se concatenan y los falsy se ignoran. */
export type ClassValue = string | false | null | undefined | 0;

/**
 * Concatena nombres de clase ignorando valores falsy.
 * @param {...ClassValue} args Clases.
 * @returns {string} Clases separadas por espacio.
 */
export function cx(...args: ClassValue[]): string {
  let out = '';
  for (const arg of args) {
    if (!arg) continue;
    const value = String(arg).trim();
    if (value) out = out ? `${out} ${value}` : value;
  }
  return out;
}

/** Modificadores: `true` → `--clave`; cadena → `--valor`; falsy se ignora. */
export type ClassModifiers = Record<string, boolean | string | null | undefined>;

/**
 * Genera el bloque BEM con sus modificadores (`mtxClasses('button', { contained: true, size: 'small' })`
 * → `'mtx-button mtx-button--contained mtx-button--small'`).
 * @param {string} block Bloque, con o sin prefijo `mtx-`.
 * @param {ClassModifiers} [modifiers] Modificadores.
 * @returns {string} Clases.
 */
export function mtxClasses(block: string, modifiers: ClassModifiers = {}): string {
  const base = block.startsWith('mtx-') ? block : `mtx-${block}`;
  const classes = [base];
  for (const [key, value] of Object.entries(modifiers)) {
    if (value === true) classes.push(`${base}--${key}`);
    else if (typeof value === 'string' && value) classes.push(`${base}--${value}`);
  }
  return classes.join(' ');
}
