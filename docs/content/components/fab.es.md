---
title: "Fab"
description: "Botón de acción flotante para la acción principal de una pantalla: circular (56/48/40px) o extendido con texto (48px)."
group: "inputs"
icon: "add_circle"
weight: 30
example: "fab"
mui: "https://mui.com/material-ui/react-floating-action-button/"
---

**Fab** (Floating Action Button) representa la acción principal o más frecuente de una pantalla —redactar, crear, añadir— y flota sobre el contenido con elevación alta. Usa como máximo uno por pantalla. Para acciones secundarias usa un [Button](../button/); para acciones compactas en barras o filas, un [Icon Button](../icon-button/).

## Uso básico

Un `<button>` vacío con `data-mtx="fab"` y `data-icon` genera un FAB circular; si añades `data-label` se convierte en extendido con texto. El FAB circular necesita `aria-label`.

{{< mtx-demo title="Uso básico" >}}
<button data-mtx="fab" data-icon="add" aria-label="Crear"></button>
<button data-mtx="fab" data-icon="edit" data-color="secondary" aria-label="Editar"></button>
<button data-mtx="fab" data-icon="navigation" data-label="Navegar"></button>
{{< /mtx-demo >}}

## Variantes

- **Circular** (predeterminado): solo icono, 56px.
- **Extendido** (`mtx-fab--extended`): icono y texto, 48px de alto. Se activa automáticamente con `data-label`, o con `data-variant="extended"` si escribes tú el contenido. Usa el extendido cuando el icono por sí solo no sea suficientemente claro.

{{< mtx-demo title="Circular y extendido" >}}
<button data-mtx="fab" data-icon="add" aria-label="Crear"></button>
<button data-mtx="fab" data-icon="add" data-label="Nuevo ticket"></button>
{{< /mtx-demo >}}

## Tamaños

Con `data-size`. A diferencia de Button, el tamaño predeterminado del FAB es **large**.

| Tamaño | `data-size` | Circular | Extendido | Se alinea con |
| :--- | :--- | :--- | :--- | :--- |
| Large | — (predeterminado) | 56px | 48px | Text Field medium (56px) |
| Medium | `medium` | 48px | 40px | Button large, Icon Button large |
| Small | `small` | 40px | 34px | Button medium, Text Field small |

{{< mtx-demo title="Tamaños circulares" >}}
<button data-mtx="fab" data-icon="add" aria-label="Crear (large)"></button>
<button data-mtx="fab" data-icon="add" data-size="medium" aria-label="Crear (medium)"></button>
<button data-mtx="fab" data-icon="add" data-size="small" aria-label="Crear (small)"></button>
{{< /mtx-demo >}}

{{< mtx-demo title="Tamaños extendidos" >}}
<button data-mtx="fab" data-icon="add" data-label="Crear"></button>
<button data-mtx="fab" data-icon="add" data-label="Crear" data-size="medium"></button>
<button data-mtx="fab" data-icon="add" data-label="Crear" data-size="small"></button>
{{< /mtx-demo >}}

## Con iconos

Combina `data-icon` y `data-label` según lo que quieras comunicar: solo icono, icono y texto, o solo texto. El icono generado es decorativo (`aria-hidden="true"`); el texto de `data-label` es el nombre accesible del extendido.

{{< mtx-demo title="Combinaciones" >}}
<button data-mtx="fab" data-icon="favorite" aria-label="Me gusta"></button>
<button data-mtx="fab" data-icon="shopping_cart" data-label="Comprar"></button>
<button data-mtx="fab" data-label="Continuar"></button>
{{< /mtx-demo >}}

## Colores

Primary es el predeterminado. `data-color` acepta los colores de la paleta y `default`, una superficie neutra con borde, útil cuando la pantalla ya tiene mucho color primario.

{{< mtx-demo title="Colores" >}}
<button data-mtx="fab" data-icon="add" aria-label="Primary"></button>
<button data-mtx="fab" data-icon="edit" data-color="secondary" aria-label="Secondary"></button>
<button data-mtx="fab" data-icon="favorite" data-color="default" aria-label="Default"></button>
<button data-mtx="fab" data-icon="check" data-color="success" aria-label="Success"></button>
<button data-mtx="fab" data-icon="delete" data-color="error" aria-label="Error"></button>
<button data-mtx="fab" data-icon="warning" data-color="warning" aria-label="Warning"></button>
<button data-mtx="fab" data-icon="info" data-color="info" aria-label="Info"></button>
{{< /mtx-demo >}}

## Estados

En hover y con foco la elevación sube de 6 a 12; con teclado aparece además un anillo de foco. Con el atributo `disabled` pierde color y sombra.

{{< mtx-demo title="Deshabilitado" >}}
<button data-mtx="fab" data-icon="add" aria-label="Crear" disabled></button>
<button data-mtx="fab" data-icon="add" data-label="Crear" disabled></button>
{{< /mtx-demo >}}

## Posición

Clases utilitarias de posicionamiento:

- `mtx-fab--fixed-br` / `mtx-fab--fixed-bl`: fijo a 24px de la esquina inferior derecha / izquierda de la ventana.
- `mtx-fab--absolute-center`: centrado horizontalmente y montado sobre el borde superior de su contenedor posicionado (por ejemplo, una barra inferior).

```html
<!-- Fijo en la esquina inferior derecha de la ventana -->
<button data-mtx="fab" data-icon="add" class="mtx-fab--fixed-br" aria-label="Crear"></button>
```

{{< callout type="tip" >}}
Un FAB fijo tapa contenido al final de la página: deja un margen inferior de al menos 88px (56px + 24px + holgura) en el contenedor desplazable.
{{< /callout >}}

## Casos de uso reales

Composición de un mensaje: el FAB de enviar (56px) alineado con un Text Field medium de la misma altura.

{{< mtx-demo title="Enviar mensaje" >}}
<div style="width: 280px; max-width: 100%;">
  <input data-mtx="text-field" data-label="Escribe un mensaje" type="text" />
</div>
<button data-mtx="fab" data-icon="send" aria-label="Enviar mensaje"></button>
{{< /mtx-demo >}}

## Sintaxis BEM completa

La estructura extendida escribe la clase base, los modificadores y el contenido. La instancia se vincula sin duplicar nada.

```html
<button class="mtx-fab mtx-fab--extended mtx-fab--secondary" data-mtx="fab" type="button">
  <span class="material-icons" aria-hidden="true">add</span>
  <span>Nuevo ticket</span>
</button>
```

## Uso programático

`size` y `color` son propiedades de lectura y escritura: al asignarlas se intercambian las clases modificadoras.

```javascript
const fab = Materix.getInstance(document.querySelector('#compose'));

fab.size = 'medium';     // 'small' | 'medium' | 'large'
fab.color = 'secondary'; // cualquier color de data-color
fab.disable();
fab.enable();

// Crear uno nuevo
const el = document.createElement('button');
el.setAttribute('data-icon', 'add');
el.setAttribute('aria-label', 'Crear');
document.body.appendChild(el);
Materix.init(el, 'fab');
```

Con ES modules:

```javascript
import { getInstance, Fab } from '@rubenchodev/materix-ui';
const fab = new Fab(document.querySelector('#compose'));
```

{{< mtx-demo title="size y color" >}}
<button data-mtx="fab" data-icon="bolt" aria-label="Acción rápida" id="doc-fab-target"></button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-fab-size">Cambiar size</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-fab-color">Cambiar color</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var fab = Materix.init(document.getElementById('doc-fab-target'));
  var sizes = ['large', 'medium', 'small'];
  var colors = ['primary', 'secondary', 'success', 'default'];
  document.getElementById('doc-fab-size').addEventListener('click', function () {
    fab.size = sizes[(sizes.indexOf(fab.size) + 1) % sizes.length];
  });
  document.getElementById('doc-fab-color').addEventListener('click', function () {
    fab.color = colors[(colors.indexOf(fab.color) + 1) % colors.length];
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `fab` | — | Activa la inicialización automática. |
| `data-icon` | nombre de Material Icons | — | Inserta el icono al inicio si no hay `.material-icons` ni `<svg>`. |
| `data-label` | texto | — | Añade la etiqueta y activa la variante extendida. |
| `data-variant` | `extended` | circular | Fuerza la variante extendida. |
| `data-size` | `small` \| `medium` \| `large` | `large` | Tamaño (ver tabla de tamaños). |
| `data-color` | `primary` \| `secondary` \| `default` \| `success` \| `error` \| `warning` \| `info` \| `inherit` | `primary` | Color del FAB. |

Atributos nativos: `aria-label` (obligatorio en el circular), `disabled`, `type`. En `<a>`, `disable()` usa `aria-disabled`.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-fab` | Clase base: círculo de 56px con elevación 6. La añade el JS. |
| `mtx-fab--extended` | Variante extendida (48px de alto, esquinas de píldora). |
| `mtx-fab--medium` | 48px circular / 40px extendido. |
| `mtx-fab--small` | 40px circular / 34px extendido. |
| `mtx-fab--secondary`, `--success`, `--error`, `--warning`, `--info` | Colores de la paleta. |
| `mtx-fab--default` | Superficie neutra con borde. |
| `mtx-fab--inherit` | Hereda fondo y color del contenedor. |
| `mtx-fab--fixed-br` | Fijo abajo a la derecha (24px). |
| `mtx-fab--fixed-bl` | Fijo abajo a la izquierda (24px). |
| `mtx-fab--absolute-center` | Centrado sobre el borde superior del contenedor posicionado. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `disable()` | `void` | `disabled` en `<button>`; `aria-disabled` y `tabindex="-1"` en `<a>`. |
| `enable()` | `void` | Revierte `disable()`. |
| `disabled` (getter) | `boolean` | Estado deshabilitado. |
| `size` (get/set) | `string` | Tamaño actual; al asignarlo cambia la clase de tamaño. |
| `color` (get/set) | `string` | Color actual; al asignarlo cambia la clase de color. |
| `destroy()` | `void` | Elimina los listeners. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

Fab no emite eventos propios. Escucha el `click` nativo.

### Variables CSS

| Variable | Uso en Fab |
| :--- | :--- |
| `--mtx-color-{color}`, `--mtx-color-{color}-contrast`, `--mtx-color-{color}-dark` | Fondo, icono/texto y hover. |
| `--mtx-color-background-paper`, `--mtx-color-text-primary`, `--mtx-color-divider` | Color `default`. |
| `--mtx-color-action-disabled`, `--mtx-color-action-disabled-background` | Estado deshabilitado. |
| `--mtx-elevation-6`, `--mtx-elevation-12` | Sombra en reposo y en hover/foco/pulsado. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-fab-bg`, `--mtx-fab-fg`, `--mtx-fab-hover` | Variables locales; sobrescríbelas para un color personalizado. |

## Accesibilidad

- Es un `<button>` nativo. El circular necesita `aria-label`; el extendido toma el nombre de su texto.
- Colócalo en un punto coherente del orden de lectura: aunque flote visualmente, su posición en el DOM determina el orden de tabulación.
- `disabled` lo saca del orden de tabulación.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa la acción. |
