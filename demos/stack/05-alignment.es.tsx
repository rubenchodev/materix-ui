import './demo.css';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Alignment', es: 'Alineación' };

export const description = {
  en: '`alignItems` aligns on the cross axis (`start`, `center`, `end`, `stretch`, `baseline`) and `justifyContent` distributes along the main axis (`start`, `center`, `end`, `between`, `around`, `evenly`). CSS values are accepted too (`flex-start`, `space-between`…).',
  es: '`alignItems` alinea en el eje cruzado (`start`, `center`, `end`, `stretch`, `baseline`) y `justifyContent` distribuye en el eje principal (`start`, `center`, `end`, `between`, `around`, `evenly`). También se aceptan los valores CSS (`flex-start`, `space-between`…).',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">alignItems=&quot;center&quot;</span>
        <Stack className="demo-stack-frame" direction="row" spacing={2} alignItems="center">
          <div className="demo-stack-item">bajo</div>
          <div className="demo-stack-item demo-stack-item--tall">alto</div>
          <div className="demo-stack-item">bajo</div>
        </Stack>
      </div>
      <div className="demo-group">
        <span className="demo-label">alignItems=&quot;end&quot;</span>
        <Stack className="demo-stack-frame" direction="row" spacing={2} alignItems="end">
          <div className="demo-stack-item">bajo</div>
          <div className="demo-stack-item demo-stack-item--tall">alto</div>
          <div className="demo-stack-item">bajo</div>
        </Stack>
      </div>
      <div className="demo-group">
        <span className="demo-label">justifyContent=&quot;between&quot;</span>
        <Stack className="demo-stack-frame" direction="row" justifyContent="between">
          <div className="demo-stack-item">inicio</div>
          <div className="demo-stack-item">centro</div>
          <div className="demo-stack-item">fin</div>
        </Stack>
      </div>
      <div className="demo-group">
        <span className="demo-label">justifyContent=&quot;center&quot;</span>
        <Stack className="demo-stack-frame" direction="row" spacing={1} justifyContent="center">
          <div className="demo-stack-item">A</div>
          <div className="demo-stack-item">B</div>
        </Stack>
      </div>
      <div className="demo-group">
        <span className="demo-label">Columna · alignItems=&quot;center&quot;</span>
        <Stack className="demo-stack-frame" spacing={1} alignItems="center">
          <div className="demo-stack-item">Elemento estrecho</div>
          <div className="demo-stack-item">Elemento algo más ancho</div>
        </Stack>
      </div>
    </div>
  );
}
