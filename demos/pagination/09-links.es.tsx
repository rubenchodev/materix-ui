import { useState } from 'react';
import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Link mode', es: 'Modo enlaces' };
export const description = {
  en: "With `getItemHref` every item is an `<a href>` that works without JavaScript and with SSR. `onChange` runs before navigating: calling `event.preventDefault()` cancels the navigation and the page changes in the client.",
  es: "Con `getItemHref` cada ítem es un `<a href>` que funciona sin JavaScript y con SSR. `onChange` se ejecuta antes de navegar: llamar a `event.preventDefault()` cancela la navegación y la página cambia en el cliente.",
};

export default function Demo() {
  const [status, setStatus] = useState('Pulsa una página: la navegación se cancela y se gestiona en el cliente.');
  return (
    <div className="demo-stack">
      <Pagination
        count={8}
        defaultPage={3}
        variant="outlined"
        shape="rounded"
        color="primary"
        aria-label="Paginación con enlaces"
        getItemHref={(page) => `?page=${page}`}
        onChange={(event, page) => {
          event.preventDefault();
          setStatus(`Navegación a ?page=${page} cancelada con preventDefault(); página actualizada en el cliente.`);
        }}
      />
      <span className="demo-status" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
