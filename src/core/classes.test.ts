import { describe, expect, it } from 'vitest';
import { cx, mtxClasses } from './classes';

describe('cx', () => {
  it('concatena cadenas e ignora falsy', () => {
    expect(cx('a', false, null, undefined, 0, '', 'b', ' c ')).toBe('a b c');
    expect(cx()).toBe('');
  });
});

describe('mtxClasses', () => {
  it('genera bloque y modificadores BEM', () => {
    expect(mtxClasses('button', { contained: true, disabled: false, size: 'small', color: undefined })).toBe(
      'mtx-button mtx-button--contained mtx-button--small',
    );
  });

  it('no duplica el prefijo y funciona sin modificadores', () => {
    expect(mtxClasses('mtx-chip')).toBe('mtx-chip');
    expect(mtxClasses('chip', { '': true })).toBe('mtx-chip mtx-chip--');
  });
});
