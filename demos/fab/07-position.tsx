import { Fab } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'Position', es: 'Posición' };
export const description = {
  en: '`position="fixed-br"` and `"fixed-bl"` pin the FAB 24px from the bottom-right or bottom-left corner of the window. `"absolute-center"` centers it over the top edge of its positioned container, as in a bottom bar.',
  es: '`position="fixed-br"` y `"fixed-bl"` fijan el FAB a 24px de la esquina inferior derecha o izquierda de la ventana. `"absolute-center"` lo centra sobre el borde superior de su contenedor posicionado, como en una barra inferior.',
};

export default function Demo() {
  return (
    <div className="demo-group">
      <span className="demo-label">absolute-center over a bottom bar</span>
      <div className="demo-panel demo-panel--tall">
        <p className="mtx-m-0 mtx-p-2">Screen content. The FAB stays centered and sits on top of the bar.</p>
        {/* Barra inferior simulada (decorativa): 56px como un BottomAppBar de MUI. */}
        <div className="mtx-position-absolute mtx-start-0 mtx-end-0 mtx-bottom-0 mtx-bg-primary" style={{ height: 56 }}>
          <Fab icon="add" color="secondary" position="absolute-center" aria-label="Create post" />
        </div>
      </div>
    </div>
  );
}
