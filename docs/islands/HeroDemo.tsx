/**
 * Isla de la portada: chips seleccionables y acciones con clases de Materix.
 * Solo usa CSS de la librería para no depender de componentes aún en desarrollo.
 */
import { useId, useState } from 'react';

/** Textos de la isla (los inyecta Hugo en data-island-props). */
export interface HeroDemoProps {
  title?: string;
  subtitle?: string;
  chips?: string[];
  /** Plantilla del contador; `{n}` se sustituye por el número de chips activos. */
  selected?: string;
  reset?: string;
  submit?: string;
}

/**
 * Tarjeta interactiva de la portada.
 * @param {HeroDemoProps} props Textos traducidos.
 * @returns {JSX.Element} Tarjeta.
 */
export function HeroDemo({
  title = 'Pick your interests',
  subtitle = '',
  chips = [],
  selected = '{n} selected',
  reset = 'Clear',
  submit = 'Continue',
}: HeroDemoProps) {
  const [active, setActive] = useState<boolean[]>(() => chips.map((_, i) => i === 0));
  const statusId = useId();
  const count = active.filter(Boolean).length;

  const toggle = (index: number) => setActive((prev) => prev.map((on, i) => (i === index ? !on : on)));

  return (
    <>
      <div className="doc-hero-card-head">
        <span className="doc-hero-card-title">{title}</span>
        {subtitle && <span className="doc-hero-card-sub">{subtitle}</span>}
      </div>
      <div className="doc-hero-chips" role="group" aria-label={title} aria-describedby={statusId}>
        {chips.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={active[i]}
            className={`mtx-chip mtx-chip--clickable${active[i] ? ' mtx-chip--primary' : ' mtx-chip--outlined'}`}
            onClick={() => toggle(i)}
          >
            {active[i] && (
              <span className="mtx-chip__icon material-icons" aria-hidden="true">
                check
              </span>
            )}
            <span className="mtx-chip__label">{label}</span>
          </button>
        ))}
      </div>
      <p className="doc-hero-card-sub" id={statusId} aria-live="polite">
        {selected.replace('{n}', String(count))}
      </p>
      <div className="doc-hero-card-actions">
        <button
          type="button"
          className="mtx-button mtx-button--text"
          disabled={count === 0}
          onClick={() => setActive(chips.map(() => false))}
        >
          {reset}
        </button>
        <button type="button" className="mtx-button mtx-button--contained" disabled={count === 0}>
          {submit}
        </button>
      </div>
    </>
  );
}
