---
title: "Uso rápido"
description: "El modelo mental de Materix UI: escribe un elemento con data-mtx y la librería construye la estructura, el estado y la accesibilidad."
weight: 20
icon: "bolt"
---

Escribes **un elemento HTML con `data-mtx`** y atributos `data-*`. Al cargar la página, Materix construye la estructura interna (label, borde, iconos, texto de ayuda), conecta los eventos y aplica los atributos ARIA. No hace falta escribir JavaScript.

## Un formulario en cinco líneas

{{< mtx-demo title="Formulario de registro" layout="column" >}}
<input data-mtx="text-field" data-label="Nombre completo" data-variant="outlined" name="name" required>
<input data-mtx="text-field" data-label="Correo" data-variant="outlined" data-start-icon="email" data-helper-text="Nunca lo compartiremos" type="email" name="email">
<select data-mtx="select" data-label="País" name="country">
  <option value="co">Colombia</option>
  <option value="mx">México</option>
  <option value="es">España</option>
</select>
<input type="checkbox" data-mtx="checkbox" data-label="Acepto los términos" name="terms">
<button type="submit" class="mtx-button mtx-button--contained" data-mtx="button">Crear cuenta</button>
{{< /mtx-demo >}}

Los controles siguen siendo `<input>`, `<select>` y `<button>` nativos: se envían con el formulario, respetan `name`, `required`, `disabled` y `value`, y funcionan con la validación del navegador.

## Sintaxis simplificada (recomendada)

Un único elemento semántico. La configuración va en atributos `data-*`:

```html
<input data-mtx="text-field" data-label="Nombre" data-variant="filled" data-start-icon="person">
```

Qué ocurre al inicializar:

1. Materix envuelve el `<input>` en un contenedor `.mtx-text-field` y le traslada los atributos `data-*` y las clases.
2. Genera el `<label>` flotante, el borde con muesca (`outlined`), los iconos y el texto de ayuda.
3. Conserva los atributos originales del `<input>` (`id`, `name`, `value`, `required`, `disabled`...) y le asigna un `id` si no tiene, para enlazar el label.
4. Marca el elemento con `data-mtx-initialized` y guarda la instancia en el registro.

Este proceso se llama **auto-scaffolding** y es idempotente: inicializar dos veces no duplica nada.

## Sintaxis BEM completa

Si renderizas en servidor y quieres controlar cada nodo, escribe la estructura completa. Materix detecta que ya existe y solo se vincula a ella:

```html
<div class="mtx-text-field mtx-text-field--outlined" data-mtx="text-field">
  <label class="mtx-text-field__label" for="name">Nombre</label>
  <div class="mtx-text-field__container">
    <input class="mtx-text-field__input" id="name" type="text" placeholder=" ">
  </div>
</div>
```

Ambas sintaxis producen el mismo resultado visual. Cada página de componente documenta su estructura BEM en la sección **Sintaxis BEM completa**.

{{< callout type="info" title="Botones: clases, no data-variant" >}}
`Button`, `IconButton` y `Fab` se construyen sobre el `<button>` nativo y su variante se declara con clases: `class="mtx-button mtx-button--contained"`. `data-mtx="button"` añade el ripple, el tamaño (`data-size`) y el estado deshabilitado en enlaces. Consulta los modificadores en la página de [Button]({{< relref "/components/button" >}}).
{{< /callout >}}

## Convenciones

| Convención | Forma | Ejemplo |
|---|---|---|
| Prefijo | Todo lo de la librería empieza por `mtx-` | `mtx-card`, `--mtx-color-primary` |
| Bloque BEM | `mtx-{componente}` | `mtx-text-field` |
| Elemento BEM | `mtx-{componente}__{elemento}` | `mtx-text-field__label` |
| Modificador BEM | `mtx-{componente}--{modificador}` | `mtx-button--outlined`, `mtx-button--small` |
| Inicialización | `data-mtx="{componente}"` en kebab-case | `data-mtx="date-picker"` |
| Opciones | `data-{opción}` en kebab-case | `data-start-icon`, `data-helper-text` |
| Estado interno | `data-mtx-initialized` (lo pone la librería; no lo escribas) | — |
| Tokens | Variables CSS `--mtx-*` | `--mtx-shape-radius` |
| Eventos | `mtx:{componente}:{acción}` | `mtx:dialog:close` |
| Tema | `data-mtx-theme` en `<html>` | `data-mtx-theme="dark"` |
| API global | Objeto `Materix` (UMD) o imports con nombre (ESM) | `Materix.getInstance(el)` |

## Declarativo y programático

Lo declarativo cubre los casos habituales. Cuando necesitas controlar un componente desde código, recupera la instancia que ya creó la autoinicialización:

```javascript
const dialog = Materix.getInstance(document.getElementById('confirm'));
dialog.open();
```

Para un elemento sin `data-mtx` (por ejemplo, creado desde JavaScript), instancia la clase directamente:

```javascript
const el = document.createElement('button');
el.className = 'mtx-button mtx-button--outlined';
el.textContent = 'Guardar';
document.body.append(el);

const button = new Materix.Button(el);
button.disable();
```

{{< callout type="warning" >}}
No uses `new Materix.X(el)` sobre un elemento que ya tiene `data-mtx`: la autoinicialización ya creó una instancia y obtendrías dos, con los eventos duplicados. Usa `Materix.getInstance(el)` o `Materix.init(el)`, que devuelve la existente.
{{< /callout >}}

Los métodos de cada componente están en su sección **Referencia de API**. El ciclo de vida completo (cuándo se inicializa, contenido dinámico, eventos) está en [Inicialización]({{< relref "/guide/initialization" >}}).
