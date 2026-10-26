import type { ReactElement } from 'react';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from '../../i18n';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Chip } from './index';

describe('Chip', () => {
  it('renderiza el label en .mtx-chip__label sin rol ni tabindex', () => {
    const { container } = render(<Chip label="JavaScript" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('mtx-chip');
    expect(root.querySelector('.mtx-chip__label')).toHaveTextContent('JavaScript');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root.querySelector('.mtx-chip__delete')).toBeNull();
  });

  it('usa children cuando no hay label', () => {
    render(<Chip>React</Chip>);
    expect(screen.getByText('React')).toHaveClass('mtx-chip__label');
  });

  it('aplica variante, tamaño y color (sin modificadores para los valores por defecto)', () => {
    const { container, rerender } = render(<Chip label="A" variant="outlined" size="small" color="primary" />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('mtx-chip--outlined', 'mtx-chip--small', 'mtx-chip--primary');
    rerender(<Chip label="A" variant="filled" size="medium" color="default" />);
    expect(root.className).toBe('mtx-chip');
  });

  it('concatena className y reenvía ref y atributos', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<Chip ref={ref} label="A" className="extra" id="c1" data-x="1" />);
    const root = container.firstElementChild!;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('mtx-chip', 'extra');
    expect(root).toHaveAttribute('id', 'c1');
    expect(root).toHaveAttribute('data-x', '1');
  });

  it('icon como nombre genera span.material-icons; como nodo recibe mtx-chip__icon', () => {
    const { container, rerender } = render(<Chip label="A" icon="code" />);
    const icon = container.querySelector('.mtx-chip__icon')!;
    expect(icon).toHaveClass('material-icons');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveTextContent('code');
    rerender(<Chip label="A" icon={<svg data-testid="svg" />} />);
    expect(screen.getByTestId('svg')).toHaveClass('mtx-chip__icon');
  });

  it('avatar recibe la clase mtx-chip__avatar y va antes del icono y el label', () => {
    const { container } = render(
      <Chip label="Jane" icon="star" avatar={<span className="mtx-avatar mtx-avatar--small">J</span>} />,
    );
    const children = Array.from(container.firstElementChild!.children);
    expect(children[0]).toHaveClass('mtx-avatar', 'mtx-chip__avatar');
    expect(children[1]).toHaveClass('mtx-chip__icon');
    expect(children[2]).toHaveClass('mtx-chip__label');
  });

  it('clickable: role=button, tabindex=0, clase e onClick con clic, Enter y Espacio', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Chip label="Filtro" onClick={onClick} />);
    const chip = screen.getByRole('button', { name: 'Filtro' });
    expect(chip).toHaveClass('mtx-chip--clickable');
    expect(chip).toHaveAttribute('tabindex', '0');
    await user.click(chip);
    chip.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('clickable={false} ignora onClick', async () => {
    const onClick = vi.fn();
    const { container } = render(<Chip label="A" clickable={false} onClick={onClick} />);
    await userEvent.click(container.firstElementChild!);
    expect(onClick).not.toHaveBeenCalled();
    expect(container.firstElementChild).not.toHaveClass('mtx-chip--clickable');
  });

  it('deletable: icono no enfocable con title i18n y aria-keyshortcuts', () => {
    const { container } = render(<Chip label="A" onDelete={() => {}} />);
    const root = container.firstElementChild!;
    const del = root.querySelector('.mtx-chip__delete')!;
    expect(del.tagName).toBe('SPAN');
    expect(del).toHaveAttribute('aria-hidden', 'true');
    expect(del).toHaveAttribute('title', 'Delete');
    expect(del).not.toHaveAttribute('tabindex');
    expect(del.querySelector('svg')).not.toBeNull();
    expect(root).toHaveAttribute('role', 'button');
    expect(root).toHaveAttribute('tabindex', '0');
    expect(root).toHaveAttribute('aria-keyshortcuts', 'Delete Backspace');
    expect(root).not.toHaveClass('mtx-chip--clickable');
    expect(root.querySelector('button, a[href], input, [tabindex]')).toBeNull();
  });

  it('deleteLabel, deleteIcon y locale personalizan el borrado', () => {
    const { container, rerender } = render(
      <Chip label="A" onDelete={() => {}} deleteLabel="Quitar A" deleteIcon={<span className="material-icons">close</span>} />,
    );
    const del = container.querySelector('.mtx-chip__delete')!;
    expect(del).toHaveAttribute('title', 'Quitar A');
    expect(del).toHaveTextContent('close');
    rerender(<Chip label="A" onDelete={() => {}} locale="es" />);
    expect(container.querySelector('.mtx-chip__delete')).toHaveAttribute('title', 'Eliminar');
    rerender(
      <I18nProvider locale="es">
        <Chip label="A" onDelete={() => {}} />
      </I18nProvider>,
    );
    expect(container.querySelector('.mtx-chip__delete')).toHaveAttribute('title', 'Eliminar');
  });

  it('clic en el icono de borrado llama a onDelete y no a onClick', async () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(<Chip label="A" onClick={onClick} onDelete={onDelete} />);
    await userEvent.click(container.querySelector('.mtx-chip__delete')!);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('Delete y Backspace sobre el chip llaman a onDelete; Escape quita el foco', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Chip label="A" onDelete={onDelete} />);
    const chip = screen.getByRole('button');
    chip.focus();
    await user.keyboard('{Delete}');
    await user.keyboard('{Backspace}');
    expect(onDelete).toHaveBeenCalledTimes(2);
    await user.keyboard('{Escape}');
    expect(chip).not.toHaveFocus();
  });

  it('disabled: clase, aria-disabled, tabindex -1 y sin callbacks', () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(<Chip label="A" disabled onClick={onClick} onDelete={onDelete} />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('mtx-chip--disabled');
    expect(root).toHaveAttribute('aria-disabled', 'true');
    expect(root).toHaveAttribute('tabindex', '-1');
    fireEvent.click(root);
    fireEvent.click(root.querySelector('.mtx-chip__delete')!);
    fireEvent.keyDown(root, { key: 'Delete' });
    fireEvent.keyDown(root, { key: 'Enter' });
    expect(onClick).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('disabled sin interacción no añade tabindex', () => {
    const { container } = render(<Chip label="A" disabled />);
    expect(container.firstElementChild).not.toHaveAttribute('tabindex');
  });

  it('component="button" no añade role ni tabindex y se activa una sola vez con Enter', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Chip component="button" type="button" label="Nativo" onClick={onClick} />);
    const chip = screen.getByRole('button', { name: 'Nativo' });
    expect(chip.tagName).toBe('BUTTON');
    expect(chip).not.toHaveAttribute('role');
    expect(chip).not.toHaveAttribute('tabindex');
    chip.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('component="button" usa type="button" por defecto y no envía el formulario', async () => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    render(
      <form onSubmit={(e) => onSubmit(e.nativeEvent)}>
        <Chip component="button" label="Dentro" onClick={() => {}} />
      </form>,
    );
    const chip = screen.getByRole('button', { name: 'Dentro' });
    expect(chip).toHaveAttribute('type', 'button');
    await userEvent.click(chip);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('respeta type explícito en component="button"', () => {
    render(<Chip component="button" type="submit" label="Enviar" />);
    expect(screen.getByText('Enviar').parentElement).toHaveAttribute('type', 'submit');
  });

  it('href sin component renderiza un <a> sin role ni tabindex', () => {
    const { container } = render(<Chip label="Link" href="/x" />);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('A');
    expect(root).toHaveAttribute('href', '/x');
    expect(root).toHaveClass('mtx-chip--clickable');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('respeta onKeyDown del usuario', () => {
    const onKeyDown = vi.fn();
    const { container } = render(<Chip label="A" onKeyDown={onKeyDown} />);
    fireEvent.keyDown(container.firstElementChild!, { key: 'a' });
    expect(onKeyDown).toHaveBeenCalled();
  });
});

describe('Chip — paridad con vanilla', () => {
  const cases: Array<[string, string, ReactElement]> = [
    ['básico', '<div data-mtx="chip" data-label="Tag"></div>', <Chip label="Tag" />],
    [
      'icono y color',
      '<div data-mtx="chip" data-label="JavaScript" data-icon="code" data-color="primary"></div>',
      <Chip label="JavaScript" icon="code" color="primary" />,
    ],
    [
      'eliminable secundario',
      '<div data-mtx="chip" data-label="Deletable" data-deletable data-color="secondary"></div>',
      <Chip label="Deletable" color="secondary" onDelete={() => {}} />,
    ],
    [
      'outlined small clickable',
      '<div data-mtx="chip" data-label="Click" data-variant="outlined" data-size="small" data-clickable></div>',
      <Chip label="Click" variant="outlined" size="small" onClick={() => {}} />,
    ],
    [
      'deshabilitado clickable y eliminable',
      '<div data-mtx="chip" data-label="Off" data-clickable data-deletable data-disabled></div>',
      <Chip label="Off" disabled onClick={() => {}} onDelete={() => {}} />,
    ],
    [
      'button nativo',
      '<button type="button" data-mtx="chip" data-label="Button filled" data-clickable></button>',
      <Chip component="button" type="button" label="Button filled" onClick={() => {}} />,
    ],
    [
      'avatar',
      '<div data-mtx="chip" data-label="Jane"><span class="mtx-chip__avatar mtx-avatar mtx-avatar--small">J</span></div>',
      <Chip label="Jane" avatar={<span className="mtx-avatar mtx-avatar--small">J</span>} />,
    ],
  ];

  it.each(cases)('%s', async (_name, html, element) => {
    const vanilla = await mountVanilla(html);
    const { container } = render(element);
    expectParity(container.firstElementChild, vanilla.firstElementChild, {
      classPrefixes: ['mtx-', 'material-'],
      attributes: ['tabindex'],
    });
  });
});
