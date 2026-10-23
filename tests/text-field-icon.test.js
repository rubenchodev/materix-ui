import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/text-field/text-field.js';

describe('TextField single-element filled with icon', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input data-mtx="text-field" data-label="Filled con Icono" data-variant="filled" data-start-icon="email" type="email" />
    `;
  });

  it('generates proper DOM structure', () => {
    initAll();
    const wrapper = document.querySelector('.mtx-text-field');
    console.log(wrapper.outerHTML);
    expect(wrapper.classList.contains('mtx-text-field--filled')).toBe(true);
    expect(wrapper.classList.contains('mtx-text-field--adorned-start')).toBe(true);
    expect(wrapper.querySelector('.mtx-text-field__adornment--start')).not.toBeNull();
  });
});
