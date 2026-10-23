import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentBase } from '../src/core/component-base.js';
import {
  registerComponent,
  getInstance,
  destroy,
  destroyAll,
  init,
  initAll,
  registerHomeNode,
} from '../src/core/registry.js';
import { addModal, removeModal, hasOpenModal, isTopModal } from '../src/core/modal-manager.js';
import { createRipple } from '../src/core/ripple.js';
import { transitionFade, transitionCollapse, transitionGrow } from '../src/core/transition.js';
import { onClickAway } from '../src/core/click-away-listener.js';
import { createPortal } from '../src/core/portal.js';
import { theme } from '../src/core/theme.js';

/** Espera a que los MutationObserver procesen los cambios. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/** Componente de prueba que cuenta clics con un listener en `document`. */
class Counter extends ComponentBase {
  constructor(element) {
    super(element);
    this.clicks = 0;
    this.listen(document, 'click', () => { this.clicks += 1; });
  }
}
registerComponent('core-hardening-counter', Counter);

/** Componente cuyo destroy() lanza. */
class Broken extends ComponentBase {
  destroy() {
    throw new Error('boom');
  }
}
registerComponent('core-hardening-broken', Broken);

describe('ComponentBase: doble construcción', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('new X(el) dos veces destruye la instancia previa (sin listeners duplicados)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const first = new Counter(el);
    const second = new Counter(el);
    expect(first.destroyed).toBe(true);
    expect(getInstance(el)).toBe(second);
    expect(el.hasAttribute('data-mtx-initialized')).toBe(true);
    document.body.click();
    expect(first.clicks).toBe(0);
    expect(second.clicks).toBe(1);
    second.destroy();
  });

  it('una subclase sobre una instancia de su clase base (y al revés) destruye la previa', () => {
    class SpecialCounter extends Counter {}
    const el = document.createElement('div');
    document.body.appendChild(el);
    const base = new Counter(el);
    const special = new SpecialCounter(el);
    expect(base.destroyed).toBe(true);
    expect(getInstance(el)).toBe(special);
    const again = new Counter(el);
    expect(special.destroyed).toBe(true);
    document.body.click();
    expect(base.clicks + special.clicks).toBe(0);
    expect(again.clicks).toBe(1);
    again.destroy();
  });

  it('dos componentes hermanos (misma base intermedia) no se destruyen entre sí', () => {
    class Base extends ComponentBase {}
    class A extends Base {}
    class B extends Base {}
    const el = document.createElement('div');
    const a = new A(el);
    const b = new B(el);
    expect(a.destroyed).toBeUndefined();
    expect(getInstance(el)).toBe(b);
    a.destroy();
    b.destroy();
  });

  it('conserva instancias de otra clase sobre el mismo elemento', () => {
    class Other extends ComponentBase {}
    const el = document.createElement('div');
    const counter = new Counter(el);
    const other = new Other(el);
    expect(counter.destroyed).toBeUndefined();
    expect(getInstance(el)).toBe(other);
    counter.destroy();
    other.destroy();
  });
});

describe('registry: robustez', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('init(null) e initAll(null) son no-ops seguros', () => {
    expect(init(null)).toBeNull();
    expect(init(undefined, 'button')).toBeNull();
    expect(() => initAll(null)).not.toThrow();
    expect(destroyAll(null)).toBe(0);
  });

  it('destroy() desvincula la instancia aunque destroy de la subclase lance', () => {
    const el = document.createElement('div');
    el.setAttribute('data-mtx', 'core-hardening-broken');
    document.body.appendChild(el);
    initAll();
    expect(getInstance(el)).toBeInstanceOf(Broken);
    expect(() => destroy(el)).toThrow('boom');
    expect(getInstance(el)).toBeUndefined();
    expect(el.hasAttribute('data-mtx-initialized')).toBe(false);
  });

  it('destroyAll() continúa aunque una instancia lance', () => {
    document.body.innerHTML = '<div data-mtx="core-hardening-broken"></div><div data-mtx="core-hardening-counter"></div>';
    initAll();
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const [broken, counter] = document.body.children;
    const counterInstance = getInstance(counter);
    expect(destroyAll(document)).toBe(2);
    expect(getInstance(broken)).toBeUndefined();
    expect(counterInstance.destroyed).toBe(true);
    errors.mockRestore();
  });

  it('initAll hace una sola pasada si hay data-mtx no registrados', () => {
    document.body.innerHTML = '<div data-mtx="not-registered-xyz"></div><div data-mtx="core-hardening-counter"></div>';
    const spy = vi.spyOn(document, 'querySelectorAll');
    initAll(document);
    // 1.ª pasada inicializa el contador; la 2.ª no crea nada nuevo y corta.
    expect(spy.mock.calls.filter(([sel]) => sel.includes(':not([data-mtx-initialized])')).length).toBe(2);
    spy.mockRestore();
    destroyAll(document);
  });

  it('destroyAll(contenedor) sigue destruyendo instancias portadas por su nodo de origen', () => {
    const container = document.createElement('section');
    const marker = document.createComment('home');
    container.appendChild(marker);
    document.body.appendChild(container);
    const portaled = document.createElement('div');
    document.body.appendChild(portaled);
    const instance = new Counter(portaled);
    registerHomeNode(instance, marker);
    expect(destroyAll(container)).toBe(1);
    expect(instance.destroyed).toBe(true);
    // Ya liberada: un segundo recorrido no la vuelve a contar.
    expect(destroyAll(container)).toBe(0);
  });
});

describe('modal-manager', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('removeModal de un elemento no registrado no pisa el overflow del autor', () => {
    document.body.style.overflow = 'scroll';
    removeModal(document.createElement('div'));
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('restaura el overflow previo al cerrar el último modal', () => {
    document.body.style.overflow = 'auto';
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);
    addModal(a);
    addModal(b);
    expect(document.body.style.overflow).toBe('hidden');
    expect(isTopModal(b)).toBe(true);
    removeModal(b);
    expect(document.body.style.overflow).toBe('hidden');
    removeModal(a);
    expect(document.body.style.overflow).toBe('auto');
  });

  it('libera el bloqueo de scroll si el modal se elimina del DOM sin cerrarse', async () => {
    const dialog = document.createElement('div');
    document.body.appendChild(dialog);
    addModal(dialog);
    expect(hasOpenModal()).toBe(true);
    dialog.remove();
    await flush();
    expect(document.body.style.overflow).toBe('');
    expect(hasOpenModal()).toBe(false);
  });

  it('purga modales desconectados al consultar la pila', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);
    addModal(a);
    addModal(b);
    b.remove();
    expect(isTopModal(a)).toBe(true);
    removeModal(a);
    expect(document.body.style.overflow).toBe('');
  });
});

describe('ripple', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('retira los tres listeners de fin de gesto cuando se dispara uno', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    const removeSpy = vi.spyOn(button, 'removeEventListener');
    createRipple(button, new MouseEvent('pointerdown', { clientX: 1, clientY: 1 }));
    button.dispatchEvent(new Event('pointerup'));
    const removed = removeSpy.mock.calls.map(([type]) => type);
    expect(removed).toEqual(expect.arrayContaining(['pointerup', 'pointercancel', 'pointerleave']));
    removeSpy.mockRestore();
  });

  it('elimina el nodo aunque no llegue animationend', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    createRipple(button, new MouseEvent('pointerdown'));
    expect(button.querySelectorAll('.mtx-ripple').length).toBe(1);
    button.dispatchEvent(new Event('pointerup'));
    vi.advanceTimersByTime(600);
    expect(button.querySelector('.mtx-ripple--finishing')).not.toBeNull();
    vi.advanceTimersByTime(1200);
    expect(button.querySelectorAll('.mtx-ripple').length).toBe(0);
  });
});

describe('transition', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('fade limpia las clases previas y marca entered/exited al terminar', async () => {
    const el = document.createElement('div');
    const done = transitionFade(el, true, 100);
    expect(el.classList.contains('mtx-transition--entering')).toBe(true);
    vi.advanceTimersByTime(100);
    await expect(done).resolves.toBe(true);
    expect(el.className).toBe('mtx-transition--entered');
    const out = transitionFade(el, false, 100);
    expect(el.className).toBe('mtx-transition--exiting');
    vi.advanceTimersByTime(100);
    await out;
    expect(el.className).toBe('mtx-transition--exited');
  });

  it('una transición nueva cancela la anterior (su promesa resuelve false)', async () => {
    const el = document.createElement('div');
    const enter = transitionGrow(el, true, { duration: 200 });
    vi.advanceTimersByTime(50);
    const exit = transitionGrow(el, false, { duration: 200 });
    await expect(enter).resolves.toBe(false);
    vi.advanceTimersByTime(200);
    await expect(exit).resolves.toBe(true);
    expect(el.classList.contains('mtx-transition--entered')).toBe(false);
    expect(el.classList.contains('mtx-transition--exited')).toBe(true);
  });

  it('collapse deja height: auto al terminar la entrada', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.className = 'mtx-transition--exited';
    const done = transitionCollapse(el, true, 100);
    expect(el.classList.contains('mtx-transition--exited')).toBe(false);
    vi.advanceTimersByTime(100);
    await done;
    expect(el.style.height).toBe('auto');
  });
});

describe('click-away', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('en táctil notifica una sola vez (ignora el mousedown sintético)', () => {
    const inside = document.createElement('div');
    const outside = document.createElement('div');
    document.body.append(inside, outside);
    const onClose = vi.fn();
    const off = onClickAway(inside, onClose);
    outside.dispatchEvent(new Event('touchstart', { bubbles: true }));
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
    off();
  });

  it('sigue reaccionando a mousedown sin táctil previo', () => {
    const inside = document.createElement('div');
    document.body.appendChild(inside);
    const onClose = vi.fn();
    const off = onClickAway(inside, onClose);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    inside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
    off();
  });
});

describe('portal', () => {
  it('restaura el nodo en su posición original', () => {
    document.body.innerHTML = '<ul><li id="a"></li><li id="b"></li><li id="c"></li></ul>';
    const b = document.getElementById('b');
    const restore = createPortal(b);
    expect(b.parentElement).toBe(document.body);
    restore();
    expect(Array.from(document.querySelector('ul').children).map((li) => li.id)).toEqual(['a', 'b', 'c']);
  });

  it('si el hermano ya no está, lo añade al final del padre', () => {
    document.body.innerHTML = '<ul><li id="a"></li><li id="b"></li><li id="c"></li></ul>';
    const b = document.getElementById('b');
    const restore = createPortal(b);
    document.getElementById('c').remove();
    restore();
    expect(document.querySelector('ul').lastElementChild).toBe(b);
  });
});

describe('theme: cambios manuales de data-mtx-theme', () => {
  const root = document.documentElement;
  beforeEach(() => {
    theme.configure({ persist: false, query: false });
    theme.set('light');
  });

  it('en modo system, escribir a mano el mismo tema resuelto fija el modo explícito', async () => {
    theme.set('system');
    await flush();
    const resolved = theme.get();
    expect(theme.getMode()).toBe('system');
    root.setAttribute('data-mtx-theme', resolved);
    await flush();
    expect(theme.getMode()).toBe(resolved);
    expect(root.getAttribute('data-mtx-theme-mode')).toBe(resolved);
  });

  it('las escrituras propias no se tratan como externas', async () => {
    const handler = vi.fn();
    document.addEventListener('mtx:theme:change', handler);
    theme.set('dark');
    await flush();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(theme.getMode()).toBe('dark');
    document.removeEventListener('mtx:theme:change', handler);
  });

  it('un cambio externo pendiente se procesa antes de una escritura propia', async () => {
    const handler = vi.fn();
    document.addEventListener('mtx:theme:change', handler);
    root.setAttribute('data-mtx-theme', 'dark');
    theme.set('light');
    await flush();
    expect(theme.get()).toBe('light');
    expect(root.getAttribute('data-mtx-theme')).toBe('light');
    expect(handler).toHaveBeenCalledTimes(2);
    document.removeEventListener('mtx:theme:change', handler);
  });
});
