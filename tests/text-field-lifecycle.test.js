import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance, destroy } from '../src/core/registry.js';
import '../src/index.js';

describe('TextField lifecycle (destroy + re-init)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('does not duplicate input handlers after destroy + initAll', () => {
    document.body.innerHTML = '<input id="tf" data-mtx="text-field" data-label="Name" />';
    initAll();
    const input = document.getElementById('tf');
    const first = getInstance(input);
    first.destroy();

    initAll();
    const second = getInstance(input);
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);

    const spyOld = vi.spyOn(first, '_syncAria');
    const spyNew = vi.spyOn(second, '_syncAria');
    input.dispatchEvent(new Event('input'));
    expect(spyOld).not.toHaveBeenCalled();
    expect(spyNew).toHaveBeenCalledTimes(1);
  });

  it('does not wrap the input twice when re-initialized after destroy', () => {
    document.body.innerHTML = '<div id="host"><input id="tf" data-mtx="text-field" data-label="Name" /></div>';
    const host = document.getElementById('host');
    initAll(host);
    destroy(document.getElementById('tf'));
    initAll(host);
    initAll(host);

    expect(host.querySelectorAll('.mtx-text-field').length).toBe(1);
    expect(host.querySelectorAll('.mtx-text-field__container').length).toBe(1);
    expect(host.querySelectorAll('.mtx-text-field__label').length).toBe(1);
    const input = document.getElementById('tf');
    const wrapper = host.querySelector('.mtx-text-field');
    expect(getInstance(input)).toBe(getInstance(wrapper));
  });

  it('ignores the pending paste timeout once destroyed', () => {
    vi.useFakeTimers();
    try {
      document.body.innerHTML = '<input id="tf" data-mtx="text-field" data-label="Name" />';
      initAll();
      const input = document.getElementById('tf');
      const field = getInstance(input);
      const spy = vi.spyOn(field, '_syncAria');
      input.dispatchEvent(new Event('paste'));
      field.destroy();
      vi.runAllTimers();
      expect(spy).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('rebinds the password toggle to the new instance after re-init', () => {
    document.body.innerHTML =
      '<input id="pw" type="password" data-mtx="text-field" data-label="Password" data-password-toggle />';
    initAll();
    const input = document.getElementById('pw');
    const first = getInstance(input);
    const button = first.passwordToggle;
    first.destroy();

    initAll();
    const second = getInstance(input);
    expect(second.passwordToggle).toBe(button);
    expect(document.querySelectorAll('.mtx-text-field__action').length).toBe(1);

    const spyOld = vi.spyOn(first, 'togglePasswordVisibility');
    button.click();
    expect(spyOld).not.toHaveBeenCalled();
    expect(input.type).toBe('text');
    expect(second.passwordVisible).toBe(true);
  });

  it('removes action adornment listeners on destroy', () => {
    document.body.innerHTML =
      '<input id="s" data-mtx="text-field" data-label="Search" data-end-action="search" data-end-action-label="Search" />';
    initAll();
    const field = getInstance(document.getElementById('s'));
    const button = field.endAction;
    const handler = vi.fn();
    field.element.addEventListener('mtx:text-field:adornment-click', handler);
    field.destroy();
    button.click();
    expect(handler).not.toHaveBeenCalled();
  });

  it('emits a single adornment-click per click on first init and after re-init', () => {
    document.body.innerHTML =
      '<input id="s" data-mtx="text-field" data-label="Search" data-start-action="search" data-start-action-label="Search" />';
    initAll();
    const input = document.getElementById('s');
    const wrapper = getInstance(input).element;
    const handler = vi.fn();
    wrapper.addEventListener('mtx:text-field:adornment-click', handler);
    getInstance(input).startAction.click();
    expect(handler).toHaveBeenCalledTimes(1);

    getInstance(input).destroy();
    initAll();
    handler.mockClear();
    getInstance(input).startAction.click();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll('.mtx-text-field__action').length).toBe(1);
  });
});
