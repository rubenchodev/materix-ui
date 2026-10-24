import './demo.css';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Dividers', es: 'Divisores' };

export const description = {
  en: '`divider` inserts a `Divider` between each pair of children: horizontal in a column and vertical in a row (also when the direction changes per breakpoint). They are decorative (`aria-hidden="true"`).',
  es: '`divider` inserta un `Divider` entre cada par de hijos: horizontal en columna y vertical en fila (también cuando la dirección cambia por breakpoint). Son decorativos (`aria-hidden="true"`).',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Row with dividers</span>
        <Stack direction="row" spacing={2} divider>
          <div className="demo-stack-item">Inbox</div>
          <div className="demo-stack-item">Sent</div>
          <div className="demo-stack-item">Spam</div>
        </Stack>
      </div>
      <div className="demo-group">
        <span className="demo-label">Column with dividers</span>
        <Stack spacing={1} divider>
          <div className="demo-stack-item">Inbox</div>
          <div className="demo-stack-item">Sent</div>
          <div className="demo-stack-item">Spam</div>
        </Stack>
      </div>
    </div>
  );
}
