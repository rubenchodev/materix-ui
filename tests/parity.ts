/**
 * Paridad de DOM entre los componentes React y Materix UI vanilla (`@rubenchodev/materix-ui`).
 *
 * Uso:
 * ```tsx
 * const vanilla = await mountVanilla('<button class="mtx-button mtx-button--contained" data-mtx="button">OK</button>');
 * const { container } = render(<Button variant="contained">OK</Button>);
 * expectParity(container.firstElementChild!, vanilla.firstElementChild!);
 * ```
 *
 * El ripple (`.mtx-ripple-container`) se excluye por defecto; para excluir más nodos usa
 * `ignoreSelectors`, y para comparar atributos extra (p. ej. `tabindex`) usa `attributes`.
 */
import { onTestFinished } from 'vitest';

type VanillaModule = typeof import('@rubenchodev/materix-ui');

let vanillaPromise: Promise<VanillaModule> | null = null;

/**
 * Importa el bundle vanilla una sola vez. Al cargarse ejecuta `initAll(document)` y arranca su API
 * de tema (observa `<html data-mtx-theme>`); por eso los contenedores se insertan después del import.
 * @returns {Promise<VanillaModule>} Módulo vanilla.
 */
export function loadVanilla(): Promise<VanillaModule> {
  if (!vanillaPromise) vanillaPromise = import('@rubenchodev/materix-ui');
  return vanillaPromise;
}

/**
 * Inserta HTML vanilla en un contenedor del `<body>` y lo inicializa con `initAll(container)`.
 * El contenedor se destruye y retira al terminar el test.
 * @param {string} html Marcado con `data-mtx`.
 * @returns {Promise<HTMLElement>} Contenedor inicializado.
 */
export async function mountVanilla(html: string): Promise<HTMLElement> {
  const mtx = await loadVanilla();
  const container = document.createElement('div');
  container.setAttribute('data-parity', 'vanilla');
  document.body.appendChild(container);
  container.innerHTML = html;
  mtx.initAll(container);
  onTestFinished(() => {
    try {
      mtx.destroyAll(container);
    } finally {
      container.remove();
    }
  });
  return container;
}

/** Nodo normalizado del árbol de estructura. */
export interface StructureNode {
  tag: string;
  classes: string[];
  attrs: Record<string, string>;
  children: Array<StructureNode | string>;
}

/** Opciones de {@link structure} y {@link expectParity}. */
export interface StructureOptions {
  /** Prefijos de clase a comparar (por defecto `['mtx-']`). */
  classPrefixes?: string[];
  /** Atributos adicionales a comparar (`tabindex`, `data-*`, `href`…). */
  attributes?: string[];
  /** Atributos a ignorar además de los de por defecto (p. ej. `aria-hidden`). */
  ignoreAttributes?: string[];
  /** Nodos a excluir (con sus hijos). Se suman a `.mtx-ripple-container`. */
  ignoreSelectors?: string[];
  /** Compara el ripple (desactiva la exclusión por defecto). */
  keepRipple?: boolean;
  /** Compara el texto de los nodos (normalizado). Por defecto `true`. */
  text?: boolean;
}

/** Atributos que se comparan siempre (además de `aria-*`). */
const BASE_ATTRIBUTES = ['role', 'type', 'disabled'];

/** Atributos ARIA que referencian ids generados y se ignoran. */
const ID_REFERENCE_ATTRIBUTES = [
  'aria-controls',
  'aria-labelledby',
  'aria-describedby',
  'aria-owns',
  'aria-activedescendant',
  'aria-errormessage',
  'aria-details',
  'aria-flowto',
];

/** Nodos excluidos por defecto: el ripple solo existe tras `pointerdown` en vanilla. */
export const DEFAULT_IGNORED_SELECTORS = ['.mtx-ripple-container'];

/**
 * Árbol normalizado de un elemento: tag, clases con prefijo ordenadas, `role`, `aria-*`, `type`,
 * `disabled` y texto no vacío. Ignora ids, estilos, `data-*` y referencias ARIA a ids.
 * @param {Element} el Elemento raíz.
 * @param {StructureOptions} [opts] Opciones.
 * @returns {StructureNode} Árbol.
 */
export function structure(el: Element, opts: StructureOptions = {}): StructureNode {
  const prefixes = opts.classPrefixes ?? ['mtx-'];
  const extra = new Set((opts.attributes ?? []).map((a) => a.toLowerCase()));
  const ignored = new Set([...ID_REFERENCE_ATTRIBUTES, ...(opts.ignoreAttributes ?? []).map((a) => a.toLowerCase())]);
  const selectors = [...(opts.keepRipple ? [] : DEFAULT_IGNORED_SELECTORS), ...(opts.ignoreSelectors ?? [])];
  const compareText = opts.text !== false;

  const keepAttr = (name: string) =>
    !ignored.has(name) && (BASE_ATTRIBUTES.includes(name) || name.startsWith('aria-') || extra.has(name));

  const walk = (node: Element): StructureNode => {
    const attrs: Record<string, string> = {};
    Array.from(node.attributes)
      .map((a) => a.name.toLowerCase())
      .filter(keepAttr)
      .sort()
      .forEach((name) => {
        // `disabled` es booleano: se normaliza su valor.
        attrs[name] = name === 'disabled' ? 'true' : node.getAttribute(name) ?? '';
      });
    const children: Array<StructureNode | string> = [];
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as Element;
        if (selectors.some((sel) => element.matches(sel))) return;
        children.push(walk(element));
      } else if (compareText && child.nodeType === Node.TEXT_NODE) {
        const text = (child.textContent ?? '').replace(/\s+/g, ' ').trim();
        if (!text) return;
        // Une textos adyacentes (React y el HTML pueden partirlos distinto).
        const last = children[children.length - 1];
        if (typeof last === 'string') children[children.length - 1] = `${last} ${text}`;
        else children.push(text);
      }
    });
    const classes = Array.from(node.classList)
      .filter((c) => prefixes.some((p) => c.startsWith(p)))
      .sort();
    return { tag: node.tagName.toLowerCase(), classes, attrs, children };
  };

  return walk(el);
}

/**
 * Serializa un árbol en líneas indentadas legibles.
 * @param {StructureNode} node Árbol.
 * @param {number} [depth=0] Profundidad.
 * @returns {string} Texto.
 */
export function printStructure(node: StructureNode | string, depth = 0): string {
  const pad = '  '.repeat(depth);
  if (typeof node === 'string') return `${pad}"${node}"`;
  const cls = node.classes.length ? `.${node.classes.join('.')}` : '';
  const attrs = Object.entries(node.attrs).map(([k, v]) => ` ${k}="${v}"`).join('');
  const head = `${pad}<${node.tag}${cls}${attrs}>`;
  return [head, ...node.children.map((child) => printStructure(child, depth + 1))].join('\n');
}

/**
 * Diff línea a línea (LCS): `-` solo en vanilla, `+` solo en React, ` ` común.
 * @param {string} expected Texto vanilla.
 * @param {string} actual Texto React.
 * @returns {string} Diff legible.
 */
export function diffLines(expected: string, actual: string): string {
  const a = expected.split('\n');
  const b = actual.split('\n');
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const out: string[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      out.push(`  ${a[i]}`);
      i++;
      j++;
    } else if (j < b.length && (i >= a.length || lcs[i][j + 1] >= lcs[i + 1][j])) {
      out.push(`+ ${b[j++]}`);
    } else {
      out.push(`- ${a[i++]}`);
    }
  }
  return out.join('\n');
}

/**
 * Comprueba que React y vanilla producen la misma estructura; si no, falla con un diff línea a línea.
 * @param {Element} reactRoot Raíz renderizada por React.
 * @param {Element} vanillaRoot Raíz inicializada por vanilla.
 * @param {StructureOptions} [opts] Opciones de {@link structure}.
 * @throws {Error} Si las estructuras difieren (mensaje con `- vanilla` / `+ React`).
 */
export function expectParity(reactRoot: Element | null | undefined, vanillaRoot: Element | null | undefined, opts: StructureOptions = {}): void {
  if (!reactRoot) throw new Error('expectParity: falta la raíz de React.');
  if (!vanillaRoot) throw new Error('expectParity: falta la raíz vanilla.');
  const react = printStructure(structure(reactRoot, opts));
  const vanilla = printStructure(structure(vanillaRoot, opts));
  if (react === vanilla) return;
  throw new Error(`Paridad DOM: React difiere de vanilla (- vanilla, + React)\n${diffLines(vanilla, react)}`);
}
