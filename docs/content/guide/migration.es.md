---
title: "Migración desde vanilla"
description: "Pasa de la librería vanilla a React: los atributos data-* se convierten en props, los eventos mtx:* en callbacks, Materix.theme en useTheme y la inicialización desaparece."
weight: 60
icon: "swap_horiz"
---

La versión React conserva el CSS, los tokens `--mtx-*` y el aspecto de [Materix UI vanilla](https://qualitycode.dev/materix-ui/vainilla/es/). Lo que cambia es cómo describes y controlas los componentes: React gestiona el DOM, así que no hay atributos `data-mtx`, ni inicialización automática, ni instancias que buscar.

## Modelo mental

| Vanilla | React |
|---|---|
| `<link>` a `materix.min.css` + `<script>` UMD | `import '@rubenchodev/materix-ui/base.css'` una vez + imports con nombre |
| `data-mtx="dialog"` en un elemento | Componente `<Dialog>` |
| Atributos `data-*` (`data-variant`, `data-label`…) | Props (`variant`, `label`…) |
| Estructura interna autogenerada (sintaxis de un solo elemento) | El componente renderiza su propia estructura |
| `Materix.initAll()`, `Materix.watch()`, `getInstance()` | No hacen falta: React monta y actualiza los componentes |
| Métodos de instancia (`dialog.open()`, `button.disable()`) | Estado + props (`open`, `disabled`) o una `ref` |
| Eventos `mtx:{componente}:{acción}` en el elemento | Props de callback (`onClose`, `onChange`…) |
| `Materix.theme.set()` / `toggle()` | `useTheme().setMode()` / `toggle()` |
| Botones `data-mtx-theme-toggle` | Un botón que llama a `useTheme().toggle` |
| `Materix.i18n` / `data-mtx-locale` | `I18nProvider`, prop `locale`, `addLocale()` |

## Los atributos pasan a ser props

Los atributos `data-*` se convierten en props camelCase con el mismo significado. Los atributos booleanos pasan a props booleanas.

```html
<!-- Vanilla -->
<input data-mtx="text-field" data-label="Correo" data-variant="outlined"
       data-start-icon="email" data-helper-text="Nunca lo compartimos" required />
```

```tsx
// React
<TextField label="Correo" variant="outlined" startIcon="email"
           helperText="Nunca lo compartimos" required />
```

Las clases modificadoras BEM (`mtx-button--contained`, `mtx-button--small`) también pasan a props (`variant="contained"`, `size="small"`). La página de cada componente lista sus props y tipos exactos.

## Las llamadas imperativas pasan a estado

```js
// Vanilla
const dialog = Materix.getInstance(document.querySelector('#confirm'));
dialog.open();
document.querySelector('#confirm').addEventListener('mtx:dialog:close', save);
```

```tsx
// React
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Eliminar</Button>
<Dialog open={open} onClose={() => { setOpen(false); save(); }}>…</Dialog>
```

## Tema e idioma

```js
// Vanilla
Materix.theme.configure({ persist: true });
Materix.theme.toggle();
```

```tsx
// React
<MaterixProvider defaultMode="system">   {/* persiste en localStorage por defecto */}
  <App />
</MaterixProvider>

const { toggle } = useTheme();
```

Ambas versiones usan el mismo atributo `data-mtx-theme` en `<html>`, así que el CSS propio escrito para temas vanilla sigue funcionando. Consulta [Temas]({{< relref "/guide/theming" >}}) e [Internacionalización]({{< relref "/guide/i18n" >}}).

{{< callout type="tip" title="Migración gradual" >}}
Ambos paquetes comparten la misma hoja de estilos, así que una página puede mezclar marcado vanilla renderizado en servidor e islas React durante la migración. Carga el CSS una sola vez y deja que cada parte gestione su propio DOM.
{{< /callout >}}
