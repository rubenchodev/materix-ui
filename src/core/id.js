/**
 * Generador global de identificadores únicos de Materix UI.
 */

let counter = 0;

/**
 * Genera un id único en el documento con el prefijo indicado.
 *
 * @param {string} [prefix='mtx'] Prefijo del id.
 * @returns {string} Id que no existe aún en el documento.
 */
export function uniqueId(prefix = 'mtx') {
  let id;
  do {
    counter += 1;
    id = `${prefix}-${counter}`;
  } while (typeof document !== 'undefined' && document.getElementById(id));
  return id;
}
