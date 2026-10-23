---
title: "Accordion"
description: "Paneles que muestran y ocultan secciones de contenido relacionadas con un resumen pulsable, ideales para FAQs y ajustes agrupados."
group: "surfaces"
icon: "expand_circle_down"
weight: 5
example: "accordion"
mui: "https://mui.com/material-ui/react-accordion/"
---

**Accordion** agrupa contenido en paneles plegables: un resumen pulsable (AccordionSummary) muestra u oculta el detalle (AccordionDetails) con una transición de altura. Úsalo para preguntas frecuentes, ajustes por secciones o información secundaria que no debe ocupar espacio permanente. No lo uses para la navegación principal (usa [Tabs]({{< relref "/components/tabs" >}}) o un [Drawer]({{< relref "/components/drawer" >}})) ni para ocultar contenido que el usuario necesita ver siempre.

## Uso básico

Un `<div data-mtx="accordion">` con `data-summary` genera la cabecera `<h3>`, el botón con `aria-expanded` y `aria-controls`, el icono `expand_more` y la región colapsable. El contenido del div pasa a ser el detalle. El resumen va en negrita (peso 500) y, al expandirse, toma un fondo propio y un divisor que lo separa del contenido (consulta [Estilo del resumen](#estilo-del-resumen)). Los paneles contiguos se agrupan visualmente: comparten separadores de 1px y solo el primero y el último llevan esquinas redondeadas.

{{< mtx-demo title="Sintaxis simplificada" layout="block" >}}
<div data-mtx="accordion" data-summary="Accordion 1">Los paneles contiguos comparten separadores de 1px, como en MUI.</div>
<div data-mtx="accordion" data-summary="Accordion 2">Al expandirse, el panel se separa 16px de sus vecinos.</div>
<div data-mtx="accordion" data-summary="Accordion 3" data-expanded>Este panel empieza expandido con data-expanded.</div>
{{< /mtx-demo >}}

## Desde details

Mejora progresiva: un `<details data-mtx="accordion">` funciona sin JavaScript. Al inicializarse conserva el elemento nativo y le añade el estilo MUI, la animación de altura y el icono. El atributo `open` marca el estado inicial y la búsqueda del navegador (Ctrl+F) abre el panel que contiene la coincidencia.

{{< mtx-demo title="details / summary" layout="block" >}}
<details data-mtx="accordion" open>
  <summary>¿Funciona sin JavaScript?</summary>
  <p>Sí. El elemento nativo abre y cierra por sí solo; Materix añade aspecto, transición y teclado.</p>
</details>
<details data-mtx="accordion">
  <summary>¿La búsqueda del navegador encuentra el texto oculto?</summary>
  <p>Sí: los paneles cerrados se abren cuando Ctrl+F encuentra una coincidencia dentro.</p>
</details>
{{< /mtx-demo >}}

{{< callout type="info" >}}`<summary>` no puede ir dentro de un encabezado, así que la forma `details` no genera `<h3>`. Si la jerarquía de encabezados es importante para tu página, usa la forma `<div>`.{{< /callout >}}

## Variantes

Por defecto el acordeón es una superficie [Paper]({{< relref "/components/paper" >}}) con elevación 1. `data-variant="outlined"` usa un borde de 1px (los bordes contiguos se fusionan), `data-elevation="0"` lo deja plano y `data-square` elimina las esquinas redondeadas.

{{< mtx-demo title="Elevation, outlined, plano y square" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-summary="Elevation">Sombra de elevación 1.</div>
    <div data-mtx="accordion" data-summary="Devoluciones">30 días para devolver tu pedido.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-variant="outlined" data-summary="Outlined">Borde de 1px sin sombra.</div>
    <div data-mtx="accordion" data-variant="outlined" data-summary="Devoluciones">30 días para devolver tu pedido.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-elevation="0" data-summary="Elevation 0">Superficie plana.</div>
    <div data-mtx="accordion" data-elevation="0" data-summary="Devoluciones">30 días para devolver tu pedido.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-square data-summary="Square">Sin esquinas redondeadas.</div>
    <div data-mtx="accordion" data-square data-summary="Devoluciones">30 días para devolver tu pedido.</div>
  </div>
</div>
{{< /mtx-demo >}}

## Estilo del resumen

Por defecto el resumen usa peso medio (500) y, mientras el panel está expandido, un fondo `--mtx-color-action-selected` y un divisor inferior, de modo que la cabecera se distingue del contenido tanto en tema claro como oscuro. El foco (`--mtx-color-action-focus`) prevalece sobre ese fondo y un panel deshabilitado conserva su opacidad reducida. `data-summary-style="plain"` (en el panel o en el grupo) recupera el aspecto plano de MUI: peso normal, sin fondo ni divisor. Ajústalo con las variables CSS `--mtx-accordion-summary-*`.

{{< callout type="info" title="Desviación consciente de MUI" >}}
`AccordionSummary` de MUI usa peso normal y el mismo fondo que los detalles. Materix destaca el resumen por defecto para que la cabecera de un panel abierto se distinga de su contenido. Usa `data-summary-style="plain"` para el aspecto original de MUI.
{{< /callout >}}

<style>.doc-accordion-brand {
  --mtx-accordion-summary-font-weight: 700;
  --mtx-accordion-summary-expanded-bg: color-mix(in srgb, var(--mtx-color-primary) 12%, transparent);
  --mtx-accordion-summary-expanded-divider: var(--mtx-color-primary);
}</style>

{{< mtx-demo title="Estilo del resumen" layout="block" >}}
<p class="mtx-typography--overline">Destacado (predeterminado)</p>
<div>
  <div data-mtx="accordion" data-summary="Facturación" data-expanded>Las facturas se emiten el día 1 de cada mes.</div>
  <div data-mtx="accordion" data-summary="Métodos de pago">Tarjeta, transferencia y domiciliación.</div>
</div>
<p class="mtx-typography--overline mtx-mt-3">data-summary-style="plain"</p>
<div data-mtx="accordion-group" data-summary-style="plain" data-exclusive="false">
  <div data-mtx="accordion" data-summary="Facturación" data-expanded>Las facturas se emiten el día 1 de cada mes.</div>
  <div data-mtx="accordion" data-summary="Métodos de pago">Tarjeta, transferencia y domiciliación.</div>
</div>
<p class="mtx-typography--overline mtx-mt-3">Variables personalizadas</p>
<div class="doc-accordion-brand">
  <div data-mtx="accordion" data-summary="Facturación" data-expanded>Las facturas se emiten el día 1 de cada mes.</div>
  <div data-mtx="accordion" data-summary="Métodos de pago">Tarjeta, transferencia y domiciliación.</div>
</div>
{{< /mtx-demo >}}

```html
<div data-mtx="accordion" data-summary="Facturación">…</div>
<div data-mtx="accordion" data-summary="Facturación" data-summary-style="plain">…</div>
<div data-mtx="accordion-group" data-summary-style="plain">…</div>
```

```css
/* Personalización con variables CSS (en el acordeón o en cualquier ancestro) */
.my-faq {
  --mtx-accordion-summary-font-weight: 700;
  --mtx-accordion-summary-expanded-bg: color-mix(in srgb, var(--mtx-color-primary) 12%, transparent);
  --mtx-accordion-summary-expanded-divider: var(--mtx-color-primary);
}
```

## Gutters

Al expandirse, el panel gana 16px de margen vertical y el resumen pasa de 48px a 64px. `data-disable-gutters` mantiene la altura de 48px y elimina el margen.

{{< mtx-demo title="Con y sin gutters" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-summary="Primero">Panel cerrado.</div>
    <div data-mtx="accordion" data-summary="Segundo (expandido)" data-expanded>Se separa 16px arriba y abajo.</div>
    <div data-mtx="accordion" data-summary="Tercero">Panel cerrado.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-disable-gutters data-summary="Primero">Panel cerrado.</div>
    <div data-mtx="accordion" data-disable-gutters data-summary="Segundo (expandido)" data-expanded>Sin margen ni cambio de altura.</div>
    <div data-mtx="accordion" data-disable-gutters data-summary="Tercero">Panel cerrado.</div>
  </div>
</div>
{{< /mtx-demo >}}

## Con iconos

El icono de expansión es `expand_more` y gira 180° al abrir. `data-expand-icon` acepta cualquier nombre de Material Icons y `data-expand-icon="false"` lo omite. El ángulo de giro se cambia con la variable `--mtx-accordion-expand-icon-rotation` (por ejemplo `45deg` para un icono `add`).

{{< mtx-demo title="Icono de expansión" layout="block" >}}
<div data-mtx="accordion" data-summary="expand_more (predeterminado)">Contenido.</div>
<div data-mtx="accordion" data-expand-icon="arrow_drop_down" data-summary="arrow_drop_down">Contenido.</div>
<div data-mtx="accordion" data-expand-icon="add" data-summary="add girando 45°" style="--mtx-accordion-expand-icon-rotation: 45deg">Contenido.</div>
<div data-mtx="accordion" data-expand-icon="false" data-summary="Sin icono">Contenido.</div>
{{< /mtx-demo >}}

## Estados

El foco de teclado pinta el fondo `action.focus` del resumen, como MUI. `data-disabled` atenúa el resumen al 38 %, aplica el fondo de deshabilitado y bloquea la interacción. Como en MUI, el resumen no tiene ripple por defecto; `data-ripple` lo activa.

{{< mtx-demo title="Normal, expandido, ripple y deshabilitado" layout="block" >}}
<div data-mtx="accordion" data-summary="Normal">Panel habilitado.</div>
<div data-mtx="accordion" data-summary="Expandido" data-expanded>Panel expandido inicialmente.</div>
<div data-mtx="accordion" data-summary="Con ripple" data-ripple>El resumen muestra la onda al pulsar.</div>
<div data-mtx="accordion" data-summary="Deshabilitado" data-disabled>No se puede abrir.</div>
{{< /mtx-demo >}}

## Grupo exclusivo

`data-mtx="accordion-group"` mantiene un solo panel abierto (el patrón "Controlled accordion" de MUI) y habilita la navegación con flechas, Inicio y Fin entre resúmenes. Con `data-exclusive="false"` admite varios paneles abiertos. El grupo propaga `data-variant`, `data-square`, `data-elevation` y `data-disable-gutters` a los paneles que no los declaran.

{{< mtx-demo title="Solo un panel abierto" layout="block" >}}
<div data-mtx="accordion-group">
  <div data-mtx="accordion" data-summary="Ajustes generales" data-expanded>Idioma, zona horaria y formato de fecha.</div>
  <div data-mtx="accordion" data-summary="Usuarios">Gestiona miembros y permisos.</div>
  <div data-mtx="accordion" data-summary="Configuración avanzada">Integraciones, webhooks y claves de API.</div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Varios abiertos (data-exclusive='false')" layout="block" >}}
<div data-mtx="accordion-group" data-exclusive="false" data-variant="outlined">
  <div data-mtx="accordion" data-summary="Notificaciones por correo" data-expanded>Resumen semanal y alertas de seguridad.</div>
  <div data-mtx="accordion" data-summary="Notificaciones push" data-expanded>Menciones y mensajes directos.</div>
  <div data-mtx="accordion" data-summary="SMS">Solo verificaciones de inicio de sesión.</div>
</div>
{{< /mtx-demo >}}

## Acciones

Un hijo `data-mtx="accordion-actions"` se coloca al pie de la región, después del detalle, alineado a la derecha con 8px entre botones (AccordionActions). `data-disable-spacing` elimina esa separación.

{{< mtx-demo title="AccordionActions" layout="block" >}}
<div data-mtx="accordion" data-summary="Términos del servicio" data-expanded>
  <p>Al continuar aceptas las condiciones de uso y la política de privacidad vigentes.</p>
  <div data-mtx="accordion-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button">Cancelar</button>
    <button class="mtx-button mtx-button--text" data-mtx="button">Aceptar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

### Preguntas frecuentes

Una FAQ con `<details>` dentro de un grupo exclusivo: sin JavaScript se lee igual y, con la librería, solo queda una respuesta abierta.

{{< mtx-demo title="FAQ de facturación" layout="block" >}}
<div data-mtx="accordion-group" data-variant="outlined">
  <details data-mtx="accordion" open>
    <summary>¿Puedo cambiar de plan más adelante?</summary>
    <p>Sí. Las mejoras se aplican al instante y se prorratean; las bajadas de plan entran en vigor al final del periodo.</p>
  </details>
  <details data-mtx="accordion">
    <summary>¿Qué métodos de pago aceptáis?</summary>
    <p>Tarjetas de crédito, Apple Pay y Google Pay. Los planes anuales también admiten transferencia bancaria.</p>
  </details>
  <details data-mtx="accordion">
    <summary>¿Puedo cancelar en cualquier momento?</summary>
    <p>Sí. Los mensuales se cancelan cuando quieras; los anuales tienen reembolso completo durante 30 días.</p>
  </details>
</div>
{{< /mtx-demo >}}

### Ajustes con texto secundario

El resumen admite contenido propio: `.mtx-accordion__summary-secondary` aplica el color de texto secundario, como en la demo "Controlled accordion" de MUI.

{{< mtx-demo title="Resumen con dos columnas" layout="block" >}}
<div data-mtx="accordion-group">
  <div class="mtx-accordion" data-mtx="accordion">
    <h3 class="mtx-accordion__heading">
      <button class="mtx-accordion__summary">
        <span class="mtx-accordion__summary-content">
          <span class="mtx-w-50 mtx-flex-shrink-0">Perfil</span>
          <span class="mtx-accordion__summary-secondary mtx-text-truncate">Laura Gómez · laura@acme.com</span>
        </span>
      </button>
    </h3>
    <div class="mtx-accordion__details">Nombre, foto y correo electrónico de la cuenta.</div>
  </div>
  <div class="mtx-accordion" data-mtx="accordion">
    <h3 class="mtx-accordion__heading">
      <button class="mtx-accordion__summary">
        <span class="mtx-accordion__summary-content">
          <span class="mtx-w-50 mtx-flex-shrink-0">Seguridad</span>
          <span class="mtx-accordion__summary-secondary mtx-text-truncate">2FA activado</span>
        </span>
      </button>
    </h3>
    <div class="mtx-accordion__details">Contraseña, verificación en dos pasos y sesiones abiertas.</div>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR renderiza la estructura completa; el componente la reutiliza sin duplicar nodos, genera los `id` que falten y enlaza `aria-controls` / `aria-labelledby`. Si falta la región, `.mtx-accordion__details` y `.mtx-accordion-actions` se envuelven en ella. El estado inicial se lee de `aria-expanded="true"` del resumen o de la clase `mtx-accordion--expanded`.

```html
<div class="mtx-accordion" data-mtx="accordion">
  <h3 class="mtx-accordion__heading">
    <button class="mtx-accordion__summary" type="button" aria-expanded="true">
      <span class="mtx-accordion__summary-content">Estructura completa</span>
      <span class="mtx-accordion__expand-icon" aria-hidden="true">
        <span class="material-icons">expand_more</span>
      </span>
    </button>
  </h3>
  <div class="mtx-accordion__region">
    <div class="mtx-accordion__details">…</div>
    <div class="mtx-accordion-actions">…</div>
  </div>
</div>
```

## Uso programático

Los elementos `[data-mtx="accordion"]` y `[data-mtx="accordion-group"]` se inicializan solos. Para contenido dinámico usa `Materix.init(el)` o las clases; `Materix.getInstance(el)` devuelve la instancia.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.dataset.summary = 'Nuevo panel';
el.textContent = 'Contenido';
container.append(el);
const accordion = Materix.init(el, 'accordion');   // o: new Materix.Accordion(el)

accordion.expand();
accordion.collapse();
accordion.toggle();
accordion.expanded = true;      // getter/setter
accordion.disable();

el.addEventListener('mtx:accordion:change', (event) => {
  console.log(event.detail.expanded);
});
```

```javascript
// ES modules
import { Accordion, AccordionGroup } from '@rubenchodev/materix-ui';

const group = new AccordionGroup(document.querySelector('#faq'));
group.collapseAll();
```

{{< mtx-demo title="expand(), collapse(), toggle() y evento" layout="block" >}}
<div data-mtx="accordion" id="doc-accordion-api" data-summary="Panel controlado por API">Contenido gestionado desde JavaScript.</div>
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1 mtx-mt-2">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-accordion-expand">expand()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-accordion-collapse">collapse()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-accordion-toggle">toggle()</button>
</div>
<p class="mtx-typography mtx-typography--body2 mtx-mt-2" id="doc-accordion-status" aria-live="polite">expanded = false</p>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-accordion-api');
  if (!el || !window.Materix) return;
  var accordion = Materix.getInstance(el);
  var status = document.getElementById('doc-accordion-status');
  el.addEventListener('mtx:accordion:change', function (e) {
    status.textContent = 'mtx:accordion:change → expanded = ' + e.detail.expanded;
  });
  document.getElementById('doc-accordion-expand').addEventListener('click', function () { accordion.expand(); });
  document.getElementById('doc-accordion-collapse').addEventListener('click', function () { accordion.collapse(); });
  document.getElementById('doc-accordion-toggle').addEventListener('click', function () { accordion.toggle(); });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `accordion`, `accordion-group`, `accordion-actions` | — | Inicializa el panel, el grupo o la barra de acciones. |
| `data-summary` | texto | — | Texto del resumen cuando el componente lo genera (`<div>` o `<details>` sin `<summary>`). |
| `data-expanded` | presente, `false` | ausente | Estado inicial expandido (en `<details>` también vale `open`). |
| `data-disabled` | presente | ausente | Deshabilita el panel. |
| `data-variant` | `outlined` | elevation | Borde de 1px en lugar de sombra. Heredable del grupo. |
| `data-elevation` | `0`–`4`, `6`, `8` | `1` | Sombra de la superficie. Heredable del grupo. |
| `data-square` | presente | ausente | Sin esquinas redondeadas. Heredable del grupo. |
| `data-disable-gutters` | presente | ausente | Sin margen de 16px ni cambio de altura al expandir. Heredable del grupo. |
| `data-expand-icon` | nombre de Material Icons, `false` | `expand_more` | Icono de expansión; `false` lo omite. |
| `data-heading-level` | `1`–`6`, `none` | `3` | Nivel del encabezado que envuelve al resumen (solo forma `<div>`). |
| `data-ripple` | presente | ausente | Activa el ripple al pulsar el resumen. |
| `data-duration` | ms, `auto` | `auto` | Duración del colapso; `auto` la calcula según la altura (fórmula de MUI). `0` = sin animación. |
| `data-exclusive` | `false` | exclusivo | En `accordion-group`: permite varios paneles abiertos. |
| `data-summary-style` | `plain` | destacado | `plain`: resumen plano de MUI (peso 400, sin fondo ni divisor al expandir). Heredable del grupo. |
| `data-disable-spacing` | presente | ausente | En `accordion-actions`: quita los 8px entre acciones. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-accordion` | Raíz (Paper con elevación 1). |
| `.mtx-accordion--expanded` | Panel expandido (lo gestiona el componente). |
| `.mtx-accordion--outlined` | Variante con borde. |
| `.mtx-accordion--elevation-{n}` | Elevación `0`–`4`, `6`, `8`. |
| `.mtx-accordion--square` | Sin esquinas redondeadas. |
| `.mtx-accordion--disable-gutters` | Sin margen ni cambio de altura al expandir. |
| `.mtx-accordion--disabled` | Panel deshabilitado. |
| `.mtx-accordion--plain-summary` | Resumen plano de MUI (`data-summary-style="plain"`). |
| `.mtx-accordion__heading` | Encabezado `h1`–`h6` sin estilo que envuelve al resumen. |
| `.mtx-accordion__summary` | Botón o `<summary>` pulsable (AccordionSummary). |
| `.mtx-accordion__summary-content` | Contenido del resumen. |
| `.mtx-accordion__summary-secondary` | Texto secundario dentro del resumen. |
| `.mtx-accordion__expand-icon` | Contenedor del icono de expansión (gira al abrir). |
| `.mtx-accordion__region` | Región colapsable con `role="region"`. |
| `.mtx-accordion__details` | Detalle (AccordionDetails), padding `8px 16px 16px`. |
| `.mtx-accordion-actions` | Barra de acciones (AccordionActions). |
| `.mtx-accordion-actions--disable-spacing` | Acciones sin separación. |
| `.mtx-accordion-group` | Contenedor del grupo. |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `expand()` | `void` | Expande el panel (en un grupo exclusivo cierra los demás). |
| `collapse()` | `void` | Contrae el panel. |
| `toggle()` | `void` | Alterna el estado. |
| `expanded` | `boolean` | Getter/setter del estado expandido. |
| `disable()` / `enable()` | `void` | Deshabilita o habilita el panel. |
| `disabled` | `boolean` | Indica si está deshabilitado. |
| `destroy()` | `void` | Elimina listeners y temporizadores. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |
| `AccordionGroup#collapseAll()` | `void` | Contrae todos los paneles del grupo. |
| `AccordionGroup#expandAll()` | `void` | Expande todos (solo con `data-exclusive="false"`). |
| `AccordionGroup#accordions` | `Accordion[]` | Instancias del grupo. |
| `AccordionGroup#exclusive` | `boolean` | Indica si el grupo es exclusivo. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:accordion:change` | `{ expanded }` | El panel cambia de estado (clic, teclado, API, búsqueda en página o cierre por exclusividad). Burbujea. |

### Variables CSS

| Variable | Predeterminado | Descripción |
|---|---|---|
| `--mtx-accordion-expand-icon-rotation` | `180deg` | Giro del icono al expandir. |
| `--mtx-accordion-gutter` | `16px` | Margen vertical del panel expandido. |
| `--mtx-accordion-summary-font-weight` | `500` | Peso tipográfico del resumen (`400` con `plain`). |
| `--mtx-accordion-summary-expanded-bg` | `var(--mtx-color-action-selected)` | Fondo del resumen expandido (`transparent` con `plain`). |
| `--mtx-accordion-summary-expanded-divider` | `var(--mtx-color-divider)` | Divisor entre el resumen expandido y los detalles (`transparent` con `plain`). |
| `--mtx-color-background-paper` | — | Fondo del panel. |
| `--mtx-color-divider` | — | Separadores y borde outlined. |
| `--mtx-color-action-focus` | — | Fondo del resumen con foco. |
| `--mtx-color-action-active` | — | Color del icono de expansión. |
| `--mtx-color-action-disabled-background` | — | Fondo del panel deshabilitado. |
| `--mtx-elevation-1` | — | Sombra predeterminada. |
| `--mtx-overlay-elevation-1` | — | Capa blanca en tema oscuro (elevación 1 de MUI). |

## Accesibilidad

- El resumen es un `<button>` (o el `<summary>` nativo) con `aria-expanded` y `aria-controls`; en la forma `<div>` va dentro de un `<h3>` (configurable con `data-heading-level`), como recomienda el patrón WAI-ARIA Accordion y como hace MUI.
- La región tiene `role="region"` y `aria-labelledby` apuntando al resumen. Cerrada, queda oculta con `hidden="until-found"` cuando el navegador lo soporta, de modo que Ctrl+F puede encontrar y abrir su contenido sin exponerlo al foco.
- Deshabilitado: el `<button>` recibe `disabled`; el `<summary>` recibe `aria-disabled="true"` y `tabindex="-1"`.
- La transición respeta `prefers-reduced-motion`.

| Tecla | Acción |
|---|---|
| `Enter` / `Espacio` | Alterna el panel con foco. |
| `Tab` / `Shift+Tab` | Recorre resúmenes y el contenido de los paneles abiertos. |
| `↓` / `↑` | En un `accordion-group`: foco al resumen siguiente / anterior (cíclico, omite deshabilitados). |
| `Inicio` / `Fin` | En un `accordion-group`: foco al primer / último resumen. |
