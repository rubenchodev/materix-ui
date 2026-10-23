import { describe, it, expect, beforeEach } from 'vitest';
import { initAll } from '../src/core/registry.js';
import '../src/components/chip/chip.js';
import '../src/components/avatar/avatar.js';
import '../src/components/speed-dial/speed-dial.js';
import '../src/components/card/card.js';
import { getInstance } from '../src/core/registry.js';

describe('A20 — etiquetas accesibles traducidas (en por defecto, es por lang)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
  });

  it('Chip: icono de eliminar (title traducido, no enfocable)', () => {
    document.body.innerHTML = '<div data-mtx="chip" data-label="React" data-deletable></div>'
      + '<div lang="es"><div data-mtx="chip" data-label="Vue" data-deletable></div></div>';
    initAll();
    const [en, es] = document.querySelectorAll('.mtx-chip__delete');
    expect(en.getAttribute('title')).toBe('Delete');
    expect(es.getAttribute('title')).toBe('Eliminar');
    expect(en.tagName).toBe('SPAN');
    expect(en.getAttribute('aria-hidden')).toBe('true');
  });

  it('AvatarGroup: indicador +N', () => {
    const avatars = '<div class="mtx-avatar">A</div><div class="mtx-avatar">B</div><div class="mtx-avatar">C</div>';
    document.body.innerHTML = `<div data-mtx="avatar-group" data-max="2">${avatars}</div>`
      + `<div lang="es"><div data-mtx="avatar-group" data-max="2">${avatars}</div></div>`;
    initAll();
    const labels = Array.from(document.querySelectorAll('.mtx-avatar-group'))
      .map((group) => Array.from(group.querySelectorAll('[aria-label]')).map((el) => el.getAttribute('aria-label')).join('|'));
    expect(labels[0]).toMatch(/\d+ more/);
    expect(labels[1]).toMatch(/\d+ más/);
  });

  it('SpeedDial: FAB generado y acciones nombradas desde data-tooltip', () => {
    document.body.innerHTML = '<div data-mtx="speed-dial" data-icon="add">'
      + '<button data-icon="share" data-tooltip="Share"></button>'
      + '<button data-icon="print" data-tooltip="Print" aria-label="Print page"></button></div>';
    initAll();
    const fab = document.querySelector('.mtx-speed-dial__fab');
    expect(fab.getAttribute('aria-label')).toBe('Actions');
    const actions = document.querySelectorAll('.mtx-speed-dial__action');
    expect(actions[0].getAttribute('aria-label')).toBe('Share');
    expect(actions[1].getAttribute('aria-label')).toBe('Print page');
  });

  it('SpeedDial: acciones fuera del orden de tabulación mientras está cerrado', () => {
    document.body.innerHTML = '<div data-mtx="speed-dial" data-icon="add">'
      + '<button data-icon="share" data-tooltip="Share"></button></div>';
    initAll();
    const el = document.querySelector('.mtx-speed-dial');
    const container = el.querySelector('.mtx-speed-dial__actions');
    const action = el.querySelector('.mtx-speed-dial__action');
    const fab = el.querySelector('.mtx-speed-dial__fab');
    expect(fab.getAttribute('aria-controls')).toBe(container.id);
    expect(container.getAttribute('aria-hidden')).toBe('true');
    expect(action.getAttribute('tabindex')).toBe('-1');
    getInstance(el).open();
    expect(container.hasAttribute('aria-hidden')).toBe(false);
    expect(action.hasAttribute('tabindex')).toBe(false);
    getInstance(el).close();
    expect(action.getAttribute('tabindex')).toBe('-1');
  });

  it('SpeedDial en español', () => {
    document.body.innerHTML = '<div lang="es"><div data-mtx="speed-dial" data-icon="add"></div></div>';
    initAll();
    expect(document.querySelector('.mtx-speed-dial__fab').getAttribute('aria-label')).toBe('Acciones');
  });

  it('Card: botón de acción de la cabecera y media con texto alternativo', () => {
    document.body.innerHTML = '<div data-mtx="card" data-title="Paella" data-action-icon="more_vert" data-image="a.jpg" data-image-alt="Shrimp paella"></div>'
      + '<div lang="es"><div data-mtx="card" data-title="Paella" data-action-icon="more_vert" data-image="b.jpg"></div></div>';
    initAll();
    const [cardEn, cardEs] = document.querySelectorAll('.mtx-card');
    expect(cardEn.querySelector('.mtx-card__header-action button').getAttribute('aria-label')).toBe('Actions');
    expect(cardEs.querySelector('.mtx-card__header-action button').getAttribute('aria-label')).toBe('Acciones');
    const mediaEn = cardEn.querySelector('.mtx-card__media');
    expect(mediaEn.getAttribute('role')).toBe('img');
    expect(mediaEn.getAttribute('aria-label')).toBe('Shrimp paella');
    expect(cardEs.querySelector('.mtx-card__media').getAttribute('aria-hidden')).toBe('true');
  });

  it('CardMedia <img> sin alt se marca decorativa (alt="")', () => {
    document.body.innerHTML = '<img data-mtx="card-media" src="x.jpg">';
    initAll();
    expect(document.querySelector('img').getAttribute('alt')).toBe('');
  });
});
