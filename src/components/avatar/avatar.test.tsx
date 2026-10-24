import { createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { Avatar } from './Avatar';
import { AvatarGroup, getAvatarGroupLayout } from './AvatarGroup';

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Avatar', () => {
  it('con iniciales usa el modo fallback', () => {
    const { container } = render(<Avatar>JD</Avatar>);
    expect(root(container)).toHaveClass('mtx-avatar', 'mtx-avatar--fallback');
    expect(root(container)).toHaveTextContent('JD');
  });

  it('crea la imagen con src y alt', () => {
    const { container } = render(<Avatar src="user.jpg" alt="John Doe" />);
    const img = container.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('user.jpg');
    expect(img).toHaveAttribute('alt', 'John Doe');
  });

  it('variantes, colores y tamaños canónicos', () => {
    const { container, rerender } = render(<Avatar variant="square" color="primary" size="large">A</Avatar>);
    expect(root(container)).toHaveClass('mtx-avatar--square', 'mtx-avatar--primary', 'mtx-avatar--large');
    rerender(<Avatar variant="circular">A</Avatar>);
    expect(root(container).className).not.toContain('circular');
  });

  it('tamaño numérico en píxeles', () => {
    const { container } = render(<Avatar size={56}>A</Avatar>);
    expect(root(container).style.width).toBe('56px');
    expect(root(container).style.height).toBe('56px');
    expect(root(container).style.fontSize).toBe('25px');
  });

  it('icono por nombre sin fallback', () => {
    const { container } = render(<Avatar icon="folder" role="img" aria-label="Folder" />);
    expect(root(container)).not.toHaveClass('mtx-avatar--fallback');
    const icon = container.querySelector('.material-icons')!;
    expect(icon).toHaveTextContent('folder');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('error de imagen: oculta el img y muestra la inicial del alt', () => {
    const onError = vi.fn();
    const { container } = render(<Avatar src="invalid.jpg" alt="alice" imgProps={{ onError }} />);
    fireEvent.error(container.querySelector('img')!);
    expect(root(container)).toHaveClass('mtx-avatar--fallback');
    expect(container.querySelector('img')!.hidden).toBe(true);
    expect(container.querySelector('.mtx-avatar__fallback')).toHaveTextContent('A');
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('error de imagen con hijos o sin alt', () => {
    const { container, rerender } = render(<Avatar src="x.jpg" alt="Bob">BB</Avatar>);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('.mtx-avatar__fallback')).toBeNull();
    rerender(<Avatar src="y.jpg" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('.mtx-avatar__fallback')).toHaveTextContent('●');
  });

  it('reenvía ref y concatena className', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<Avatar component="span" ref={ref} className="extra">A</Avatar>);
    expect(ref.current).toBe(root(container));
    expect(root(container)).toHaveClass('mtx-avatar', 'extra');
  });

  describe('paridad con vanilla', () => {
    it('iniciales con variante, color y tamaño', async () => {
      const vanilla = await mountVanilla('<div data-mtx="avatar" data-variant="rounded" data-color="secondary" data-size="small">AB</div>');
      const { container } = render(<Avatar variant="rounded" color="secondary" size="small">AB</Avatar>);
      expectParity(root(container), vanilla.firstElementChild);
    });

    it('icono', async () => {
      const vanilla = await mountVanilla('<div data-mtx="avatar" data-icon="person" role="img" aria-label="User"></div>');
      const { container } = render(<Avatar icon="person" role="img" aria-label="User" />);
      expectParity(root(container), vanilla.firstElementChild, { classPrefixes: ['mtx-', 'material-'] });
    });

    it('imagen', async () => {
      const vanilla = await mountVanilla('<div data-mtx="avatar" data-src="a.png" data-alt="Anna"></div>');
      const { container } = render(<Avatar src="a.png" alt="Anna" />);
      expectParity(root(container), vanilla.firstElementChild, { attributes: ['alt'] });
    });
  });
});

describe('AvatarGroup', () => {
  const people = (n: number) => Array.from({ length: n }, (_, i) => <Avatar key={i}>{`A${i + 1}`}</Avatar>);

  it('getAvatarGroupLayout replica refresh()', () => {
    expect(getAvatarGroupLayout(5, 3, null)).toEqual({ visible: 2, surplus: 3 });
    expect(getAvatarGroupLayout(3, 5, null)).toEqual({ visible: 3, surplus: 0 });
    expect(getAvatarGroupLayout(3, 3, 24)).toEqual({ visible: 2, surplus: 22 });
  });

  it('limita con max e indica el excedente con etiqueta traducida', () => {
    const { container } = render(<AvatarGroup max={3} label="Team">{people(5)}</AvatarGroup>);
    const group = root(container);
    expect(group).toHaveClass('mtx-avatar-group');
    expect(group).toHaveAttribute('aria-label', 'Team');
    expect(group.style.getPropertyValue('--mtx-avatar-group-overlap')).toBe('8px');
    const surplus = group.querySelector('.mtx-avatar--surplus')!;
    expect(surplus).toHaveTextContent('+3');
    expect(surplus).toHaveAttribute('aria-label', '3 more');
    expect(group.querySelectorAll('.mtx-avatar[hidden]')).toHaveLength(3);
  });

  it('total, spacing, surplusLabel e idioma', () => {
    const { container, rerender } = render(
      <AvatarGroup max={3} total={24} spacing="small" surplusLabel="{count} personas más">{people(3)}</AvatarGroup>,
    );
    expect(root(container).querySelector('.mtx-avatar--surplus')).toHaveAttribute('aria-label', '22 personas más');
    expect(root(container).style.getPropertyValue('--mtx-avatar-group-overlap')).toBe('16px');
    rerender(
      <I18nProvider locale="es">
        <AvatarGroup max={2} spacing={0}>{people(3)}</AvatarGroup>
      </I18nProvider>,
    );
    expect(root(container).querySelector('.mtx-avatar--surplus')!.textContent).toBe('+2');
    expect(root(container).style.getPropertyValue('--mtx-avatar-group-overlap')).toBe('0px');
  });

  it('max menor que 2 se ajusta a 2 y sin excedente no hay indicador', () => {
    const { container, rerender } = render(<AvatarGroup max={1}>{people(3)}</AvatarGroup>);
    expect(root(container).querySelector('.mtx-avatar--surplus')).toHaveTextContent('+2');
    rerender(<AvatarGroup>{people(3)}</AvatarGroup>);
    expect(root(container).querySelector('.mtx-avatar--surplus')).toBeNull();
  });

  it('paridad con vanilla', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="avatar-group" data-max="3" data-label="Team">'
      + '<div data-mtx="avatar" data-color="primary">A</div><div data-mtx="avatar">B</div>'
      + '<div data-mtx="avatar">C</div><div data-mtx="avatar">D</div></div>',
    );
    const { container } = render(
      <AvatarGroup max={3} label="Team">
        <Avatar color="primary">A</Avatar>
        <Avatar>B</Avatar>
        <Avatar>C</Avatar>
        <Avatar>D</Avatar>
      </AvatarGroup>,
    );
    expectParity(root(container), vanilla.firstElementChild, { attributes: ['hidden'] });
  });
});
