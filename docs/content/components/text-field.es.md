---
title: "Text Field"
description: "Campo de texto con label flotante, variantes MUI, iconos, contadores, máscaras de entrada y validación, declarado con un solo elemento."
group: "inputs"
icon: "edit"
weight: 70
example: "text-field"
mui: "https://mui.com/material-ui/react-text-field/"
---

`TextField` permite escribir y editar texto en formularios: nombre, correo, contraseña, importes o comentarios largos. Se declara con un único `<input>` o `<textarea>` y Materix construye el label flotante, el borde con muesca (*NotchedOutline*), los iconos y el texto de ayuda. Para elegir entre opciones cerradas usa [Select](../select/) o [NativeSelect](../native-select/); para fechas y horas, [DateTimePicker](../date-time-picker/).

## Uso básico

Escribe solo el elemento nativo con `data-mtx="text-field"` y `data-label`. Todos los atributos nativos (`id`, `name`, `type`, `value`, `required`, `disabled`, `readonly`, `maxlength`, `autocomplete`…) se conservan.

{{< mtx-demo title="Sintaxis simplificada" >}}
<input data-mtx="text-field" data-label="Nombre completo" type="text" />
{{< /mtx-demo >}}

Si omites `data-label`, el texto de `placeholder` se usa como label. Los alias `data-mtx="input"` y `data-mtx="textarea"` inicializan el mismo componente.

{{< mtx-demo title="Label desde placeholder y alias" >}}
<input data-mtx="input" placeholder="Correo electrónico" type="email" />
<textarea data-mtx="textarea" data-label="Comentario"></textarea>
{{< /mtx-demo >}}

## Variantes

`outlined` (predeterminada, con borde y muesca), `filled` (fondo y línea inferior) y `standard` (solo línea inferior). La variante `no-label` dibuja un borde completo sin label ni muesca, pensada para buscadores y filtros.

{{< mtx-demo title="Variantes" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="text-field" data-label="Outlined" data-variant="outlined" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="text-field" data-label="Filled" data-variant="filled" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="text-field" data-label="Standard" data-variant="standard" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="text-field" data-variant="no-label" data-start-icon="search" placeholder="Buscar…" aria-label="Buscar" type="search" />
  </div>
</div>
{{< /mtx-demo >}}

## Tamaños

Alturas canónicas: **medium 56px** (predeterminada, MUI), **small 40px** (`data-size="small"` o `data-small`) y **large 48px** (`data-size="large"` o `data-large`). Small alinea 1:1 con un Button medium de 40px y large con un Button large de 48px.

{{< mtx-demo title="Medium 56px, small 40px y large 48px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Large · 48px" data-size="large" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Filled large" data-variant="filled" data-size="large" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Medium · 56px" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Small · 40px" data-size="small" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Filled small" data-variant="filled" data-size="small" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Standard small" data-variant="standard" data-size="small" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Alineación con Button (40px)" layout="block" >}}
<div data-mtx="grid" data-spacing="2" data-align="center">
  <div data-mtx="grid" data-xs="8">
    <input data-mtx="text-field" data-label="Cupón" data-size="small" type="text" />
  </div>
  <div data-mtx="grid" data-xs="4">
    <button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button" type="button">Aplicar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Con iconos

`data-start-icon` y `data-end-icon` aceptan el nombre de un icono de Material Icons o la URL de una imagen (`http(s)://`, `/`, `./`, `../`, `data:image/` o extensión `.png`, `.jpg`, `.svg`, `.webp`, `.gif`, `.avif`, `.ico`). Con icono inicial el label se desplaza para alinearse con el texto escrito.

{{< mtx-demo title="Sin icono, inicial, final, ambos e imagen" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Sin icono" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Usuario" data-start-icon="account_circle" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Contraseña" data-end-icon="lock" type="password" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Importe" data-start-icon="payments" data-end-icon="info" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Teléfono" data-start-icon="https://flagcdn.com/w20/co.png" type="tel" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Filled con icono" data-variant="filled" data-start-icon="email" type="email" />
  </div>
</div>
{{< /mtx-demo >}}

## Adornos interactivos

Equivalen a `InputAdornment` + `IconButton` de MUI. `data-password-toggle` (solo en `type="password"`) añade al final un IconButton que muestra u oculta la contraseña: alterna `aria-pressed`, cambia el icono (`visibility` / `visibility_off`) y tiene un nombre accesible traducido ("Mostrar contraseña"). Las máscaras, el contador y la validación siguen funcionando. Para otras acciones, `data-start-action` / `data-end-action` reciben el nombre del icono y `data-start-action-label` / `data-end-action-label` su nombre accesible; al pulsarlas se emite `mtx:text-field:adornment-click`. El icono del botón queda donde iría un icono estático, así que el label sigue alineado con el texto. Dentro de `.mtx-text-field` se oculta el botón nativo de borrar del navegador en `type="search"` (y el ojo nativo de Edge cuando hay botón de contraseña), de modo que solo se ve la acción de la librería.

{{< mtx-demo title="Mostrar contraseña y acciones" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Contraseña" type="password" data-password-toggle autocomplete="new-password" data-helper-text="Mínimo 8 caracteres" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Contraseña" data-variant="filled" data-start-icon="lock" type="password" data-password-toggle autocomplete="new-password" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="PIN" type="password" data-password-toggle maxlength="6" inputmode="numeric" autocomplete="off" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input id="doc-tf-clear" data-mtx="text-field" data-label="Buscar" data-start-icon="search" data-end-action="close" data-end-action-label="Limpiar búsqueda" value="Materix" type="search" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Ubicación" data-variant="standard" data-start-action="my_location" data-start-action-label="Usar mi ubicación" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

```javascript
document.addEventListener('mtx:text-field:adornment-click', (event) => {
  const { position, input } = event.detail;
  if (input.id === 'doc-tf-clear' && position === 'end') {
    Materix.getInstance(input).value = '';
    input.focus();
  }
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('mtx:text-field:adornment-click', function (event) {
    var input = event.detail.input;
    if (input.id === 'doc-tf-clear' && event.detail.position === 'end') {
      Materix.getInstance(input).value = '';
      input.focus();
    }
  });
});
</script>

{{< callout type="tip" title="Etiqueta del botón" >}}
El botón de contraseña usa un nombre fijo y `aria-pressed` para el estado (patrón de botón conmutable), en lugar de cambiar el texto. Puedes sustituir el nombre con `data-password-toggle-label` (por ejemplo, "Mostrar contraseñas" si el botón controla varios campos).
{{< /callout >}}

## Colores

`data-color` cambia el color del label, el borde y la línea de foco: `primary` (predeterminado), `secondary`, `success`, `warning` e `info`. Haz clic en cada campo para verlo.

{{< mtx-demo title="Colores de foco" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Primary" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Secondary" data-color="secondary" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Success" data-color="success" data-variant="filled" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Warning" data-color="warning" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Info" data-color="info" data-variant="standard" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Estados

Los estados se expresan con atributos nativos (`disabled`, `readonly`, `required`) o con `data-error`: con texto (`data-error="mensaje"`) pinta el campo en rojo, sustituye el texto de ayuda por el mensaje y marca `aria-invalid="true"`; vacío (o `"true"`) activa el error conservando el texto de ayuda, como la prop booleana `error` de MUI. `required` añade el asterisco al label. Pasa el cursor para ver *hover* y usa <kbd>Tab</kbd> para el foco.

{{< mtx-demo title="Ayuda, error, requerido, deshabilitado y solo lectura" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Con ayuda" data-helper-text="Tal como aparece en tu documento" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Correo" data-error="Introduce un correo válido" value="ana@" type="email" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Obligatorio" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Deshabilitado" value="No editable" disabled type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Solo lectura" value="ID-2026-0042" readonly type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Filled con error" data-variant="filled" data-error="Campo obligatorio" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Teléfono" data-helper-text="El helper se pinta en rojo" data-error value="12" type="tel" />
  </div>
</div>
{{< /mtx-demo >}}

## Label estático, oculto y sin borde

Modificadores BEM que se aplican poniendo la clase en el propio `<input>` (se transfiere al contenedor):

- `mtx-text-field--static-label`: el label queda siempre arriba y el `placeholder` es visible (equivale a `shrink` de MUI).
- `mtx-text-field--hidden-label`: oculta el label y la muesca; añade `aria-label`.
- `mtx-text-field--borderless`: outlined sin borde, para integrar el campo dentro de un Paper o una barra.

{{< mtx-demo title="Modificadores de label y borde" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input class="mtx-text-field--static-label" data-mtx="text-field" data-label="Label estático" placeholder="Escribe aquí" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input class="mtx-text-field--hidden-label" data-mtx="text-field" data-label="Ciudad" placeholder="Ciudad" aria-label="Ciudad" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input class="mtx-text-field--borderless" data-mtx="text-field" data-variant="no-label" data-start-icon="search" placeholder="Buscar sin borde" aria-label="Buscar" type="search" />
  </div>
</div>
{{< /mtx-demo >}}

## Multilínea y auto-resize

Usa `<textarea>` (o `data-multiline` sobre un `<input>`, que se convierte en `<textarea>`). `rows`/`data-rows` fija las filas iniciales (3 por defecto). Con `data-auto-resize` el campo crece al escribir; `data-max-rows` limita el crecimiento y activa el scroll vertical a partir de ese número de filas.

{{< mtx-demo title="Textarea" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Filas fijas (rows=3)" rows="3"></textarea>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Auto-resize" data-auto-resize rows="2" data-helper-text="Crece mientras escribes"></textarea>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Auto-resize hasta 5 filas" data-variant="filled" data-auto-resize data-max-rows="5" rows="2"></textarea>
  </div>
</div>
{{< /mtx-demo >}}

## Contadores y límites

`data-counter` muestra un contador en la esquina inferior derecha: `characters`, `words` o `both`. Los límites `data-max-characters` (o `maxlength`) y `data-max-words` activan el estado de error al superarse. Si solo indicas un límite, el tipo de contador se deduce de él.

{{< mtx-demo title="Caracteres, palabras y ambos" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="text-field" data-label="Título" data-counter="characters" data-max-characters="25" data-helper-text="Máximo 25 caracteres" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Resumen" data-max-words="15" data-helper-text="Máximo 15 palabras" rows="3"></textarea>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Comentario" data-counter="both" data-max-words="30" data-max-characters="150" rows="3"></textarea>
  </div>
</div>
{{< /mtx-demo >}}

Formato del contador: `n / max` con límite, `n` (caracteres) o `n palabras` sin límite, y `p/max pal. | c/max car.` en modo `both`. Los sufijos se traducen con el idioma del componente (`data-locale`, `lang` o `Materix.setLocale()`); en inglés: `n words` y `p/max words | c/max chars`. Puedes cambiarlos con `Materix.updateLocale('es', { textField: { counterWords: '{count} palabras' } })`.

## Máscaras de entrada

`data-mask` formatea el valor mientras se escribe y conserva la posición del cursor. Tokens del patrón: `0` dígito, `a` letra (en minúscula), `A` letra (en mayúscula), `*` alfanumérico; cualquier otro carácter es un literal que se inserta solo.

| Preset | Patrón |
| :--- | :--- |
| `credit-card` | `0000 0000 0000 0000` |
| `date` | `00/00/0000` |
| `date-short` | `00/00` |
| `time` | `00:00` |
| `time-ampm` | `00:00 AA` |
| `time-seconds` | `00:00:00` |
| `phone` | `(000) 000-0000` |
| `phone-intl` | `+00 (000) 000-0000` |
| `cpf` | `000.000.000-00` |
| `cnpj` | `00.000.000/0000-00` |
| `zip` | `00000-000` |
| `postal-code` | `00000-0000` |

{{< mtx-demo title="Patrones y presets" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Teléfono" data-mask="phone" data-start-icon="phone" type="tel" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Tarjeta" data-mask="credit-card" data-start-icon="credit_card" inputmode="numeric" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Placa" data-mask="AAA-000" data-helper-text="Patrón AAA-000" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

Con `data-mask="currency"` (alias `money`) el valor se escribe de derecha a izquierda como importe. Se configura con `data-currency-prefix` (por defecto `"$ "`), `data-currency-suffix` (`""`), `data-thousands` (`","`), `data-decimal` (`"."`) y `data-precision` (`2`).

{{< mtx-demo title="Moneda" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Precio (USD)" data-mask="currency" inputmode="numeric" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Importe (EUR)" data-mask="currency" data-currency-prefix="" data-currency-suffix=" €" data-thousands="." data-decimal="," inputmode="numeric" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

Lee el valor limpio con `field.unmaskedValue` (`"3001234567"`, `"1250.50"`) y comprueba si el patrón está completo con `field.isMaskComplete`.

## Validación

El componente no valida por sí mismo: combina la API de validación nativa (`required`, `type`, `pattern`, `checkValidity()`) con `setError()` y `clearError()`.

{{< mtx-demo title="Validar al enviar" layout="block" >}}
<form class="doc-tf-validate" novalidate>
  <div data-mtx="grid" data-spacing="2" data-align="flex-start">
    <div data-mtx="grid" data-xs="12" data-sm="8">
      <input id="doc-tf-email" data-mtx="text-field" data-label="Correo" data-helper-text="Te enviaremos la confirmación" required type="email" />
    </div>
    <div data-mtx="grid" data-xs="12" data-sm="4">
      <button class="mtx-button mtx-button--contained mtx-button--large mtx-button--full-width" data-mtx="button" type="submit">Validar</button>
    </div>
  </div>
</form>
{{< /mtx-demo >}}

```javascript
const field = Materix.getInstance(document.getElementById('doc-tf-email'));
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (field.input.checkValidity()) field.clearError();
  else field.setError(field.value ? 'Correo no válido' : 'El correo es obligatorio');
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.doc-tf-validate');
  const input = document.getElementById('doc-tf-email');
  if (!form || !input || !window.Materix) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const field = Materix.getInstance(input);
    if (!field) return;
    if (field.input.checkValidity()) field.clearError();
    else field.setError(field.value ? 'Correo no válido' : 'El correo es obligatorio');
  });
});
</script>

## Casos de uso reales

Formulario de registro en grilla combinando variantes, iconos, máscara, contador y Button.

{{< mtx-demo title="Registro" layout="block" >}}
<form data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Nombre" data-start-icon="person" autocomplete="given-name" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Apellidos" autocomplete="family-name" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Correo" data-start-icon="email" autocomplete="email" required type="email" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Teléfono" data-mask="phone" data-start-icon="phone" autocomplete="tel" type="tel" />
  </div>
  <div data-mtx="grid" data-xs="12">
    <textarea data-mtx="text-field" data-label="Sobre ti" data-max-characters="200" data-auto-resize rows="2"></textarea>
  </div>
  <div data-mtx="grid" data-xs="12">
    <div class="mtx-d-flex mtx-justify-content-end mtx-gap-1">
      <button class="mtx-button mtx-button--text" data-mtx="button" type="reset">Cancelar</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Crear cuenta</button>
    </div>
  </div>
</form>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR o control total del marcado. El componente reutiliza los nodos existentes y solo añade lo que falte (el `fieldset` de la muesca en outlined, el contador…).

```html
<div class="mtx-text-field mtx-text-field--outlined mtx-text-field--adorned-start" data-mtx="text-field">
  <label class="mtx-text-field__label" for="email">Correo electrónico</label>
  <div class="mtx-text-field__container">
    <span class="mtx-text-field__adornment mtx-text-field__adornment--start material-icons" aria-hidden="true">email</span>
    <input class="mtx-text-field__input" id="email" type="email" placeholder=" " />
    <!-- fieldset.mtx-text-field__outline > legend.mtx-text-field__legend > span (lo genera el JS) -->
  </div>
  <div class="mtx-text-field__supporting-text">
    <span class="mtx-text-field__helper-text">Nunca compartiremos tu correo</span>
    <span class="mtx-text-field__counter" aria-live="polite"></span>
  </div>
</div>
```

`placeholder=" "` es necesario en el marcado manual para que el label flote correctamente.

## Uso programático

Los componentes con `data-mtx` se inicializan solos al cargar la página. Para contenido dinámico:

```javascript
// Un elemento concreto (detecta data-mtx o fuerza el nombre)
const field = Materix.init(document.getElementById('nombre'), 'text-field');

// Instancia directa
const other = new Materix.TextField(document.querySelector('#apellidos'));

// Recuperar la instancia (funciona con el <input> original o con el contenedor generado)
const same = Materix.getInstance(document.getElementById('nombre'));

// Inicializar todo un contenedor insertado por AJAX/SPA (idempotente)
Materix.initAll(document.getElementById('formulario'));
```

Con ES modules:

```javascript
import { TextField, init, initAll, getInstance } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="API en vivo" >}}
<input id="doc-tf-api" data-mtx="text-field" data-label="Campo controlado" data-mask="currency" data-helper-text="Prueba los botones" type="text" />
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="value">unmaskedValue = 125000</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="error">setError()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="clear">clearError()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="toggle">disable() / enable()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="focus">focus()</button>
<output id="doc-tf-api-out">unmaskedValue: —</output>
{{< /mtx-demo >}}

```javascript
const field = Materix.getInstance(document.getElementById('doc-tf-api'));
field.unmaskedValue = '125000';   // muestra "$ 1,250.00"
field.setError('Importe fuera de rango');
field.clearError();
field.disabled ? field.enable() : field.disable();
field.focus();
console.log(field.value, field.unmaskedValue, field.isMaskComplete);
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('doc-tf-api');
  const out = document.getElementById('doc-tf-api-out');
  if (!input || !window.Materix) return;
  const field = Materix.getInstance(input);
  if (!field) return;
  const report = () => { out.textContent = 'value: "' + field.value + '" · unmaskedValue: "' + field.unmaskedValue + '" · isMaskComplete: ' + field.isMaskComplete; };
  field.input.addEventListener('input', report);
  document.querySelectorAll('[data-doc-tf]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-doc-tf');
      if (action === 'value') field.unmaskedValue = '125000';
      if (action === 'error') field.setError('Importe fuera de rango');
      if (action === 'clear') field.clearError();
      if (action === 'toggle') { if (field.disabled) field.enable(); else field.disable(); }
      if (action === 'focus') field.focus();
      report();
    });
  });
});
</script>

## Referencia de API

### Atributos data-*

Se pueden poner en el `<input>`/`<textarea>` (sintaxis simplificada) o en el contenedor `.mtx-text-field`.

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `text-field` \| `input` \| `textarea` | — | Inicializa el componente (los tres nombres son equivalentes). |
| `data-label` | texto | `placeholder` | Texto del label flotante. También se acepta el atributo `label`. Si falta, se usa `placeholder`. |
| `data-variant` | `outlined` \| `filled` \| `standard` \| `no-label` | `outlined` | Variante visual. `no-label` = outlined sin label ni muesca. |
| `data-size` | `small` \| `medium` \| `large` | `medium` | `small` = 40px, `medium` = 56px, `large` = 48px. También `compact` como alias de `small`. |
| `data-small` / `data-large` | booleano | — | Atajos de `data-size="small"` / `"large"`. |
| `data-color` | `primary` \| `secondary` \| `success` \| `warning` \| `info` | `primary` | Color de foco del label, borde y línea. |
| `data-start-icon` | icono \| URL | — | Icono de Material Icons o imagen al inicio. |
| `data-end-icon` | icono \| URL | — | Icono de Material Icons o imagen al final. |
| `data-helper-text` | texto | — | Texto de ayuda bajo el campo (enlazado con `aria-describedby`). |
| `data-error` | texto \| vacío \| `true` \| `false` | — | Activa el error al iniciar. Con texto, ese mensaje sustituye a la ayuda; vacío o `true`, error sin mensaje (la ayuda se pinta en rojo); `false`, sin efecto. |
| `data-password-toggle` | booleano \| `false` | — | En `type="password"`, añade el IconButton final mostrar/ocultar (tiene prioridad sobre `data-end-icon` y `data-end-action`). |
| `data-password-toggle-label` | texto | i18n `textField.showPassword` | Nombre accesible del botón de contraseña. |
| `data-start-action` / `data-end-action` | icono | — | Crea un IconButton inicial / final con ese Material Icon que emite `mtx:text-field:adornment-click`. |
| `data-start-action-label` / `data-end-action-label` | texto | — | Nombre accesible (`aria-label`) del botón de acción. Obligatorio en la práctica. |
| `data-multiline` | booleano | — | Convierte el `<input>` en `<textarea>`. Un `<textarea>` ya es multilínea. |
| `data-rows` | número | `3` | Filas iniciales si el elemento no tiene `rows`. |
| `data-auto-resize` | booleano \| `false` | desactivado | Ajusta la altura al contenido. Alias: `data-autoresize`, `data-autosize`. |
| `data-max-rows` | número | — | Filas máximas con auto-resize; después aparece scroll. |
| `data-counter` | `characters` \| `words` \| `both` | se deduce | Muestra el contador. Si se omite y hay un límite, se elige según el límite. |
| `data-max-characters` | número | `maxlength` | Límite de caracteres (alias `data-max-chars`). Superarlo activa el error. |
| `data-max-words` | número | — | Límite de palabras. Superarlo activa el error. |
| `data-mask` | patrón \| preset \| `currency` \| `money` | — | Máscara de entrada (ver tabla de presets). |
| `data-currency-prefix` | texto | `"$ "` | Prefijo de la máscara de moneda. |
| `data-currency-suffix` | texto | `""` | Sufijo de la máscara de moneda. |
| `data-thousands` | carácter | `","` | Separador de miles. |
| `data-decimal` | carácter | `"."` | Separador decimal. |
| `data-precision` | número | `2` | Número de decimales. |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-text-field` | Contenedor raíz. |
| `mtx-text-field--outlined` / `--filled` / `--standard` | Variantes. |
| `mtx-text-field--no-label` | Outlined sin label ni muesca. |
| `mtx-text-field--small` / `--medium` / `--large` | Altura 40px / 56px / 48px. |
| `mtx-text-field--secondary` / `--success` / `--warning` / `--info` | Color de foco. |
| `mtx-text-field--error` | Estado de error. |
| `mtx-text-field--has-value` | El campo tiene valor (el label flota). Lo gestiona el JS. |
| `mtx-text-field--adorned-start` / `--adorned-end` | Hay icono inicial / final. Lo gestiona el JS. |
| `mtx-text-field--multiline` | Campo multilínea. |
| `mtx-text-field--auto-resize` | Multilínea con altura automática. |
| `mtx-text-field--select` | Envuelve un `<select>` nativo (añade el chevron). |
| `mtx-text-field--static-label` | Label siempre arriba y `placeholder` visible. |
| `mtx-text-field--hidden-label` | Oculta label y muesca. |
| `mtx-text-field--borderless` | Outlined sin borde. |
| `mtx-text-field--full-width` | Ocupa el 100% del ancho. |
| `mtx-text-field--margin-dense` / `--margin-normal` | Márgenes verticales de MUI (8/4px y 16/8px). |
| `mtx-text-field__label` | Label flotante. |
| `mtx-text-field__container` | Caja del campo (fondo y borde). |
| `mtx-text-field__input` | `<input>`, `<textarea>` o `<select>`. |
| `mtx-text-field__adornment` / `--start` / `--end` / `--image` | Iconos o imágenes. |
| `mtx-text-field__adornment--action` | Adorno que contiene un IconButton (compensa su tamaño para conservar la alineación). |
| `mtx-text-field__action` / `--start` / `--end` | IconButton generado por `data-password-toggle` o `data-*-action`. |
| `mtx-text-field__outline` / `__legend` | `fieldset` y `legend` de la muesca (outlined). |
| `mtx-text-field__supporting-text` | Fila inferior de ayuda y contador. |
| `mtx-text-field__helper-text` | Texto de ayuda o de error. |
| `mtx-text-field__counter` / `--error` | Contador y su estado sobre el límite. |
| `mtx-text-field__chevron` | Flecha de un `<select>` envuelto. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `value` (get/set) | `string` | Valor del campo. Con máscara, el valor asignado se formatea. |
| `unmaskedValue` (get/set) | `string` | Valor sin formato (`"1250.50"` en moneda). Al asignarlo se formatea. |
| `isMaskComplete` (get) | `boolean` | `true` si todos los huecos del patrón están llenos (o el importe es mayor que 0). Sin máscara, `true`. |
| `disabled` (get) | `boolean` | Si el campo está deshabilitado. |
| `disable()` | `void` | Deshabilita el campo. |
| `enable()` | `void` | Habilita el campo. |
| `focus()` | `void` | Pone el foco en el campo. |
| `blur()` | `void` | Quita el foco. |
| `setError(message)` | `void` | Activa el error con el mensaje dado; `true` = error sin mensaje (conserva la ayuda); cadena vacía o `false` = `clearError()`. |
| `clearError()` | `void` | Quita el error y restaura el texto de ayuda. |
| `togglePasswordVisibility(force?)` | `boolean` | Muestra (`true`) u oculta (`false`) la contraseña, o alterna sin argumento. Devuelve si queda visible. Requiere `data-password-toggle`. |
| `passwordVisible` (get) | `boolean` | `true` si la contraseña se muestra en claro. |
| `destroy()` | `void` | Retira todos los listeners (input, botones de acción, cambio de idioma) y los temporizadores pendientes. Desvincula la instancia: después `getInstance()` devuelve `undefined`. El DOM generado se conserva y `initAll()` se vuelve a vincular a él sin re-envolver el input. |

Propiedades de solo lectura útiles: `element` (contenedor), `input` (control nativo), `label`, `container`, `passwordToggle`, `startAction` y `endAction` (botones generados).

### Eventos

Además de los eventos nativos del control (`field.input`), el contenedor emite estos eventos (con `bubbles`):

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `input` | — (nativo) | El usuario escribe. Con máscara, el valor ya está formateado. |
| `change` | — (nativo) | El valor cambia y el campo pierde el foco. |
| `focus` / `blur` | — (nativo) | El campo gana o pierde el foco. |
| `mtx:text-field:password-visibility` | `{ visible }` | Se muestra u oculta la contraseña. |
| `mtx:text-field:adornment-click` | `{ position, button, input }` | Se pulsa un botón de `data-start-action` / `data-end-action`. |

Alias deprecados: `mtx:password-visibility` y `mtx:adornment-click` se siguen emitiendo con el mismo `detail` hasta la 1.0.

### Variables CSS

| Variable | Predeterminado | Descripción |
| :--- | :--- | :--- |
| `--mtx-tf-color` | `var(--mtx-color-primary)` | Color de foco de una instancia (lo cambian `data-color` y el error). |
| `--mtx-field-height-medium` | `56px` | Altura medium. |
| `--mtx-field-height-small` | `40px` | Altura small. |
| `--mtx-size-large-height` | `48px` | Altura large. |
| `--mtx-control-height-borderless` | `56px` | Altura mínima de la variante sin borde. |
| `--mtx-color-input-filled` / `--mtx-color-input-filled-hover` | tema | Fondo de la variante filled. |

## Accesibilidad

- El label generado es un `<label for>` asociado al `id` del control (si no tiene `id`, se genera uno).
- El texto de ayuda y el de error se enlazan con `aria-describedby`, conservando los ids que ya tuviera el campo.
- El error (por `setError()`, `data-error` o por superar un límite) marca `aria-invalid="true"`.
- El contador usa `aria-live="polite"` para anunciar los cambios.
- Los iconos generados llevan `aria-hidden="true"`. En `no-label` y `hidden-label` no hay label visible: añade `aria-label`.
- `required` añade el asterisco visual; el atributo nativo ya lo anuncia a los lectores de pantalla.
- El botón de contraseña es un `<button type="button">` con `aria-label` traducido, `aria-pressed` (estado) y `aria-controls` (id del input); no roba el foco del campo al pulsarlo con el ratón y se deshabilita junto con el campo.
- Los botones de `data-*-action` necesitan `data-*-action-label`: es su único nombre accesible.
- `data-dialog-autofocus` / `data-drawer-autofocus` en el `<input data-mtx="text-field">` enfocan el propio campo al abrir el [Dialog]({{< relref "/components/dialog" >}}) o Drawer, aunque el atributo se copie también al contenedor generado.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco al campo siguiente o anterior. |
| Teclas de texto | Escriben en el campo; con máscara, los literales se insertan solos y los caracteres no válidos se descartan. |
| <kbd>Enter</kbd> | En `<textarea>`, nueva línea; en `<input>`, envía el formulario (nativo). |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> sobre un botón de adorno | Muestra u oculta la contraseña o ejecuta la acción. |
