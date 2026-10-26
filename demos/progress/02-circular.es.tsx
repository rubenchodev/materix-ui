import { CircularProgress } from '@rubenchodev/materix-react/components/progress';

export const title = { en: 'Circular', es: 'Circular' };
export const description = {
  en: "As in MUI: `indeterminate` (spins with a stroke that grows and shrinks), `determinate` (an arc proportional to `value`) and `disableShrink` (spin only, useful when the main thread is very busy). `track` adds the background ring.",
  es: "Como en MUI: `indeterminate` (gira con un trazo que crece y se encoge), `determinate` (un arco proporcional a `value`) y `disableShrink` (solo gira, útil cuando el hilo principal está muy ocupado). `track` añade el anillo de fondo.",
};

export default function Demo() {
  return (
    <div className="demo-grid-4">
      <div className="demo-group">
        <span className="demo-label">Indeterminado</span>
        <div className="demo-row">
          <CircularProgress />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Sin encogimiento</span>
        <div className="demo-row">
          <CircularProgress disableShrink />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Determinado · 25 / 50 / 100</span>
        <div className="demo-row">
          <CircularProgress value={25} />
          <CircularProgress value={50} />
          <CircularProgress value={100} />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Con pista</span>
        <div className="demo-row">
          <CircularProgress value={65} track />
          <CircularProgress track />
        </div>
      </div>
    </div>
  );
}
