import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

const css = readFileSync('src/components/text-field/text-field.css', 'utf8');

/**
 * Devuelve el cuerpo de la última regla cuyo selector contiene `needle`.
 * @param {string} needle Fragmento del selector.
 * @returns {{index: number, body: string}} Posición y declaraciones.
 */
const lastRule = (needle) => {
  const index = css.lastIndexOf(needle);
  const open = css.indexOf('{', index);
  return { index, body: css.slice(open + 1, css.indexOf('}', open)) };
};

describe('TextField CSS: alineación horizontal label/texto (AGENTS §2.1.3)', () => {
  it('usa translate(32px) para el label con icono inicial en todas las variantes y tamaños', () => {
    expect(css).not.toMatch(/translate\((26|36)px/);
  });

  it('anula el padding horizontal del lado adornado después de cualquier regla de padding', () => {
    const start = lastRule('.mtx-text-field.mtx-text-field--adorned-start .mtx-text-field__container .mtx-text-field__input');
    const end = lastRule('.mtx-text-field.mtx-text-field--adorned-end .mtx-text-field__container .mtx-text-field__input');
    expect(start.body).toMatch(/padding-left:\s*0/);
    expect(end.body).toMatch(/padding-right:\s*0/);
    // Ninguna regla con `padding:` abreviado del input puede ir detrás de la anulación.
    const tail = css.slice(Math.min(start.index, end.index));
    expect(tail).not.toMatch(/\.mtx-text-field__input\s*\{[^}]*padding:/);
  });

  it('el padding 14px de multiline small solo aplica a outlined', () => {
    expect(css).not.toMatch(/\.mtx-text-field--multiline\.mtx-text-field--small \.mtx-text-field__input \{[^}]*padding:/);
    expect(lastRule('.mtx-text-field--multiline.mtx-text-field--outlined.mtx-text-field--small .mtx-text-field__input').body)
      .toMatch(/padding:\s*8\.5px 14px/);
    expect(lastRule('.mtx-text-field--multiline.mtx-text-field--filled.mtx-text-field--small .mtx-text-field__input').body)
      .toMatch(/padding:\s*8\.5px 12px/);
    expect(lastRule('.mtx-text-field--multiline.mtx-text-field--standard.mtx-text-field--small .mtx-text-field__input').body)
      .toMatch(/padding:\s*8\.5px 0/);
  });

  it('outlined con adorno usa el inset de 14px del label (MUI OutlinedInput)', () => {
    expect(lastRule('.mtx-text-field--outlined .mtx-text-field__container:has(.mtx-text-field__adornment--start)').body)
      .toMatch(/padding-left:\s*14px/);
  });
});
