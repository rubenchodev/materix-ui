import { render } from '@testing-library/react';
import { expectParity, mountVanilla, printStructure, structure } from './parity';

describe('parity helper', () => {
  it('Button contained escrito en JSX equivale al vanilla inicializado', async () => {
    const vanilla = await mountVanilla(
      '<button class="mtx-button mtx-button--contained" data-mtx="button">Guardar</button>',
    );
    const { container } = render(<button className="mtx-button mtx-button--contained">Guardar</button>);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('Button con data-start-icon: el icono generado por vanilla coincide con el JSX', async () => {
    const vanilla = await mountVanilla(
      '<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="save" data-size="small">Guardar</button>',
    );
    const { container } = render(
      <button className="mtx-button mtx-button--outlined mtx-button--small">
        <span className="mtx-button__icon mtx-button__icon--start material-icons" aria-hidden="true">save</span>
        Guardar
      </button>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild);
    // `material-icons` no lleva prefijo mtx-: se compara añadiendo el prefijo.
    expectParity(container.firstElementChild, vanilla.firstElementChild, { classPrefixes: ['mtx-', 'material-'] });
  });

  it('el ripple se excluye por defecto (keepRipple lo vuelve a comparar)', async () => {
    const vanilla = await mountVanilla('<button class="mtx-button mtx-button--text" data-mtx="button">Ok</button>');
    const button = vanilla.firstElementChild as HTMLButtonElement;
    button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 4, clientY: 4 }));
    expect(button.querySelector('.mtx-ripple-container')).not.toBeNull();

    const { container } = render(<button className="mtx-button mtx-button--text">Ok</button>);
    expectParity(container.firstElementChild, button);
    expect(() => expectParity(container.firstElementChild, button, { keepRipple: true })).toThrow();
    // Alternativa explícita: ignoreSelectors.
    expectParity(container.firstElementChild, button, { keepRipple: true, ignoreSelectors: ['.mtx-ripple-container'] });
  });

  it('falla con un diff legible cuando difieren clases o ARIA', async () => {
    const vanilla = await mountVanilla('<button class="mtx-button mtx-button--contained" data-mtx="button" disabled>X</button>');
    const { container } = render(<button className="mtx-button mtx-button--outlined">X</button>);
    let message = '';
    try {
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    } catch (error) {
      message = String((error as Error).message);
    }
    expect(message).toContain('Paridad DOM');
    expect(message).toContain('- <button.mtx-button.mtx-button--contained disabled="true">');
    expect(message).toContain('+ <button.mtx-button.mtx-button--outlined>');
    expect(message).toContain('    "X"');
  });

  it('structure normaliza: ignora ids, estilos, data-*, referencias ARIA y texto vacío', () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div id="a1" class="z mtx-b mtx-a" style="color:red" data-x="1" role="group"
           aria-labelledby="a2" aria-expanded="false" tabindex="0">
        <span class="mtx-c">  hola   mundo </span>
        <input type="checkbox" disabled aria-describedby="h1">
      </div>`;
    const tree = structure(el.firstElementChild!);
    expect(tree).toEqual({
      tag: 'div',
      classes: ['mtx-a', 'mtx-b'],
      attrs: { 'aria-expanded': 'false', role: 'group' },
      children: [
        { tag: 'span', classes: ['mtx-c'], attrs: {}, children: ['hola mundo'] },
        { tag: 'input', classes: [], attrs: { disabled: 'true', type: 'checkbox' }, children: [] },
      ],
    });
    const withExtra = structure(el.firstElementChild!, { attributes: ['tabindex'], ignoreAttributes: ['aria-expanded'], text: false });
    expect(withExtra.attrs).toEqual({ role: 'group', tabindex: '0' });
    expect((withExtra.children[0] as { children: unknown[] }).children).toEqual([]);
    expect(printStructure(tree)).toContain('<div.mtx-a.mtx-b aria-expanded="false" role="group">');
  });
});
