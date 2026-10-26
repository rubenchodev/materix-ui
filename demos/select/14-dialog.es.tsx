import { useState } from 'react';
import { Select } from '@rubenchodev/materix-react/components/select';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Inside a Dialog', es: 'Dentro de un Dialog' };
export const description = {
  en: 'The portaled menu registers itself as an upper layer: the Dialog focus trap lets focus into its search box, Escape closes only the menu and its z-index stays above the dialog.',
  es: 'El menú portado se registra como capa superior: la trampa de foco del Dialog deja entrar el foco en su caja de búsqueda, Escape cierra solo el menú y su z-index queda por encima del diálogo.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState('co');

  return (
    <div className="demo-row">
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Editar país
      </Button>
      <span className="demo-status">país: {country}</span>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="País de envío"
        maxWidth="xs"
        fullWidth
        actions={
          <Button variant="text" onClick={() => setOpen(false)}>
            Listo
          </Button>
        }
      >
        <Select
          label="País"
          search
          value={country}
          onChange={(_, next) => setCountry(next as string)}
          options={[
            { value: 'ar', label: 'Argentina' },
            { value: 'co', label: 'Colombia' },
            { value: 'es', label: 'España' },
            { value: 'mx', label: 'México' },
            { value: 'pe', label: 'Perú' },
          ]}
        />
      </Dialog>
    </div>
  );
}
