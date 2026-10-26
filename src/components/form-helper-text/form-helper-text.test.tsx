import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { FormControl, FormHelperText, FormLabel, useFormControl } from './index';

describe('FormHelperText', () => {
  it('renderiza <p class="mtx-form-helper-text"> con id generado', () => {
    const { container } = render(<FormHelperText>Help</FormHelperText>);
    const p = container.firstElementChild!;
    expect(p.tagName).toBe('P');
    expect(p).toHaveClass('mtx-form-helper-text');
    expect(p.id).toMatch(/^mtx-form-helper-text-/);
    expect(p).toHaveTextContent('Help');
  });

  it('error, contained, disabled e id/className propios', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <FormHelperText ref={ref} id="h1" error contained disabled className="x">
        Oops
      </FormHelperText>,
    );
    expect(ref.current).toHaveAttribute('id', 'h1');
    expect(ref.current).toHaveClass(
      'mtx-form-helper-text',
      'mtx-form-helper-text--error',
      'mtx-form-helper-text--contained',
      'mtx-form-helper-text--disabled',
      'x',
    );
    expect(ref.current).toHaveAttribute('aria-disabled', 'true');
  });

  it('hereda error y disabled de FormControl (disabled solo como aria-disabled)', () => {
    render(
      <FormControl error disabled>
        <FormHelperText data-testid="h">Inherited</FormHelperText>
      </FormControl>,
    );
    const helper = screen.getByTestId('h');
    expect(helper).toHaveClass('mtx-form-helper-text--error');
    expect(helper).not.toHaveClass('mtx-form-helper-text--disabled');
    expect(helper).toHaveAttribute('aria-disabled', 'true');
  });

  it('la prop error tiene prioridad sobre el contexto', () => {
    render(
      <FormControl error>
        <FormHelperText data-testid="h" error={false}>
          Fine
        </FormHelperText>
      </FormControl>,
    );
    expect(screen.getByTestId('h')).not.toHaveClass('mtx-form-helper-text--error');
  });
});

describe('FormControl', () => {
  it('clases de estado, ref y className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<FormControl ref={ref} error disabled className="extra" />);
    expect(ref.current).toHaveClass('mtx-form-control', 'mtx-form-control--error', 'mtx-form-control--disabled', 'extra');
  });

  it('expone el estado y registra los ids de sus textos de ayuda', () => {
    let captured: ReturnType<typeof useFormControl>;
    function Probe() {
      captured = useFormControl();
      return null;
    }
    const { rerender } = render(
      <FormControl required>
        <Probe />
        <FormHelperText id="help-1">One</FormHelperText>
        <FormHelperText id="help-2" />
      </FormControl>,
    );
    expect(captured!.required).toBe(true);
    expect(captured!.helperTextIds).toEqual(['help-1']);
    rerender(
      <FormControl required>
        <Probe />
      </FormControl>,
    );
    expect(captured!.helperTextIds).toEqual([]);
  });

  it('useFormControl devuelve undefined fuera de un FormControl', () => {
    let captured: unknown = 'unset';
    function Probe() {
      captured = useFormControl();
      return null;
    }
    render(<Probe />);
    expect(captured).toBeUndefined();
  });
});

describe('FormLabel', () => {
  it('renderiza .mtx-form-label', () => {
    render(<FormLabel data-testid="l">Plan</FormLabel>);
    expect(screen.getByTestId('l')).toHaveClass('mtx-form-label');
  });
});

describe('FormLabel · estados', () => {
  it('required añade un asterisco oculto a lectores; error y disabled colorean', () => {
    const { rerender } = render(<FormLabel data-testid="l" required error>Plan</FormLabel>);
    const label = screen.getByTestId('l');
    expect(label).toHaveTextContent('Plan *');
    expect(label.querySelector('[aria-hidden="true"]')).toHaveTextContent('*');
    expect(label.style.color).toBe('var(--mtx-color-error-text)');
    rerender(<FormLabel data-testid="l" disabled>Plan</FormLabel>);
    expect(label.style.color).toBe('var(--mtx-color-text-disabled)');
    expect(label.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('hereda required, error y disabled del FormControl', () => {
    render(
      <FormControl required error>
        <FormLabel data-testid="l">Plan</FormLabel>
      </FormControl>,
    );
    const label = screen.getByTestId('l');
    expect(label).toHaveTextContent('Plan *');
    expect(label.style.color).toBe('var(--mtx-color-error-text)');
  });
});

describe('FormHelperText · paridad con vanilla', () => {
  it('texto con error', async () => {
    const vanilla = await mountVanilla('<p class="mtx-form-helper-text" data-mtx="form-helper-text" data-error>Required</p>');
    const { container } = render(<FormHelperText error>Required</FormHelperText>);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('texto normal', async () => {
    const vanilla = await mountVanilla('<p data-mtx="form-helper-text">Hint</p>');
    const { container } = render(<FormHelperText>Hint</FormHelperText>);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });
});
