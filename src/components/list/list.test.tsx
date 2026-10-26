import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Collapse } from '../../core';
import { expectParity, mountVanilla } from '../../../tests/parity';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  ListSelectionProvider,
} from './index';

const PARITY = { classPrefixes: ['mtx-', 'material-'], attributes: ['tabindex', 'href', 'alt', 'src'] };

describe('List', () => {
  it('renderiza un ul con modificadores, subheader, className y ref', () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <List ref={ref} dense disablePadding className="extra" aria-label="Correo" subheader={<ListSubheader>Grupo</ListSubheader>}>
        <ListItem>Uno</ListItem>
      </List>,
    );
    const ul = screen.getByRole('list', { name: 'Correo' });
    expect(ul.tagName).toBe('UL');
    expect(ul).toHaveClass('mtx-list', 'mtx-list--dense', 'mtx-list--disable-padding', 'extra');
    expect(ref.current).toBe(ul);
    expect(ul.firstElementChild).toHaveClass('mtx-list-subheader');
    expect(screen.getByText('Uno').closest('li')).toHaveClass('mtx-list-item--dense');
  });

  it('nested añade --nested y --nested-2', () => {
    const { container, rerender } = render(<List nested />);
    expect(container.firstElementChild).toHaveClass('mtx-list--nested');
    rerender(<List nested={2} />);
    expect(container.firstElementChild).toHaveClass('mtx-list--nested', 'mtx-list--nested-2');
  });
});

describe('ListItem', () => {
  it('atajos: icono, texto principal y secundario', () => {
    const { container } = render(<ListItem icon="inbox" secondary="3 nuevos">Bandeja</ListItem>);
    const li = container.firstElementChild!;
    expect(li.children[0]).toHaveClass('mtx-list-item-icon');
    expect(li.querySelector('.material-icons')).toHaveTextContent('inbox');
    expect(li.querySelector('.mtx-list-item-text__primary')).toHaveTextContent('Bandeja');
    expect(li.querySelector('.mtx-list-item-text__secondary')).toHaveTextContent('3 nuevos');
  });

  it('texto suelto sin atajos se envuelve; hijos compuestos se respetan', () => {
    const { container, rerender } = render(<ListItem>Solo texto</ListItem>);
    expect(container.querySelector('.mtx-list-item-text__primary')).toHaveTextContent('Solo texto');
    rerender(
      <ListItem>
        <ListItemIcon icon="star" />
        <ListItemText primary="A" secondary="B" />
      </ListItem>,
    );
    expect(container.querySelectorAll('.mtx-list-item-text')).toHaveLength(1);
    expect(container.querySelector('.mtx-list-item-icon .material-icons')).toHaveTextContent('star');
  });

  it('estados: disabled, divider, alignItems, gutters, padding y secondaryAction', () => {
    const { container } = render(
      <ListItem disabled divider alignItems="flex-start" disableGutters disablePadding secondaryAction={<button type="button">x</button>}>
        Fila
      </ListItem>,
    );
    const li = container.firstElementChild!;
    expect(li).toHaveAttribute('aria-disabled', 'true');
    expect(li).toHaveClass(
      'mtx-list-item--disabled',
      'mtx-list-item--divider',
      'mtx-list-item--align-start',
      'mtx-list-item--disable-gutters',
      'mtx-list-item--disable-padding',
    );
    expect(li.lastElementChild).toHaveClass('mtx-list-item-secondary-action');
  });

  it('avatar por URL o nodo', () => {
    const { container, rerender } = render(<ListItem avatar="a.png" avatarAlt="Ana">Ana</ListItem>);
    expect(container.querySelector('.mtx-list-item-avatar img')).toHaveAttribute('alt', 'Ana');
    rerender(<ListItem avatar={<span className="mtx-avatar">CR</span>}>Carlos</ListItem>);
    expect(container.querySelector('.mtx-list-item-avatar .mtx-avatar')).toHaveTextContent('CR');
  });
});

describe('ListItemButton', () => {
  it('button type=button con ripple, clic y ref', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<ListItemButton ref={ref} onClick={onClick} icon="person">Perfil</ListItemButton>);
    const btn = screen.getByRole('button', { name: /Perfil/ });
    expect(ref.current).toBe(btn);
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('mtx-list-item', 'mtx-list-item-button');
    fireEvent.pointerDown(btn, { button: 0 });
    expect(btn.querySelector('.mtx-ripple-container')).not.toBeNull();
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('selección no controlada: el clic mueve la selección y llama onSelect', async () => {
    const onSelect = vi.fn();
    render(
      <List defaultValue="b" onSelect={onSelect}>
        <li><ListItemButton value="a">A</ListItemButton></li>
        <li><ListItemButton value="b">B</ListItemButton></li>
        <li><ListItemButton value="c" disableSelect>C</ListItemButton></li>
        <li><ListItemButton value="d" disabled>D</ListItemButton></li>
      </List>,
    );
    const [a, b, c, d] = screen.getAllByRole('button');
    expect(b).toHaveClass('mtx-list-item--selected');
    expect(b).toHaveAttribute('aria-current', 'true');
    await userEvent.click(a);
    expect(a).toHaveClass('mtx-list-item--selected');
    expect(b).not.toHaveClass('mtx-list-item--selected');
    expect(b).not.toHaveAttribute('aria-current');
    expect(a).not.toHaveAttribute('aria-selected');
    expect(onSelect).toHaveBeenCalledWith({ item: a, value: 'a' });
    await userEvent.click(c);
    fireEvent.click(d);
    expect(a).toHaveClass('mtx-list-item--selected');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('sin value usa un id generado; selectable=false no selecciona', async () => {
    const { unmount } = render(
      <List>
        <li><ListItemButton>A</ListItemButton></li>
      </List>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveClass('mtx-list-item--selected');
    unmount();
    render(
      <List selectable={false}>
        <li><ListItemButton>B</ListItemButton></li>
      </List>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).not.toHaveClass('mtx-list-item--selected');
  });

  it('selección controlada', async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>('x');
      return (
        <>
          <List value={value} onSelect={({ value: v }) => setValue(v === 'z' ? value : v)}>
            <li><ListItemButton value="x">X</ListItemButton></li>
            <li><ListItemButton value="z">Z</ListItemButton></li>
          </List>
          <button type="button" onClick={() => setValue(null)}>limpiar</button>
        </>
      );
    }
    render(<Controlled />);
    const z = screen.getByRole('button', { name: 'Z' });
    await userEvent.click(z);
    expect(z).not.toHaveClass('mtx-list-item--selected');
    expect(screen.getByRole('button', { name: 'X' })).toHaveClass('mtx-list-item--selected');
    await userEvent.click(screen.getByRole('button', { name: 'limpiar' }));
    expect(screen.getByRole('button', { name: 'X' })).not.toHaveClass('mtx-list-item--selected');
  });

  it('las listas anidadas comparten la selección del padre', async () => {
    render(
      <List defaultValue="sent">
        <li>
          <ListItemButton value="inbox">Inbox</ListItemButton>
          <List nested>
            <li><ListItemButton value="starred">Starred</ListItemButton></li>
          </List>
        </li>
        <li><ListItemButton value="sent">Sent</ListItemButton></li>
      </List>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Starred' }));
    expect(screen.getByRole('button', { name: 'Starred' })).toHaveClass('mtx-list-item--selected');
    expect(screen.getByRole('button', { name: 'Sent' })).not.toHaveClass('mtx-list-item--selected');
  });

  it('ListSelectionProvider comparte una sola selección entre varias List', async () => {
    const onSelect = vi.fn();
    render(
      <ListSelectionProvider defaultValue="a" onSelect={onSelect}>
        <nav>
          <List>
            <li><ListItemButton value="a">A</ListItemButton></li>
          </List>
          <List>
            <li><ListItemButton value="b">B</ListItemButton></li>
          </List>
          <List defaultValue="z">
            <li><ListItemButton value="z">Z</ListItemButton></li>
          </List>
        </nav>
      </ListSelectionProvider>,
    );
    const a = screen.getByRole('button', { name: 'A' });
    const b = screen.getByRole('button', { name: 'B' });
    expect(a).toHaveClass('mtx-list-item--selected');
    await userEvent.click(b);
    expect(b).toHaveClass('mtx-list-item--selected');
    expect(a).not.toHaveClass('mtx-list-item--selected');
    expect(onSelect).toHaveBeenCalledWith({ item: b, value: 'b' });
    // Una List con estado propio mantiene su ámbito independiente.
    expect(screen.getByRole('button', { name: 'Z' })).toHaveClass('mtx-list-item--selected');
  });

  it('sin proveedor, dos List hermanas mantienen selecciones independientes', async () => {
    render(
      <nav>
        <List>
          <li><ListItemButton>A</ListItemButton></li>
        </List>
        <List>
          <li><ListItemButton>B</ListItemButton></li>
        </List>
      </nav>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'A' }));
    await userEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('mtx-list-item--selected');
  });

  it('enlace: aria-current="page"; disabled con aria-disabled y tabindex -1', () => {
    const { rerender } = render(<ListItemButton href="#a" selected>Uno</ListItemButton>);
    const link = screen.getByRole('link', { name: 'Uno' });
    expect(link).toHaveAttribute('aria-current', 'page');
    rerender(<ListItemButton href="#a" disabled>Uno</ListItemButton>);
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(link).toHaveClass('mtx-list-item--disabled');
  });

  it('role option usa aria-selected', () => {
    const { rerender } = render(<ListItemButton component="li" role="option" selected>A</ListItemButton>);
    const opt = screen.getByRole('option');
    expect(opt).toHaveAttribute('aria-selected', 'true');
    expect(opt).not.toHaveAttribute('aria-current');
    rerender(<ListItemButton component="li" role="option" selected={false}>A</ListItemButton>);
    expect(opt).toHaveAttribute('aria-selected', 'false');
  });

  it('elemento no nativo sin rol: role button, Enter y Espacio', () => {
    const onClick = vi.fn();
    render(<ListItemButton component="div" onClick={onClick}>D</ListItemButton>);
    const el = screen.getByRole('button', { name: 'D' });
    expect(el).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(el, { key: 'Enter' });
    fireEvent.keyDown(el, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('expande una lista anidada con Collapse', async () => {
    function Nested() {
      const [open, setOpen] = useState(true);
      return (
        <List>
          <li>
            <ListItemButton aria-expanded={open} disableSelect onClick={() => setOpen(!open)}>Inbox</ListItemButton>
            <Collapse in={open}>
              <List nested aria-label="Sub">
                <li><ListItemButton>Starred</ListItemButton></li>
              </List>
            </Collapse>
          </li>
        </List>
      );
    }
    render(<Nested />);
    const toggle = screen.getByRole('button', { name: 'Inbox' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).not.toHaveClass('mtx-list-item--selected');
  });
});

describe('Partes', () => {
  it('ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction y ListSubheader', () => {
    render(
      <>
        <ListItemText data-testid="t" primary="P" secondary="S" />
        <ListItemIcon data-testid="i" icon="inbox" />
        <ListItemAvatar data-testid="a" />
        <ListItemSecondaryAction data-testid="s" />
        <ListSubheader data-testid="h" component="div" inset sticky>G</ListSubheader>
      </>,
    );
    expect(screen.getByTestId('t').querySelector('.mtx-list-item-text__secondary')).toHaveTextContent('S');
    expect(screen.getByTestId('i')).toHaveClass('mtx-list-item-icon');
    expect(screen.getByTestId('a')).toHaveClass('mtx-list-item-avatar');
    expect(screen.getByTestId('s')).toHaveClass('mtx-list-item-secondary-action');
    const h = screen.getByTestId('h');
    expect(h.tagName).toBe('DIV');
    expect(h).toHaveClass('mtx-list-subheader', 'mtx-list-subheader--inset', 'mtx-list-subheader--sticky');
  });
});

describe('paridad con vanilla', () => {
  it.each([
    [
      '<ul data-mtx="list" aria-label="Mail"><li data-mtx="list-item" data-icon="inbox" data-secondary="3 new">Inbox</li><li data-mtx="list-item" data-icon="send">Sent</li></ul>',
      <List aria-label="Mail">
        <ListItem icon="inbox" secondary="3 new">Inbox</ListItem>
        <ListItem icon="send">Sent</ListItem>
      </List>,
    ],
    [
      '<ul data-mtx="list" data-dense data-disable-padding><li data-mtx="list-item" data-divider data-align-start data-disable-gutters>A</li></ul>',
      <List dense disablePadding>
        <ListItem divider alignItems="flex-start" disableGutters>A</ListItem>
      </List>,
    ],
    [
      '<ul data-mtx="list" data-dense><li><button type="button" data-mtx="list-item-button" data-icon="inbox" data-selected data-secondary="x">Inbox</button></li><li><a href="#" data-mtx="list-item-button" data-disabled>L</a></li><li data-mtx="list-item" data-icon="block" data-disabled>D</li></ul>',
      <List dense>
        <li><ListItemButton icon="inbox" selected secondary="x">Inbox</ListItemButton></li>
        <li><ListItemButton href="#" disabled>L</ListItemButton></li>
        <ListItem icon="block" disabled>D</ListItem>
      </List>,
    ],
    [
      '<ul data-mtx="list"><li data-mtx="list-item" data-avatar="https://example.com/a.png" data-secondary="s">Luis</li></ul>',
      <List>
        <ListItem avatar="https://example.com/a.png" secondary="s">Luis</ListItem>
      </List>,
    ],
    [
      '<ul data-mtx="list"><li class="mtx-list-subheader" data-mtx="list-subheader" data-inset data-sticky>G</li><li data-mtx="list-item"><button type="button" data-mtx="list-item-button" data-disabled>B</button></li></ul>',
      <List subheader={<ListSubheader inset sticky>G</ListSubheader>}>
        <ListItem><ListItemButton disabled>B</ListItemButton></ListItem>
      </List>,
    ],
    [
      '<ul data-mtx="list"><li data-mtx="list-item" data-icon="description" data-secondary="2.4 MB">Annual report.pdf<span class="mtx-list-item-secondary-action"><button aria-label="Delete">x</button></span></li></ul>',
      <List>
        <ListItem icon="description" secondary="2.4 MB" secondaryAction={<button aria-label="Delete">x</button>}>
          Annual report.pdf
        </ListItem>
      </List>,
    ],
    [
      '<ul data-mtx="list"><li><button type="button" data-mtx="list-item-button" data-icon="inbox">Inbox</button><ul data-mtx="list" data-nested><li><button type="button" data-mtx="list-item-button">Starred</button></li></ul></li></ul>',
      <List>
        <li>
          <ListItemButton icon="inbox">Inbox</ListItemButton>
          <List nested>
            <li><ListItemButton>Starred</ListItemButton></li>
          </List>
        </li>
      </List>,
    ],
  ])('%s', async (html, node) => {
    const vanilla = await mountVanilla(html);
    const { container } = render(node);
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });

  it('BEM completo', async () => {
    const vanilla = await mountVanilla(`
      <ul class="mtx-list" data-mtx="list">
        <li class="mtx-list-item" data-mtx="list-item">
          <span class="mtx-list-item-icon" data-mtx="list-item-icon"><span class="material-icons" aria-hidden="true">inbox</span></span>
          <span class="mtx-list-item-text" data-mtx="list-item-text"><span class="mtx-list-item-text__primary">Inbox</span><span class="mtx-list-item-text__secondary">SSR</span></span>
        </li>
        <li class="mtx-list-item" data-mtx="list-item">
          <span class="mtx-list-item-avatar" data-mtx="list-item-avatar"><span class="mtx-avatar">AG</span></span>
          <span class="mtx-list-item-text" data-mtx="list-item-text"><span class="mtx-list-item-text__primary">Anna</span></span>
          <span class="mtx-list-item-secondary-action" data-mtx="list-item-secondary-action"><button aria-label="Mail">m</button></span>
        </li>
      </ul>`);
    const { container } = render(
      <List>
        <ListItem>
          <ListItemIcon icon="inbox" />
          <ListItemText primary="Inbox" secondary="SSR" />
        </ListItem>
        <ListItem>
          <ListItemAvatar><span className="mtx-avatar">AG</span></ListItemAvatar>
          <ListItemText primary="Anna" />
          <ListItemSecondaryAction><button aria-label="Mail">m</button></ListItemSecondaryAction>
        </ListItem>
      </List>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, { ...PARITY, ignoreSelectors: [] });
  });
});
