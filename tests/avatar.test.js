import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Avatar, AvatarGroup } from '../src/components/avatar/avatar.js';

function createAvatar(attrs = {}, text = 'AB') {
  const el = document.createElement('div');
  el.className = 'mtx-avatar';
  el.setAttribute('data-mtx', 'avatar');
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text) el.textContent = text;
  document.body.appendChild(el);
  return el;
}

function createAvatarGroup(attrs = {}, avatarCount = 4) {
  const group = document.createElement('div');
  group.className = 'mtx-avatar-group';
  group.setAttribute('data-mtx', 'avatar-group');
  Object.entries(attrs).forEach(([k, v]) => group.setAttribute(k, v));
  for (let i = 0; i < avatarCount; i++) {
    const avatar = document.createElement('div');
    avatar.className = 'mtx-avatar';
    avatar.textContent = `A${i + 1}`;
    group.appendChild(avatar);
  }
  document.body.appendChild(group);
  return group;
}

describe('Avatar & AvatarGroup', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Avatar', () => {
    it('se inicializa con fallback de texto', () => {
      const el = createAvatar({}, 'JD');
      initAll();
      const avatar = getInstance(el);
      expect(avatar).toBeInstanceOf(Avatar);
      expect(el.classList.contains('mtx-avatar--fallback')).toBe(true);
    });

    it('crea un elemento img si se pasa data-src', () => {
      const el = createAvatar({ 'data-src': 'user.jpg', 'data-alt': 'John Doe' }, '');
      initAll();
      const img = el.querySelector('img');
      expect(img).not.toBeNull();
      expect(img.src).toContain('user.jpg');
      expect(img.alt).toBe('John Doe');
    });

    it('aplica variante de forma y color de fondo', () => {
      const el = createAvatar({ 'data-variant': 'square', 'data-color': 'primary' });
      initAll();
      expect(el.classList.contains('mtx-avatar--square')).toBe(true);
      expect(el.classList.contains('mtx-avatar--primary')).toBe(true);
    });

    it('aplica tamaño personalizado en píxeles', () => {
      const el = createAvatar({ 'data-size': '56' });
      initAll();
      expect(el.style.width).toBe('56px');
      expect(el.style.height).toBe('56px');
    });

    it('maneja el evento de error en imagen generando fallback', () => {
      const el = createAvatar({ 'data-src': 'invalid.jpg', 'data-alt': 'Alice' }, '');
      initAll();
      const avatar = getInstance(el);
      avatar.img.dispatchEvent(new Event('error'));

      expect(el.classList.contains('mtx-avatar--fallback')).toBe(true);
      const fallback = el.querySelector('.mtx-avatar__fallback');
      expect(fallback).not.toBeNull();
      expect(fallback.textContent).toBe('A');
    });
  });

  describe('AvatarGroup', () => {
    it('se inicializa y limita la visibilidad con data-max', () => {
      const groupEl = createAvatarGroup({ 'data-max': '3' }, 5);
      initAll();
      const group = getInstance(groupEl);
      expect(group).toBeInstanceOf(AvatarGroup);
      expect(group.max).toBe(3);

      const surplus = groupEl.querySelector('.mtx-avatar--surplus');
      expect(surplus).not.toBeNull();
      expect(surplus.textContent).toBe('+3');
    });

    it('permite cambiar max y total dinámicamente', () => {
      const groupEl = createAvatarGroup({ 'data-max': '4' }, 6);
      initAll();
      const group = getInstance(groupEl);

      group.max = 3;
      expect(groupEl.querySelector('.mtx-avatar--surplus').textContent).toBe('+4');

      group.total = 10;
      expect(groupEl.querySelector('.mtx-avatar--surplus').textContent).toBe('+8');
    });

    it('limpia el excedente y restaura avatares en destroy()', () => {
      const groupEl = createAvatarGroup({ 'data-max': '3' }, 5);
      initAll();
      const group = getInstance(groupEl);
      group.destroy();

      expect(groupEl.querySelector('.mtx-avatar--surplus')).toBeNull();
      const children = Array.from(groupEl.children);
      expect(children.every((c) => !c.hidden)).toBe(true);
    });
  });
});
