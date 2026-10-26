import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Surfaces in the dark theme', es: 'Superficies en el tema oscuro' };
export const description = {
  en: 'Paper consumes `--mtx-color-background-paper` and `--mtx-color-text-primary`, so it changes with the theme. This block forces `data-mtx-theme="dark"` on a container: as in MUI, each elevation adds a white overlay (`--mtx-overlay-elevation-N`) that lightens the surface the higher it is; `outlined` has no overlay.',
  es: 'Paper consume `--mtx-color-background-paper` y `--mtx-color-text-primary`, así que cambia con el tema. Este bloque fuerza `data-mtx-theme="dark"` en un contenedor: como en MUI, cada elevación añade una capa blanca (`--mtx-overlay-elevation-N`) que aclara la superficie cuanto más alta es; `outlined` no lleva capa.',
};

const box = { width: 120, height: 120 } as const;
const boxClass = 'mtx-d-flex mtx-align-items-center mtx-justify-content-center mtx-text-center';

export default function Demo() {
  return (
    <div className="demo-surface" data-mtx-theme="dark">
      {[0, 1, 4, 8, 24].map((level) => (
        <Paper key={level} elevation={level} className={boxClass} style={box}>
          Elevación {level}
        </Paper>
      ))}
      <Paper variant="outlined" className={boxClass} style={box}>
        Contorneado
      </Paper>
    </div>
  );
}
