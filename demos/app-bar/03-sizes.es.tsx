import { AppBar } from '@rubenchodev/materix-react/components/app-bar';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'Regular Toolbar: 56px on mobile and 64px from 600px. `dense` reduces it to 48px, `toolbarVariant="prominent"` raises it to 128px with the title at the bottom and `disableGutters` removes the side gutters.',
  es: 'Toolbar normal: 56px en móvil y 64px desde 600px. `dense` la reduce a 48px, `toolbarVariant="prominent"` la eleva a 128px con el título abajo y `disableGutters` quita los márgenes laterales.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <p className="demo-label">Regular · 56px (64px desde 600px)</p>
        <AppBar position="static" color="primary" title="Regular" startIcon="menu" endIcon="search" endIconLabel="Buscar" />
      </div>
      <div className="demo-group">
        <p className="demo-label">Dense · 48px</p>
        <AppBar position="static" color="primary" dense title="Dense" startIcon="menu" endIcon="search" endIconLabel="Buscar" />
      </div>
      <div className="demo-group">
        <p className="demo-label">Prominent · 128px</p>
        <AppBar
          position="static"
          color="primary"
          toolbarVariant="prominent"
          title="Prominent"
          startIcon="menu"
          endIcon="search"
          endIconLabel="Buscar"
        />
      </div>
      <div className="demo-group">
        <p className="demo-label">disableGutters</p>
        <AppBar position="static" color="default" disableGutters title="Sin márgenes laterales" />
      </div>
    </div>
  );
}
