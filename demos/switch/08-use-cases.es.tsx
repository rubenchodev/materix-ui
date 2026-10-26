import { useEffect, useState } from 'react';
import { Switch } from '@rubenchodev/materix-react/components/switch';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: "A settings panel where each switch applies the change immediately, with no \"Save\" button. Turning on \"Dark mode\" really changes this page's theme.",
  es: "Un panel de ajustes donde cada interruptor aplica el cambio al instante, sin botón «Guardar». Activar «Modo oscuro» cambia de verdad el tema de esta página.",
};

/** Lee el tema activo de la página (`<html data-mtx-theme>`). */
const isDarkPage = () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-mtx-theme') === 'dark';

export default function Demo() {
  const [dark, setDark] = useState(false);

  // Sincroniza el interruptor con el tema real de la página (también si se cambia desde la barra superior).
  useEffect(() => {
    const root = document.documentElement;
    setDark(isDarkPage());
    const observer = new MutationObserver(() => setDark(isDarkPage()));
    observer.observe(root, { attributes: true, attributeFilter: ['data-mtx-theme'] });
    return () => observer.disconnect();
  }, []);

  const handleTheme = (next: boolean) => {
    const theme = next ? 'dark' : 'light';
    const root = document.documentElement;
    root.setAttribute('data-mtx-theme', theme);
    root.style.colorScheme = theme;
    document.dispatchEvent(new CustomEvent('demo:themechange', { detail: { theme } }));
  };

  return (
    <div className="demo-panel demo-fixed-width">
      <span className="demo-label">Preferencias</span>
      <Switch label="Modo oscuro" checked={dark} onChange={(_, next) => handleTheme(next)} />
      <Switch label="Reproducir vídeos automáticamente" defaultChecked />
      <Switch label="Mostrar vista previa de enlaces" defaultChecked />
    </div>
  );
}
