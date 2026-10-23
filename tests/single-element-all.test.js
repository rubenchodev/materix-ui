import { describe, it, expect, beforeEach } from 'vitest';
import { initAll } from '../src/core/registry.js';
import '../src/index.js';

describe('Single-Element Declarative Auto-Scaffolding Across Framework', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('scaffolds Alert with data-title and direct text', () => {
    document.body.innerHTML = '<div data-mtx="alert" data-severity="success" data-title="Operación Exitosa">Cambios guardados</div>';
    initAll();
    const alert = document.querySelector('[data-mtx="alert"]');
    expect(alert.classList.contains('mtx-alert')).toBe(true);
    expect(alert.querySelector('.mtx-alert__title').textContent).toBe('Operación Exitosa');
    expect(alert.querySelector('.mtx-alert__message').textContent).toContain('Cambios guardados');
  });

  it('scaffolds Chip with data-icon and data-label', () => {
    document.body.innerHTML = '<div data-mtx="chip" data-label="React" data-icon="code" data-color="primary"></div>';
    initAll();
    const chip = document.querySelector('[data-mtx="chip"]');
    expect(chip.classList.contains('mtx-chip')).toBe(true);
    expect(chip.querySelector('.mtx-chip__icon').textContent).toBe('code');
    expect(chip.querySelector('.mtx-chip__label').textContent).toBe('React');
  });

  it('scaffolds Badge around child icon', () => {
    document.body.innerHTML = '<div data-mtx="badge" data-content="9" data-color="error"><span class="material-icons">mail</span></div>';
    initAll();
    const badge = document.querySelector('[data-mtx="badge"]');
    expect(badge.classList.contains('mtx-badge')).toBe(true);
    expect(badge.querySelector('.mtx-badge__badge').textContent).toBe('9');
  });

  it('scaffolds Snackbar with data-action', () => {
    document.body.innerHTML = '<div data-mtx="snackbar" data-message="Descartado" data-action="Deshacer"></div>';
    initAll();
    const snackbar = document.querySelector('[data-mtx="snackbar"]');
    expect(snackbar.classList.contains('mtx-snackbar')).toBe(true);
    expect(snackbar.querySelector('.mtx-snackbar__message').textContent).toBe('Descartado');
    expect(snackbar.querySelector('.mtx-snackbar__action').textContent).toBe('Deshacer');
  });

  it('scaffolds Avatar with data-icon and fallback', () => {
    document.body.innerHTML = '<div data-mtx="avatar" data-icon="folder" data-color="secondary"></div>';
    initAll();
    const avatar = document.querySelector('[data-mtx="avatar"]');
    expect(avatar.classList.contains('mtx-avatar')).toBe(true);
    expect(avatar.querySelector('.material-icons').textContent).toBe('folder');
  });

  it('scaffolds Dialog with data-title and content', () => {
    document.body.innerHTML = '<div data-mtx="dialog" id="test-dlg" data-title="Confirmar"><p>¿Seguro?</p></div>';
    initAll();
    const dlg = document.querySelector('#test-dlg');
    expect(dlg.classList.contains('mtx-dialog')).toBe(true);
    expect(dlg.querySelector('.mtx-dialog__backdrop')).not.toBeNull();
    expect(dlg.querySelector('.mtx-dialog__paper')).not.toBeNull();
    expect(dlg.querySelector('.mtx-dialog__title').textContent).toBe('Confirmar');
    expect(dlg.querySelector('.mtx-dialog__content').textContent).toContain('¿Seguro?');
  });

  it('scaffolds Drawer with content', () => {
    document.body.innerHTML = '<div data-mtx="drawer" id="test-drw"><h3>Menú</h3></div>';
    initAll();
    const drw = document.querySelector('#test-drw');
    expect(drw.classList.contains('mtx-drawer')).toBe(true);
    expect(drw.querySelector('.mtx-drawer__content')).not.toBeNull();
    expect(drw.querySelector('.mtx-drawer__content').textContent).toContain('Menú');
  });

  it('scaffolds Tabs and auto-injects indicator and tab classes', () => {
    document.body.innerHTML = `
      <div data-mtx="tabs">
        <button data-mtx="tab" data-icon="home" data-panel="#p1" data-active>Inicio</button>
        <button data-mtx="tab" data-icon="star" data-panel="#p2">Favoritos</button>
      </div>
      <div id="p1">Panel 1</div>
      <div id="p2" hidden>Panel 2</div>
    `;
    initAll();
    const tabs = document.querySelector('[data-mtx="tabs"]');
    expect(tabs.classList.contains('mtx-tabs')).toBe(true);
    expect(tabs.querySelector('.mtx-tabs__indicator')).not.toBeNull();
    const tabBtns = tabs.querySelectorAll('[data-mtx="tab"]');
    expect(tabBtns[0].classList.contains('mtx-tab')).toBe(true);
    expect(tabBtns[0].querySelector('.material-icons').textContent).toBe('home');
  });

  it('scaffolds Table and descendants automatically', () => {
    document.body.innerHTML = `
      <table data-mtx="table">
        <thead><tr><th>Col 1</th></tr></thead>
        <tbody><tr><td>Val 1</td></tr></tbody>
      </table>
    `;
    initAll();
    const table = document.querySelector('table');
    expect(table.classList.contains('mtx-table')).toBe(true);
    expect(table.querySelector('thead').classList.contains('mtx-table-head')).toBe(true);
    expect(table.querySelector('tbody').classList.contains('mtx-table-body')).toBe(true);
    expect(table.querySelector('tr').classList.contains('mtx-table-row')).toBe(true);
    expect(table.querySelector('th').classList.contains('mtx-table-cell')).toBe(true);
    expect(table.querySelector('td').classList.contains('mtx-table-cell')).toBe(true);
  });

  it('scaffolds List and ListItem with data-icon and data-secondary', () => {
    document.body.innerHTML = `
      <ul data-mtx="list">
        <li data-mtx="list-item" data-icon="mail" data-secondary="2 nuevos">Mensajes</li>
      </ul>
    `;
    initAll();
    const list = document.querySelector('ul');
    expect(list.classList.contains('mtx-list')).toBe(true);
    const item = list.querySelector('li');
    expect(item.classList.contains('mtx-list-item')).toBe(true);
    expect(item.querySelector('.mtx-list-item-icon .material-icons').textContent).toBe('mail');
    expect(item.querySelector('.mtx-list-item-text__primary').textContent).toBe('Mensajes');
    expect(item.querySelector('.mtx-list-item-text__secondary').textContent).toBe('2 nuevos');
  });

  it('scaffolds Card with data-title and data-subheader', () => {
    document.body.innerHTML = '<div data-mtx="card" data-title="Tarjeta" data-subheader="Subtítulo"></div>';
    initAll();
    const card = document.querySelector('[data-mtx="card"]');
    expect(card.classList.contains('mtx-card')).toBe(true);
    expect(card.querySelector('.mtx-card__title').textContent).toBe('Tarjeta');
    expect(card.querySelector('.mtx-card__subheader').textContent).toBe('Subtítulo');
  });

  it('scaffolds Paper with data-elevation and data-variant', () => {
    document.body.innerHTML = '<div data-mtx="paper" data-elevation="4"></div>';
    initAll();
    const paper = document.querySelector('[data-mtx="paper"]');
    expect(paper.classList.contains('mtx-paper')).toBe(true);
    expect(paper.classList.contains('mtx-paper--elevation-4')).toBe(true);
  });

  it('scaffolds Divider with data-variant and data-orientation', () => {
    document.body.innerHTML = '<hr data-mtx="divider" data-variant="inset" />';
    initAll();
    const divider = document.querySelector('hr');
    expect(divider.classList.contains('mtx-divider')).toBe(true);
    expect(divider.classList.contains('mtx-divider--inset')).toBe(true);
  });

  it('scaffolds Grid with data-spacing and data-xs/md', () => {
    document.body.innerHTML = `
      <div data-mtx="grid" data-spacing="3">
        <div data-mtx="grid" data-xs="12" data-md="6">Col</div>
      </div>
    `;
    initAll();
    const grid = document.querySelector('[data-spacing="3"]');
    expect(grid.classList.contains('mtx-grid')).toBe(true);
    expect(grid.classList.contains('mtx-grid--container')).toBe(true);
    expect(grid.classList.contains('mtx-grid--spacing-3')).toBe(true);
    const item = grid.querySelector('[data-xs="12"]');
    expect(item.classList.contains('mtx-grid--item')).toBe(true);
    expect(item.classList.contains('mtx-grid--xs-12')).toBe(true);
    expect(item.classList.contains('mtx-grid--md-6')).toBe(true);
  });

  it('scaffolds Typography with semantic tags and attributes', () => {
    document.body.innerHTML = '<h2 data-mtx="typography" data-color="primary">Título</h2>';
    initAll();
    const typo = document.querySelector('h2');
    expect(typo.classList.contains('mtx-typography')).toBe(true);
    expect(typo.classList.contains('mtx-typography--h2')).toBe(true);
    expect(typo.classList.contains('mtx-typography--color-primary')).toBe(true);
  });

  it('scaffolds Link with data-color and data-underline', () => {
    document.body.innerHTML = '<a data-mtx="link" data-color="error" data-underline="always" href="#">Enlace</a>';
    initAll();
    const link = document.querySelector('a');
    expect(link.classList.contains('mtx-link')).toBe(true);
    expect(link.classList.contains('mtx-link--color-error')).toBe(true);
    expect(link.classList.contains('mtx-link--underline-always')).toBe(true);
  });

  it('scaffolds Slider from a single <input type="range">', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" data-value="20,60" data-range data-label="Precio" data-marks="0:0,100:100">';
    initAll();
    const slider = document.querySelector('.mtx-slider');
    expect(slider).not.toBeNull();
    expect(slider.querySelectorAll('.mtx-slider__thumb')).toHaveLength(2);
    expect(slider.querySelectorAll('.mtx-slider__mark-label')).toHaveLength(2);
    expect(slider.querySelector('.mtx-slider__track').style.width).toBe('40%');
  });

  it('scaffolds Stepper from <li data-label>', () => {
    document.body.innerHTML = '<ol data-mtx="stepper" data-active-step="1"><li data-label="Email"></li><li data-label="Código"></li></ol>';
    initAll();
    const stepper = document.querySelector('ol');
    expect(stepper.classList.contains('mtx-stepper')).toBe(true);
    expect(stepper.querySelectorAll('.mtx-step-icon')).toHaveLength(2);
    expect(stepper.querySelector('.mtx-step--active .mtx-step__label').textContent).toBe('Código');
  });
});
