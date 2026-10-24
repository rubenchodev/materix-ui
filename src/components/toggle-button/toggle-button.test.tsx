import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { ToggleButton, ToggleButtonGroup } from './index';
import type { ToggleButtonGroupValue } from './index';

const PARITY = { classPrefixes: ['mtx-', 'material-'] };

describe('ToggleButton', () => {
  it('standalone: icono, aria-pressed, type y clases de tamaño y color', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ToggleButton ref={ref} value="bold" icon="format_bold" size="small" color="primary" aria-label="Bold" />);
    const button = screen.getByRole('button', { name: 'Bold' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveClass('mtx-toggle-button', 'mtx-toggle-button--small', 'mtx-toggle-button--primary');
    const icon = button.querySelector('.mtx-toggle-button__icon')!;
    expect(icon).toHaveClass('material-icons');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon.textContent).toBe('format_bold');
  });

  it('standalone no controlado: alterna y llama a onChange(event, selected, value)', async () => {
    const onChange = vi.fn();
    render(<ToggleButton value="fav" onChange={onChange}>Fav</ToggleButton>);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), true, 'fav');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), false, 'fav');
  });

  it('defaultSelected, controlado y valor por defecto desde el texto', async () => {
    const onChange = vi.fn();
    const { unmount } = render(<ToggleButton defaultSelected>Wi-Fi</ToggleButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    unmount();
    render(<ToggleButton selected={false} onChange={onChange}>Wi-Fi</ToggleButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onChange).toHaveBeenCalledWith(expect.anything(), true, 'Wi-Fi');
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('disabled no alterna; onClick con preventDefault cancela', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<ToggleButton value="x" disabled onChange={onChange}>X</ToggleButton>);
    expect(screen.getByRole('button')).toBeDisabled();
    fireEvent.click(screen.getByRole('button'));
    expect(onChange).not.toHaveBeenCalled();
    rerender(<ToggleButton value="x" onChange={onChange} onClick={(e) => e.preventDefault()}>X</ToggleButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('paridad con vanilla (standalone con icono)', async () => {
    const vanilla = await mountVanilla(
      '<button data-mtx="toggle-button" data-value="done" data-icon="check" data-color="success" data-size="large" data-selected aria-label="Done"></button>',
    );
    const { container } = render(
      <ToggleButton value="done" icon="check" color="success" size="large" defaultSelected aria-label="Done" />,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });
});

describe('ToggleButtonGroup', () => {
  const Alignment = (props: Partial<Parameters<typeof ToggleButtonGroup>[0]>) => (
    <ToggleButtonGroup exclusive label="Alignment" {...props}>
      <ToggleButton value="left" icon="format_align_left" aria-label="Left" />
      <ToggleButton value="center" icon="format_align_center" aria-label="Center" />
      <ToggleButton value="right" icon="format_align_right" aria-label="Right" />
    </ToggleButtonGroup>
  );

  it('role group, aria-label y valor inicial exclusivo', () => {
    render(<Alignment defaultValue="center" />);
    const group = screen.getByRole('group', { name: 'Alignment' });
    expect(group).toHaveClass('mtx-toggle-button-group');
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('exclusivo: selecciona uno, deselecciona al repetir y notifica', async () => {
    const onChange = vi.fn();
    render(<Alignment defaultValue="left" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Right' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 'right');
    expect(screen.getByRole('button', { name: 'Right' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(screen.getByRole('button', { name: 'Right' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), null);
    expect(screen.getAllByRole('button').every((b) => b.getAttribute('aria-pressed') === 'false')).toBe(true);
  });

  it('enforceValueSet impide quedarse sin valor', async () => {
    const onChange = vi.fn();
    render(<Alignment defaultValue="left" enforceValueSet onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Left' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('múltiple: array en orden del DOM', async () => {
    const onChange = vi.fn();
    render(
      <ToggleButtonGroup defaultValue={['underlined']} onChange={onChange} label="Format">
        <ToggleButton value="bold">B</ToggleButton>
        <ToggleButton value="italic">I</ToggleButton>
        <ToggleButton value="underlined">U</ToggleButton>
      </ToggleButtonGroup>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['bold', 'underlined']);
    await userEvent.click(screen.getByRole('button', { name: 'U' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['bold']);
  });

  it('modo controlado', async () => {
    function Controlled() {
      const [value, setValue] = useState<ToggleButtonGroupValue>('left');
      return (
        <>
          <Alignment value={value} onChange={(_, next) => setValue(next)} />
          <output>{String(value)}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'Center' }));
    expect(screen.getByText('center')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('propaga tamaño, color y disabled; el botón puede sobrescribir', () => {
    render(
      <ToggleButtonGroup size="small" color="secondary" disabled label="G">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b" size="large" color="error">B</ToggleButton>
      </ToggleButtonGroup>,
    );
    expect(screen.getByRole('group')).toHaveAttribute('aria-disabled', 'true');
    const [a, b] = screen.getAllByRole('button');
    expect(a).toHaveClass('mtx-toggle-button--small', 'mtx-toggle-button--secondary');
    expect(b).toHaveClass('mtx-toggle-button--large', 'mtx-toggle-button--error');
    expect(a).toBeDisabled();
    expect(b).toBeDisabled();
  });

  it('flechas, Home y End saltan los deshabilitados; vertical usa arriba/abajo', () => {
    const { rerender } = render(
      <ToggleButtonGroup label="G">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b" disabled>B</ToggleButton>
        <ToggleButton value="c">C</ToggleButton>
      </ToggleButtonGroup>,
    );
    const [a, , c] = screen.getAllByRole('button');
    a.focus();
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(c).toHaveFocus();
    fireEvent.keyDown(c, { key: 'ArrowRight' });
    expect(a).toHaveFocus();
    fireEvent.keyDown(a, { key: 'End' });
    expect(c).toHaveFocus();
    fireEvent.keyDown(c, { key: 'Home' });
    expect(a).toHaveFocus();

    rerender(
      <ToggleButtonGroup label="G" orientation="vertical" fullWidth>
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b" disabled>B</ToggleButton>
        <ToggleButton value="c">C</ToggleButton>
      </ToggleButtonGroup>,
    );
    expect(screen.getByRole('group')).toHaveClass('mtx-toggle-button-group--vertical', 'mtx-toggle-button-group--full-width');
    a.focus();
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(a).toHaveFocus();
    fireEvent.keyDown(a, { key: 'ArrowDown' });
    expect(c).toHaveFocus();
    fireEvent.keyDown(c, { key: 'ArrowUp' });
    expect(a).toHaveFocus();
  });

  it('dentro del grupo llama también al onChange del botón', async () => {
    const own = vi.fn();
    const groupChange = vi.fn();
    render(
      <ToggleButtonGroup label="G" onChange={groupChange}>
        <ToggleButton value="a" onChange={own}>A</ToggleButton>
      </ToggleButtonGroup>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(own).toHaveBeenCalledWith(expect.anything(), true, 'a');
    expect(groupChange).toHaveBeenCalledWith(expect.anything(), ['a']);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('botones de solo icono sin value: aviso y valor único seleccionable', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onChange = vi.fn();
    render(
      <ToggleButtonGroup exclusive label="G" onChange={onChange}>
        <ToggleButton icon="format_bold" aria-label="Bold" />
        <ToggleButton icon="format_italic" aria-label="Italic" />
      </ToggleButtonGroup>,
    );
    expect(warn).toHaveBeenCalled();
    const [bold, italic] = screen.getAllByRole('button');
    expect(bold.getAttribute('value')).not.toBe(italic.getAttribute('value'));
    await userEvent.click(bold);
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    expect(italic).toHaveAttribute('aria-pressed', 'false');
    expect(onChange.mock.calls[0][1]).toBe(bold.getAttribute('value'));
    warn.mockRestore();
  });

  it('paridad con vanilla (grupo exclusivo vertical)', async () => {
    const vanilla = await mountVanilla(`
      <div data-mtx="toggle-button-group" data-exclusive data-orientation="vertical" data-full-width data-size="small" data-color="primary" data-value="list" aria-label="View">
        <button data-value="list" data-icon="view_list" aria-label="List"></button>
        <button data-value="module" data-icon="view_module" aria-label="Modules" disabled></button>
        <button data-value="text">Text</button>
      </div>`);
    const { container } = render(
      <ToggleButtonGroup exclusive orientation="vertical" fullWidth size="small" color="primary" defaultValue="list" aria-label="View">
        <ToggleButton value="list" icon="view_list" aria-label="List" />
        <ToggleButton value="module" icon="view_module" aria-label="Modules" disabled />
        <ToggleButton value="text">Text</ToggleButton>
      </ToggleButtonGroup>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });
});
