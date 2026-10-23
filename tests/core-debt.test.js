import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/index.js';
import { uniqueId } from '../src/core/id.js';

describe('deuda transversal del núcleo', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('uniqueId genera ids que no existen en el documento', () => {
    document.body.innerHTML = '<div id="x-1"></div>';
    const a = uniqueId('x');
    const b = uniqueId('x');
    expect(a).not.toBe(b);
    expect(document.getElementById(a)).toBeNull();
  });

  it('Tabs: varios grupos sin id no producen ids duplicados', () => {
    document.body.innerHTML = `
      <div data-mtx="tabs"><button data-mtx="tab">A</button><button data-mtx="tab">B</button></div>
      <div data-mtx="tabs"><button data-mtx="tab">A</button><button data-mtx="tab">B</button></div>`;
    initAll();
    const ids = Array.from(document.querySelectorAll('.mtx-tab')).map((tab) => tab.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('Tabs: con id en el contenedor conserva el patrón {id}-tab-N', () => {
    document.body.innerHTML = '<div id="t" data-mtx="tabs"><button data-mtx="tab">A</button></div>';
    initAll();
    expect(document.querySelector('.mtx-tab').id).toBe('t-tab-1');
  });

  it('Divider: un elemento que no es <hr> recibe role="separator" y aria-orientation', () => {
    document.body.innerHTML = `
      <hr id="h" data-mtx="divider">
      <div id="v" data-mtx="divider" data-orientation="vertical"></div>
      <li id="l" data-mtx="divider"></li>
      <div id="p" data-mtx="divider" role="presentation"></div>`;
    initAll();
    expect(document.getElementById('h').hasAttribute('role')).toBe(false);
    expect(document.getElementById('v').getAttribute('role')).toBe('separator');
    expect(document.getElementById('v').getAttribute('aria-orientation')).toBe('vertical');
    expect(document.getElementById('l').getAttribute('role')).toBe('separator');
    expect(document.getElementById('l').hasAttribute('aria-orientation')).toBe(false);
    expect(document.getElementById('p').getAttribute('role')).toBe('presentation');
  });

  it('AvatarGroup: data-max funciona con hijos de sintaxis simplificada', () => {
    document.body.innerHTML = `
      <div id="g" data-mtx="avatar-group" data-max="3">
        <span data-mtx="avatar">A</span><span data-mtx="avatar">B</span>
        <span data-mtx="avatar">C</span><span data-mtx="avatar">D</span>
      </div>`;
    initAll();
    const group = document.getElementById('g');
    const visible = Array.from(group.querySelectorAll('[data-mtx="avatar"]')).filter((el) => !el.hidden);
    expect(visible.length).toBe(2);
    const surplus = group.querySelector('.mtx-avatar--surplus');
    expect(surplus.textContent).toBe('+2');
  });

  it('Avatar: la imagen rota queda oculta con hidden y aparece el fallback', () => {
    document.body.innerHTML = '<div id="a" data-mtx="avatar" data-src="nope.png" data-alt="Rosa"></div>';
    initAll();
    const el = document.getElementById('a');
    const img = el.querySelector('img');
    img.dispatchEvent(new Event('error'));
    expect(img.hidden).toBe(true);
    expect(el.classList.contains('mtx-avatar--fallback')).toBe(true);
    expect(el.querySelector('.mtx-avatar__fallback').textContent).toBe('R');
  });

  it('AppBar: añade mtx-app-bar--animated después del primer frame, no al construir', async () => {
    document.body.innerHTML = '<header id="ab" data-mtx="app-bar" data-title="App"></header>';
    initAll();
    const el = document.getElementById('ab');
    expect(el.classList.contains('mtx-app-bar--animated')).toBe(false);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 0))));
    expect(el.classList.contains('mtx-app-bar--animated')).toBe(true);
    expect(getInstance(el)).toBeDefined();
  });

  it('Grid: xs="auto" y xs="true" aplican clases distintas', () => {
    document.body.innerHTML = `<div data-mtx="grid" data-container>
      <div id="a" data-mtx="grid" data-xs="auto"></div><div id="t" data-mtx="grid" data-xs="true"></div></div>`;
    initAll();
    expect(document.getElementById('a').classList.contains('mtx-grid--xs-auto')).toBe(true);
    expect(document.getElementById('t').classList.contains('mtx-grid--xs-true')).toBe(true);
  });
});
