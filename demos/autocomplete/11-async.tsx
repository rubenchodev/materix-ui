import { useEffect, useRef, useState } from 'react';
import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import type { AutocompleteOption } from '@rubenchodev/materix-react/components/autocomplete';

export const title = { en: 'Asynchronous loading', es: 'Carga asíncrona' };
export const description = {
  en: 'Listen to `onInputChange` (with `debounce={300}` it waits until the user stops typing), turn on `loading`, fetch the data and pass the new `options`. `filterOptions={false}` leaves filtering to the server. The response is simulated with 800 ms of latency and aborted on unmount.',
  es: 'Escucha `onInputChange` (con `debounce={300}` espera a que el usuario deje de escribir), activa `loading`, pide los datos y pasa las nuevas `options`. `filterOptions={false}` deja el filtrado al servidor. La respuesta se simula con 800 ms de latencia y se cancela al desmontar.',
};

const REPOS = [
  'materix-ui', 'material-ui', 'mui-x', 'vite', 'vitest', 'hugo', 'react', 'vue', 'svelte',
  'angular', 'bootstrap', 'tailwindcss', 'lit', 'preact', 'solid', 'alpine', 'htmx', 'jquery',
];

/**
 * Simula una búsqueda remota con 800 ms de latencia; se cancela con la señal.
 * @param {string} query Texto buscado.
 * @param {AbortSignal} signal Señal de cancelación.
 * @returns {Promise<AutocompleteOption[]>} Resultados.
 */
function searchRepos(query: string, signal: AbortSignal): Promise<AutocompleteOption[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      resolve(
        REPOS.filter((name) => name.includes(q)).map((name, i) => ({
          value: name,
          label: name,
          description: `${1200 - i * 57} stars`,
        })),
      );
    }, 800);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export default function Demo() {
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);

  // Cancela la petición pendiente al desmontar.
  useEffect(() => () => controller.current?.abort(), []);

  const search = (query: string) => {
    controller.current?.abort();
    const text = query.trim();
    if (!text) {
      setOptions([]);
      setLoading(false);
      return;
    }
    const current = new AbortController();
    controller.current = current;
    setLoading(true);
    searchRepos(text, current.signal)
      .then((results) => {
        setOptions(results);
        setLoading(false);
      })
      .catch(() => undefined);
  };

  return (
    <div className="demo-fixed-width">
      <Autocomplete
        label="Repository"
        name="repo"
        startIcon="search"
        debounce={300}
        filterOptions={false}
        options={options}
        loading={loading}
        onInputChange={(_event, value, reason) => {
          if (reason === 'input') search(value);
        }}
      />
    </div>
  );
}
