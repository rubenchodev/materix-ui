import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia } from './index';

describe('Card', () => {
  it('renderiza un div con la clase base, contenido y ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} data-testid="c" className="extra" style={{ width: 300 }}>
        <CardContent>Hola</CardContent>
      </Card>,
    );
    const el = screen.getByTestId('c');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('mtx-card', 'extra');
    expect(el.style.width).toBe('300px');
    expect(ref.current).toBe(el);
    expect(el.querySelector('.mtx-card__content')).toHaveTextContent('Hola');
    expect(el).not.toHaveAttribute('role');
    expect(el).not.toHaveAttribute('tabindex');
  });

  it('variantes, elevación, raised y square', () => {
    render(<Card data-testid="c" variant="outlined" elevation={4} raised square component="article" />);
    const el = screen.getByTestId('c');
    expect(el.tagName).toBe('ARTICLE');
    expect(el).toHaveClass('mtx-card--outlined', 'mtx-card--elevation-4', 'mtx-card--raised', 'mtx-card--square');
  });

  it('clickable: role button, tabindex, Enter y Espacio disparan click', async () => {
    const onClick = vi.fn();
    render(
      <Card clickable title="Ajustes" onClick={onClick}>
        <CardContent>x</CardContent>
      </Card>,
    );
    const card = screen.getByRole('button', { name: /Ajustes/ });
    expect(card).toHaveClass('mtx-card--clickable');
    expect(card).toHaveAttribute('tabindex', '0');
    await userEvent.tab();
    expect(card).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('clickable con disabled: aria-disabled, tabindex -1 y sin click', () => {
    const onClick = vi.fn();
    render(<Card clickable disabled data-testid="c" onClick={onClick} />);
    const el = screen.getByTestId('c');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).toHaveAttribute('tabindex', '-1');
    expect(el).toHaveClass('mtx-card--disabled');
    fireEvent.click(el);
    fireEvent.keyDown(el, { key: 'Enter' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('component="button" recibe type=button (no envía formularios) y respeta type explícito', () => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    const { rerender } = render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent)}>
        <Card component="button" clickable data-testid="c">Tarjeta</Card>
      </form>,
    );
    const el = screen.getByTestId('c');
    expect(el).toHaveAttribute('type', 'button');
    expect(el).not.toHaveAttribute('role');
    fireEvent.click(el);
    expect(onSubmit).not.toHaveBeenCalled();
    rerender(
      <form onSubmit={(event) => onSubmit(event.nativeEvent)}>
        <Card component="button" clickable type="submit" data-testid="c">Tarjeta</Card>
      </form>,
    );
    expect(screen.getByTestId('c')).toHaveAttribute('type', 'submit');
  });

  it('ripple al pulsar una tarjeta clickable', () => {
    render(<Card clickable data-testid="c" />);
    const el = screen.getByTestId('c');
    fireEvent.pointerDown(el, { button: 0, clientX: 5, clientY: 5 });
    expect(el.querySelector('.mtx-ripple-container')).not.toBeNull();
  });

  it('atajos: encabezado con avatar, título, subtítulo y acción; media debajo o arriba', () => {
    const { rerender, container } = render(
      <Card avatar="R" title="Paella" subheader="Receta" actionIcon="more_vert" image="a.jpg" mediaHeight={200} />,
    );
    const root = container.firstElementChild!;
    expect(root.children[0]).toHaveClass('mtx-card__header');
    expect(root.children[1]).toHaveClass('mtx-card__media');
    expect((root.children[1] as HTMLElement).style.height).toBe('200px');
    expect((root.children[1] as HTMLElement).style.backgroundImage).toContain('a.jpg');
    expect(root.querySelector('.mtx-avatar')).toHaveTextContent('R');
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveClass('mtx-icon-button');
    rerender(<Card title="Paella" image="a.jpg" mediaTop />);
    expect(container.firstElementChild!.children[0]).toHaveClass('mtx-card__media');
  });

  it('actionLabel personaliza el aria-label y action acepta un ReactNode', () => {
    const { rerender } = render(<Card title="T" actionIcon="share" actionLabel="Compartir" />);
    expect(screen.getByRole('button', { name: 'Compartir' })).toBeInTheDocument();
    rerender(<Card title="T" action={<button type="button">Mi acción</button>} />);
    expect(screen.getByRole('button', { name: 'Mi acción' }).parentElement).toHaveClass('mtx-card__header-action');
  });

  describe('paridad con vanilla', () => {
    it.each([
      ['<div data-mtx="card"><div data-mtx="card-content">A</div></div>', <Card><CardContent>A</CardContent></Card>],
      [
        '<div data-mtx="card" data-variant="outlined" data-elevation="4" data-raised data-square><div data-mtx="card-content">A</div></div>',
        <Card variant="outlined" elevation={4} raised square><CardContent>A</CardContent></Card>,
      ],
      [
        '<div data-mtx="card" data-avatar="R" data-title="T" data-subheader="S" data-action-icon="more_vert" data-image="x.jpg"><div data-mtx="card-content">C</div><div data-mtx="card-actions"><button>A</button></div></div>',
        <Card avatar="R" title="T" subheader="S" actionIcon="more_vert" image="x.jpg">
          <CardContent>C</CardContent>
          <CardActions><button>A</button></CardActions>
        </Card>,
      ],
      [
        '<div data-mtx="card" data-media-top data-image="x.jpg" data-image-alt="Foto" data-title="T"></div>',
        <Card mediaTop image="x.jpg" imageAlt="Foto" title="T" />,
      ],
      [
        '<div data-mtx="card" data-clickable data-disabled data-title="T"></div>',
        <Card clickable disabled title="T" />,
      ],
      [
        '<div data-mtx="card" data-clickable data-title="T"></div>',
        <Card clickable title="T" />,
      ],
    ])('%s', async (html, node) => {
      const vanilla = await mountVanilla(html);
      const { container } = render(node);
      expectParity(container.firstElementChild, vanilla.firstElementChild, {
        classPrefixes: ['mtx-', 'material-'],
        attributes: ['tabindex'],
      });
    });
  });
});

describe('CardHeader', () => {
  it('pinta avatar, contenido y acción en sus zonas', () => {
    const { container } = render(
      <CardHeader avatar={<span>AV</span>} title="Título" subheader="Sub" action={<button type="button">a</button>} />,
    );
    const header = container.firstElementChild!;
    expect(header).toHaveClass('mtx-card__header');
    expect(Array.from(header.children).map((c) => c.className)).toEqual([
      'mtx-card__header-avatar',
      'mtx-card__header-content',
      'mtx-card__header-action',
    ]);
    expect(header.querySelector('.mtx-card__title')).toHaveTextContent('Título');
    expect(header.querySelector('.mtx-card__subheader')).toHaveTextContent('Sub');
  });

  it('con solo avatar pinta igualmente la zona de contenido (paridad con data-avatar)', async () => {
    const vanilla = await mountVanilla('<div data-mtx="card" data-avatar="R"></div>');
    const { container } = render(<Card avatar="R" />);
    expect(container.querySelector('.mtx-card__header-content')).not.toBeNull();
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('action y actionIcon se ignoran sin title, subheader ni avatar (como vanilla)', () => {
    const { container } = render(<Card actionIcon="more_vert" action={<button type="button">x</button>} />);
    expect(container.querySelector('.mtx-card__header')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('paridad con la sintaxis BEM de vanilla', async () => {
    const vanilla = await mountVanilla(
      '<header class="mtx-card__header" data-mtx="card-header"><div class="mtx-card__header-content"><span class="mtx-card__title">T</span><span class="mtx-card__subheader">S</span></div></header>',
    );
    const { container } = render(<CardHeader component="header" title="T" subheader="S" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });
});

describe('CardMedia', () => {
  it('imagen de fondo decorativa por defecto, role img con alt', () => {
    const { rerender, container } = render(<CardMedia image="a.jpg" />);
    let el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.style.backgroundImage).toBe('url("a.jpg")');
    rerender(<CardMedia image="a.jpg" alt="Foto" height="140" />);
    el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('role', 'img');
    expect(el).toHaveAttribute('aria-label', 'Foto');
    expect(el.style.height).toBe('140px');
  });

  it('component img y video usan src', () => {
    const { container, rerender } = render(<CardMedia component="img" image="a.jpg" />);
    let el = container.firstElementChild as HTMLImageElement;
    expect(el.tagName).toBe('IMG');
    expect(el).toHaveAttribute('src', 'a.jpg');
    expect(el).toHaveAttribute('alt', '');
    rerender(<CardMedia component="video" image="v.mp4" controls />);
    el = container.firstElementChild as HTMLImageElement;
    expect(el.tagName).toBe('VIDEO');
    expect(el).toHaveAttribute('src', 'v.mp4');
    expect(el.style.backgroundImage).toBe('');
  });

  it('escapa comillas en la URL', () => {
    const { container } = render(<CardMedia image={'a".jpg'} />);
    expect((container.firstElementChild as HTMLElement).style.backgroundImage).toContain('a%22.jpg');
  });

  it('paridad con data-alt y data-height', async () => {
    const vanilla = await mountVanilla('<div data-mtx="card-media" data-height="140" data-alt="Alt" data-image="x.jpg"></div>');
    const { container } = render(<CardMedia height={140} alt="Alt" image="x.jpg" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });
});

describe('CardActions', () => {
  it('end por defecto sin clase; align y disableSpacing', () => {
    const { container, rerender } = render(<CardActions />);
    expect(container.firstElementChild!.className).toBe('mtx-card__actions');
    rerender(<CardActions align="between" disableSpacing />);
    expect(container.firstElementChild).toHaveClass('mtx-card__actions--between', 'mtx-card__actions--disable-spacing');
  });

  it('hereda actionsAlign de la tarjeta; su align propio gana', () => {
    render(
      <Card actionsAlign="center">
        <CardActions data-testid="a" />
        <CardActions data-testid="b" align="end" />
      </Card>,
    );
    expect(screen.getByTestId('a')).toHaveClass('mtx-card__actions--center');
    expect(screen.getByTestId('b').className).toBe('mtx-card__actions');
  });

  it.each([
    ['<div data-mtx="card-actions" data-align="start"><button>A</button></div>', <CardActions align="start"><button>A</button></CardActions>],
    ['<div data-mtx="card-actions" data-disable-spacing><button>A</button></div>', <CardActions disableSpacing><button>A</button></CardActions>],
  ])('paridad %s', async (html, node) => {
    const vanilla = await mountVanilla(html);
    const { container } = render(node);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });
});

describe('CardActionArea', () => {
  it('es un button type=button con ripple y click', async () => {
    const onClick = vi.fn();
    render(<CardActionArea onClick={onClick}>Área</CardActionArea>);
    const el = screen.getByRole('button', { name: 'Área' });
    expect(el).toHaveAttribute('type', 'button');
    expect(el).toHaveClass('mtx-card-action-area');
    fireEvent.pointerDown(el, { button: 0 });
    expect(el.querySelector('.mtx-ripple-container')).not.toBeNull();
    await userEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('con href es un enlace; disabled lo saca del tabulador', () => {
    const { rerender } = render(<CardActionArea href="#x">Ir</CardActionArea>);
    const link = screen.getByRole('link', { name: 'Ir' });
    expect(link).toHaveAttribute('href', '#x');
    expect(link).not.toHaveAttribute('tabindex');
    rerender(<CardActionArea href="#x" disabled>Ir</CardActionArea>);
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(link).toHaveClass('mtx-card-action-area--disabled');
  });

  it('component div: role button, Enter/Espacio y bloqueo al deshabilitar', () => {
    const onClick = vi.fn();
    const { rerender } = render(<CardActionArea component="div" onClick={onClick}>D</CardActionArea>);
    const el = screen.getByRole('button', { name: 'D' });
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(el, { key: 'Enter' });
    fireEvent.keyDown(el, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(<CardActionArea component="div" onClick={onClick} disabled>D</CardActionArea>);
    fireEvent.click(el);
    fireEvent.keyDown(el, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(el).toHaveAttribute('tabindex', '-1');
  });

  it('disabled en button: atributo disabled y aria-disabled', () => {
    render(<CardActionArea disabled>X</CardActionArea>);
    const el = screen.getByRole('button', { name: 'X' });
    expect(el).toBeDisabled();
    expect(el).toHaveAttribute('aria-disabled', 'true');
  });

  it.each([
    [
      '<button data-mtx="card-action-area" data-disabled><div data-mtx="card-media" data-height="140" data-alt="Alt" data-image="x.jpg"></div><div data-mtx="card-content">T</div></button>',
      <CardActionArea disabled><CardMedia height={140} alt="Alt" image="x.jpg" /><CardContent>T</CardContent></CardActionArea>,
    ],
    ['<a href="#" data-mtx="card-action-area">a</a>', <CardActionArea href="#">a</CardActionArea>],
    ['<div data-mtx="card-action-area">d</div>', <CardActionArea component="div">d</CardActionArea>],
  ])('paridad %s', async (html, node) => {
    const vanilla = await mountVanilla(html);
    const { container } = render(node);
    expectParity(container.firstElementChild, vanilla.firstElementChild, { attributes: ['tabindex', 'href'] });
  });
});
