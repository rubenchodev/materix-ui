---
title: "Snackbar"
description: "Brief, temporary notification at an edge of the screen that confirms an action and can offer to undo it."
group: "feedback"
icon: "chat_bubble"
weight: 30
example: "snackbar"
mui: "https://mui.com/material-ui/react-snackbar/"
---

**Snackbar** shows a short floating message at an edge of the screen to confirm the outcome of an action ("Email sent", "Item deleted") and, optionally, offer a single action such as "Undo". It does not interrupt the user and can close on its own. Do not use it for errors the user must resolve (use an [Alert](../alert/) next to the content) or for mandatory decisions (use a [Dialog](../dialog/)).

## Basic usage

Declare the snackbar with `data-message` anywhere in the `<body>`: it stays hidden until you call `open()`. There is no declarative open attribute, so the trigger needs one line of JavaScript.

{{< mtx-demo title="Simple snackbar" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-doc-snackbar="doc-snack-basic">Show snackbar</button>

<div data-mtx="snackbar" id="doc-snack-basic" data-message="Message archived" data-duration="4000"></div>
{{< /mtx-demo >}}

```javascript
document.querySelector('[data-doc-snackbar]').addEventListener('click', () => {
  Materix.getInstance(document.getElementById('doc-snack-basic')).open();
});
```

## With action

`data-action` generates a `.mtx-snackbar__action` button to the right of the message. With `data-close-on-action` the snackbar closes when it is clicked (`reason: 'action'`); every click also emits `mtx:snackbar:action`, which you can listen for to run your logic.

{{< mtx-demo title="Undo action" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-action">Delete email</button>

<div data-mtx="snackbar" id="doc-snack-action" data-message="Email deleted" data-action="Undo" data-close-on-action data-duration="6000"></div>
{{< /mtx-demo >}}

## Position

`data-anchor` supports six positions. On screens 600px wide or less, the snackbar stretches to the full width with an 8px margin on each side.

{{< mtx-demo title="Six anchors" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-tl">top-left</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-tc">top-center</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-tr">top-right</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-bl">bottom-left</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-bc">bottom-center</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-br">bottom-right</button>

<div data-mtx="snackbar" id="doc-snack-tl" data-message="Top left" data-anchor="top-left" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-tc" data-message="Top center" data-anchor="top-center" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-tr" data-message="Top right" data-anchor="top-right" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-bl" data-message="Bottom left" data-anchor="bottom-left" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-bc" data-message="Bottom center" data-anchor="bottom-center" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-br" data-message="Bottom right" data-anchor="bottom-right" data-duration="3000"></div>
{{< /mtx-demo >}}

## Duration

`data-duration` sets the auto-hide delay in milliseconds. **If omitted (or set to `none`), the snackbar does not close on its own**: only with Escape, a click away, the action or `close()`. The timer pauses while the pointer or focus is inside and restarts with the full duration when they leave.

{{< mtx-demo title="2 s, 8 s and no auto-hide" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-short">2 seconds</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-long">8 seconds</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-persistent">No auto-hide</button>

<div data-mtx="snackbar" id="doc-snack-short" data-message="Closes in 2 seconds" data-duration="2000"></div>
<div data-mtx="snackbar" id="doc-snack-long" data-message="Hover over it to pause (8 s)" data-duration="8000"></div>
<div data-mtx="snackbar" id="doc-snack-persistent" data-message="Stays until you close it" data-action="Close" data-close-on-action></div>
{{< /mtx-demo >}}

## Consecutive

The component does not manage a queue: two snackbars open at the same position overlap. To show them one at a time (MUI's *Consecutive Snackbars* pattern), close the current one and open the next when `mtx:snackbar:close` is received.

```javascript
const el = document.getElementById('snack-queue');   // data-message="…" data-duration="2500"
const snackbar = Materix.getInstance(el);
const queue = [];

function showNext() {
  if (!queue.length || snackbar.isOpen) return;
  snackbar.open({ message: queue.shift() });
}

el.addEventListener('mtx:snackbar:close', () => setTimeout(showNext, 200));

function notify(text) {
  queue.push(text);
  snackbar.isOpen ? snackbar.close() : showNext();
}
```

## Quick notices

For one-off confirmations you don't need to declare a snackbar: `Materix.snackbar.show(options)` creates a shared snackbar in `<body>` the first time (`role="status"`, 4 s duration) and reuses it afterwards. It accepts a string or `{ message, action, onAction, duration, anchor, role }`; `onAction` runs when the action is clicked and then closes the notice.

{{< mtx-demo title="Materix.snackbar.show()" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-snack-show">Copy link</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-snack-show-undo">Archive with undo</button>
{{< /mtx-demo >}}

```javascript
Materix.snackbar.show('Link copied');

Materix.snackbar.show({
  message: 'Conversation archived',
  action: 'Undo',
  onAction: () => restoreConversation(),
  duration: 6000,
  anchor: 'bottom-left',
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var simple = document.getElementById('doc-snack-show');
  if (!simple) return;
  simple.addEventListener('click', function () { Materix.snackbar.show('Link copied to clipboard'); });
  document.getElementById('doc-snack-show-undo').addEventListener('click', function () {
    Materix.snackbar.show({
      message: 'Conversation archived',
      action: 'Undo',
      duration: 6000,
      anchor: 'bottom-left',
      onAction: function () { Materix.snackbar.show('Archive undone'); }
    });
  });
});
</script>

## Real-world examples

### Snackbar with Alert

For notifications with a severity, place an [Alert](../alert/) inside a snackbar without `data-message` and override the snackbar's background and padding with your own class.

{{< mtx-demo title="Success and error" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-alert-ok">Save profile</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-alert-error">Simulate error</button>

<div data-mtx="snackbar" class="doc-snackbar-alert" id="doc-snack-alert-ok" data-duration="4000" data-anchor="bottom-left">
  <div data-mtx="alert" data-severity="success" data-variant="filled">Profile updated successfully.</div>
</div>
<div data-mtx="snackbar" class="doc-snackbar-alert" id="doc-snack-alert-error" data-duration="4000" data-anchor="bottom-left">
  <div data-mtx="alert" data-severity="error" data-variant="filled">The profile could not be saved.</div>
</div>
{{< /mtx-demo >}}

```css
.doc-snackbar-alert { padding: 0; background-color: transparent; }
.doc-snackbar-alert > .mtx-alert { flex: 1; }
```

<style>
.doc-snackbar-alert { padding: 0; background-color: transparent; }
.doc-snackbar-alert > .mtx-alert { flex: 1; }
</style>

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-doc-snackbar]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.mtx-snackbar--open').forEach(function (el) {
        Materix.getInstance(el).close();
      });
      var target = document.getElementById(btn.getAttribute('data-doc-snackbar'));
      if (target) Materix.getInstance(target).open();
    });
  });
});
</script>

## Full BEM syntax

If the HTML already includes `.mtx-snackbar__message` and `.mtx-snackbar__action`, the component reuses them: it only adds the anchor, the `role` on the message (if missing) and the listeners.

```html
<div class="mtx-snackbar mtx-snackbar--bottom-center" id="snack-bem" data-mtx="snackbar"
     data-duration="5000" data-close-on-action>
  <div class="mtx-snackbar__message" role="status">Server-rendered structure</div>
  <button class="mtx-snackbar__action" type="button">Close</button>
</div>
```

## Programmatic usage

Snackbars are initialized on page load; to create them dynamically use `Materix.init(el, 'snackbar')` or `new Materix.Snackbar(el)`.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.setAttribute('data-message', 'File uploaded');
el.setAttribute('data-duration', '3000');
document.body.append(el);

const snackbar = Materix.init(el, 'snackbar');
snackbar.open();          // if already open, restarts the timer
snackbar.open({ message: 'Draft saved', action: 'View', onAction: () => openDraft(), duration: 5000 });
snackbar.setMessage('Upload complete');   // changes the text without opening
snackbar.setAction(null);                 // hides the action
snackbar.anchor = 'top-right';
snackbar.isOpen;          // true
snackbar.close('done');   // detail.reason === 'done'

document.addEventListener('mtx:snackbar:close', (event) => {
  console.log(event.target.id, event.detail.reason);
});
```

```javascript
// ES modules
import { Snackbar } from '@rubenchodev/materix-ui';

const snackbar = new Snackbar(document.querySelector('#notice'));
snackbar.open();
```

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `snackbar` | — | Initializes the component. |
| `data-message` | text | — | Generates `.mtx-snackbar__message` with that text (if it does not exist yet). |
| `data-action` | text | — | Generates the `.mtx-snackbar__action` button (if it does not exist yet). |
| `data-close-on-action` | boolean (presence) | absent | Closes when the action is clicked (`reason: 'action'`). |
| `data-duration` | milliseconds \| `none` | no auto-hide | Time until it closes automatically (`reason: 'timeout'`). |
| `data-anchor` | `top-left` \| `top-center` \| `top-right` \| `bottom-left` \| `bottom-center` \| `bottom-right` | `bottom-center` | Position on screen. |
| `data-open` | boolean (presence) | absent | Opens the snackbar on initialization. |
| `data-role` | ARIA role | `alert` | `role` applied to the message if it has none. |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-snackbar` | Fixed container (`--mtx-z-index-snackbar`, 1400), dark surface in the light theme and light surface in the dark theme (MUI), elevation 6. |
| `.mtx-snackbar--open` | Visible state (managed by the component). |
| `.mtx-snackbar--{anchor}` | Position: `--top-left`, `--top-center`, `--top-right`, `--bottom-left`, `--bottom-center`, `--bottom-right`. |
| `.mtx-snackbar__message` | Message text. |
| `.mtx-snackbar__action` | Uppercase action button (`--mtx-snackbar-action-color`). `hidden` hides it. |

### Methods

| Method | Returns | Description |
|---|---|---|
| `open(options?)` | `Snackbar` | Shows the snackbar, enables click-away closing and starts the timer; emits `mtx:snackbar:open`. `options`: `{ message, action, onAction, duration }` (`action: null` hides the action; `duration` applies to this opening only; `onAction` runs on click and closes with `reason: 'action'`). If already open, it updates the content and restarts the timer. |
| `setMessage(text)` | `Snackbar` | Replaces the message text (creates `.mtx-snackbar__message` if missing). |
| `setAction(label)` | `Snackbar` | Sets the action text, creating the button if needed; `null`/`false` hides it. |
| `anchor` | `string` | Getter/setter of the position (`bottom-center`, `top-right`…). |
| `close(reason?)` | `void` | Hides the snackbar and emits `mtx:snackbar:close`. Default `reason`: `'programmatic'`. |
| `isOpen` | `boolean` | Getter: `true` if it is visible. |
| `destroy()` | `void` | Closes it and removes all listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |
| `Materix.snackbar.show(options)` | `Snackbar` | Helper: shows `options` (string or `open()` options plus `anchor` and `role`) in a shared snackbar created on demand. Also exported as `showSnackbar` in ES modules. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:snackbar:open` | — | It opens (bubbles). |
| `mtx:snackbar:action` | — | The action button is clicked (bubbles). |
| `mtx:snackbar:close` | `{ reason }`: `'timeout'`, `'clickaway'`, `'escapeKeyDown'`, `'action'`, `'programmatic'` or the reason passed to `close()` | It closes (bubbles). |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-snackbar-bg` | Background: `background-default` darkened 80 % (light) or lightened 80 % (dark), as MUI's `emphasize`. |
| `--mtx-snackbar-color` | Text: `#fff` (light) / `rgba(0, 0, 0, 0.87)` (dark). |
| `--mtx-snackbar-action-color` | Action color and focus ring (primary lightened in light theme, darkened in dark theme). |
| `--mtx-z-index-snackbar` | Stacking level (1400). |
| `--mtx-elevation-6` | Shadow. |
| `--mtx-shape-radius` | Corner radius. |
| `--mtx-font-family` | Typography. |
| `--mtx-duration-standard` / `--mtx-easing-standard` | Enter and exit transition. |

## Accessibility

- The message gets `role="alert"` (configurable with `data-role`, e.g. `status` for non-urgent notices), so screen readers announce it when it appears.
- The action is a native `<button type="button">`, reachable with `Tab`.
- While the pointer or focus is inside, the timer pauses to give time to read or act (WCAG 2.2.1).
- The snackbar does not steal focus: if the action is important, also offer another way to perform it.

| Key | Action |
|---|---|
| `Escape` | Closes the most recently opened snackbar (`reason: 'escapeKeyDown'`). It has the lowest priority in the layer stack: it does nothing while any Dialog, Drawer, Menu, Popover or tooltip is open, or if another component already handled the key. |
| `Tab` | Moves focus to the action (pauses the timer). |
| `Enter` / `Space` | Activates the focused action. |
