# Changelog

All notable changes to Materix UI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the version is `0.x`, a minor release may contain breaking changes; every one
of them is listed here and explained step by step in [MIGRATION.md](./MIGRATION.md).

## [Unreleased]

## [0.3.1] - 2026-10-23

### Changed
- `homepage` in `package.json` points to the documentation site, [qualitycode.dev/materix-ui](https://qualitycode.dev/materix-ui/vainilla/).
- README: prominent link to the documentation site (English and Spanish); links to CHANGELOG, MIGRATION and LICENSE are absolute so they also work on npmjs.com.

## [0.3.0] - 2026-10-23

First release on npm, published as **`@rubenchodev/materix-ui`** (npm rejects the unscoped name `materix-ui` as too similar to `material-ui`). Use `npm install @rubenchodev/materix-ui` and `https://cdn.jsdelivr.net/npm/@rubenchodev/materix-ui@0.3.0/dist/`.

### Added
- `resetLocale()` (also `Materix.i18n.resetLocale()`): discards the language set with `setLocale()` and follows `<html lang>` again.
- Tokens `--mtx-color-common-white`, `--mtx-color-common-black`, `--mtx-color-grey-100/200/700`, `--mtx-rating-color` and `--mtx-breadcrumbs-collapse-*`.
- `cancelTransition(el)` in `src/core/transition.js`; `positionDropdown()` in `src/core/position.js`.

### Changed
- The repository moved to [rubenchodev/materix-ui](https://github.com/rubenchodev/materix-ui); tags are now `vX.Y.Z`.
- i18n precedence: a local `lang`/`data-locale` > `setLocale()` > `<html lang>` > `en`. `getLocale()`, `getDictionary()` and `t()` without a locale return the effective global language.
- `new Component(el)` on an element that already has an instance of the same component destroys the previous one.
- Menu and Select use `position.js` (RTL, auto-update, side kept while open). The internal `floating-position.js` was removed.
- Components emit their events with `emit()`; names, `detail` and options are unchanged.
- DateTimePicker uses theme tokens instead of hard-coded MUI blue; the static variant has no shadow.

### Fixed
- TextField: listeners and timers released on `destroy()`; no nested wrapper on re-init; label aligned with the input text in every variant, size, multiline and no-label case with adornments.
- DateTimePicker: one timer per clock gesture instead of one per mousemove; timers cleared on `destroy()`; double construction no longer opens two popovers.
- Re-initialising Menu, Select and dismissible Alert no longer duplicates nodes; `destroy()` + `initAll()` on Select no longer throws.
- Popover, Accordion and Alert destroyed mid-animation end hidden; Drawer and Table release all listeners on `destroy()`.
- Core: scroll lock released for removed modals, ripple listeners no longer accumulate, transitions cancellable, single click-away on touch, portal restores the original position, manual `data-mtx-theme` respected in `system` mode.
- CSS: misspelled token names, duplicated tokens and hard-coded colours/z-index replaced with tokens; Speed Dial icon honours `prefers-reduced-motion`.

## [0.2.0] - 2026-10-20

First release prepared for npm. See [MIGRATION.md](./MIGRATION.md) for upgrading from 0.1.

### Added

#### Packaging

- **Per-component ES modules** for tree-shaking: `@rubenchodev/materix-ui/components/{name}` (JavaScript, registers
  itself, auto-initializes its `[data-mtx]` elements and imports the CSS it needs: its own and that of
  the components it uses inside, derived from the import graph, so one import is enough).
  `@rubenchodev/materix-ui/components/{name}.css` holds only that component's styles (deduplicated by bundlers
  when several components import it) and `@rubenchodev/materix-ui/components/{name}.bundle.css` the component
  plus its dependencies for `<link>` usage. Shared code lives in `dist/chunks/` and the core is emitted once.
- `@rubenchodev/materix-ui/core` (registry, lifecycle, `ComponentBase`, `emit`, theme, i18n, positioning),
  `@rubenchodev/materix-ui/base.css` (design tokens + base styles + ripple) and `@rubenchodev/materix-ui/utilities.css`
  as separate entry points.
- **TypeScript declarations** (`types/`): every component class with its public methods and
  properties, the core API with generics (`getInstance<Dialog>(el)`, `init(el, 'select')` returns a
  `Select`), typed `mtx:*` events (`CustomEvent` detail map that augments `HTMLElementEventMap`
  and `DocumentEventMap`) and the UMD global `Materix`.
- `exports` map (`.`, `./core`, `./components/*`, `./components/*.css`, `./base.css`,
  `./utilities.css`, `./materix.min.css`, `./dist/*`), `sideEffects`, `types`/`typesVersions`,
  `unpkg`/`jsdelivr` fields and `dist/materix.umd.cjs` for `require()`.
- `README.md`, `LICENSE` (MIT), this changelog and `MIGRATION.md` in the package.

#### Components

- Layout: **Container**, **Stack**.
- Inputs: **Slider**, **Autocomplete**, **ButtonGroup**, **ToggleButton** / **ToggleButtonGroup**,
  **Rating**, **FormHelperText** (integrated in Checkbox, Switch, RadioGroup and TextField).
- Data display: **Tooltip** (including the global declarative `data-mtx-tooltip="Text"`).
- Feedback: **CircularProgress** / **LinearProgress** (plus the `createCircularProgress()` helper),
  **Skeleton** (plus the `Materix.skeleton` helper), **Backdrop**.
- Surfaces: **Accordion** / **AccordionGroup** / **AccordionActions** (from `<div>` or native
  `<details>`), **Popover**.
- Navigation: **Breadcrumbs**, **Pagination**, **Stepper** / **MobileStepper**.
- **CSS utilities** (`src/styles/utilities.css`, ~950 classes generated by
  `npm run gen:utilities`): display, flex, gap, spacing, sizing, text, color, position, overflow,
  borders, elevation and accessibility helpers, responsive at `sm`/`md`/`lg`/`xl`.

#### APIs and features

- Theme API `Materix.theme` (`get`, `getMode`, `set`, `toggle`, `configure`, `sync`), declarative
  `[data-mtx-theme-toggle]` buttons, persistence (`data-mtx-theme-persist`) and `?theme=` query
  support (`data-mtx-theme-query`).
- `Materix.snackbar.show(text | options)` with a shared snackbar; Snackbar `open({message, action,
  onAction, duration})`, `setMessage()`, `setAction()` and the `mtx:snackbar:action` event.
- Lifecycle: `ComponentBase#listen()`, `#onDestroy()` and `#destroy()`; `Materix.destroy(element)`,
  `Materix.destroyAll(root)` and `Materix.watch(root, { destroyOnRemove })`.
- Positioning engine `computePosition()` / `autoUpdate()` (used by Tooltip, Popover, Autocomplete
  and Slider).
- `emit()` helper and the `mtx:{component}:{action}` event naming convention.
- Button: `data-surface="primary|secondary"` (`mtx-button--on-{surface}`) to adapt the button to a colored background; `data-loading`, `data-loading-position`, `data-loading-indicator`, `setLoading()`,
  `data-start-icon` / `data-end-icon`, `data-color` (including `inherit`).
- TextField: `data-password-toggle`, `data-start-action` / `data-end-action` adornment buttons,
  `togglePasswordVisibility()`.
- Table: built-in row selection (`data-selectable`, `selected`, `getSelectedRows()`, `toggleRow()`,
  `selectAll()`, `clearSelection()`, `mtx:table:selection-change`) and **TableToolbar**.
- Drawer: `data-variant="responsive"` (temporary below a breakpoint, permanent above it),
  `data-clipped`, `data-header="temporary"`.
- AppBar: `data-drawer` toggle, `.mtx-app-bar-search`, `.mtx-toolbar-offset`.
- Dialog: `data-title` / `data-description` with automatic `aria-labelledby` / `aria-describedby`.
- List: ListItemAvatar and ListItemSecondaryAction, `aria-current` handling.
- Menu: explicit triggers (`data-open-menu`, `data-mtx-menu-trigger`, `aria-controls`,
  `data-anchor`) with delegation for dynamic triggers; `menuitemcheckbox` / `menuitemradio`.
- Badge: `default` color, `data-standalone`, screen-reader label `data-label`.
- `--mtx-color-{color}-text` tokens (accessible color for text and icons on the background) and the
  `data-mtx-contrast="mui"` opt-out (on `<html>` or any container) that restores MUI's exact text
  colors; `data-mtx-contrast="aa"` is accepted as an alias of the default.
- Theme builder: contrast mode (WCAG AA by default, or exact MUI); the generated CSS includes `-text`.
- **Layer stack** (`src/core/layers.js`, `Materix.layers`): `Escape` closes only the topmost
  surface (tooltip first, snackbar last); surfaces opened on top of others get a stacked `z-index`,
  so a Dialog opened from a Popover works.
- Menu: `data-position-anchor` and `open(trigger, { anchorEl })` (the ButtonGroup split button now
  anchors to the whole group, as in MUI). Slider: `data-marks-inset`.
- Registry: `registerHomeNode`; `watch({ destroyOnRemove })` and `destroyAll` also release
  surfaces portaled to `<body>` (Menu, Popover). Generated ids use `uniqueId()`.
- Focus trap helper `getTabbable()`; scrollable TableContainers are focusable named regions
  (WCAG 2.1.1).
- Responsive typography, i18n strings for every built-in label, bilingual documentation
  (English / Spanish), examples translated to English and 12 full-page templates built only with library pieces.

### Changed

- **Typography**: `h1`–`h6` no longer have a default bottom margin (as in MUI). Use
  `data-gutter-bottom`, `mtx-typography--gutter-bottom` or the `mtx-mb-*` utilities.
- **Grid**: spacing uses `gap` (MUI Grid v2) instead of negative margins; `{bp}-auto` now sizes to
  its content instead of growing like `true`.
- **Card**: actions are right-aligned by default (`data-align="start"` restores the MUI layout).
- **Stack**: the default direction is `column` (as in MUI).
- **NativeSelect**: the default variant is `standard` (MUI NativeSelect).
- **Menu**: the previous sibling is no longer used as an implicit trigger.
- **DateTimePicker**: the default date format follows the locale (`en` → `MM/DD/YYYY`,
  `es` → `DD/MM/YYYY`); `data-picker="date|time|datetime"` takes precedence over the `data-mtx` name.
- **TextField**: the `large` size is now 48px (it was 56px), aligned with the large Button.
- **Avatar**: the default background is grey 600 with white text (WCAG AA), a deliberate deviation
  from MUI's grey 400.
- **Color contrast: WCAG AA by default** (equivalent to MUI's `contrastThreshold: 4.5`). Brand
  backgrounds keep MUI's colors; only text changes: `--mtx-color-{error,warning,info,success}-text`
  are darker in light mode (lighter `error` in dark mode), and `--mtx-color-{warning,info}-contrast`
  (light) and `--mtx-color-error-contrast` (dark) are `rgba(0, 0, 0, 0.87)`. Contained buttons with
  dark text lighten on hover. `data-mtx-contrast="mui"` restores MUI's exact values.
- Error labels, asterisks and helper texts of TextField, Select, NativeSelect, Autocomplete,
  DateTimePicker and FormHelperText use `--mtx-color-error-text` (≥ 4.5:1 also on the grey of filled
  fields); focused labels of colored TextField/Select use `--mtx-color-{color}-text`.
- `text-disabled` is reserved for disabled content: days of other months in the DatePicker use
  `text-secondary`; static List rows with `data-disabled` and helper texts of disabled
  Checkbox/Switch get `aria-disabled="true"`. Badge `default` background is darker (≥ 4.5:1).
  The DatePicker header year is more opaque (≥ 4.5:1 in dark mode).
- **Dark theme**: per-level elevation overlay (MUI overlay compensated for the `#1e1e1e` paper).
- **base.css**: `margin: 0` applies only to `body.mtx-root`; the reduced-motion rules are scoped to
  `mtx-*` classes.
- **AppBar**: transitions are enabled only after the first frame (no animation on page load).
- Instances are stored in a `WeakMap`: removed nodes no longer keep their instance alive.
- Utilities previously duplicated in `base.css` / `box.css` were consolidated into `utilities.css`
  (the `ml`/`mr`/`pl`/`pr` aliases are kept).
- Every event uses the `mtx:{component}:{action}` form (see *Deprecated*).
- **Link**: underlined by default (`underline="always"`, as in MUI v5) with a soft underline that
  becomes solid on hover; `data-underline="hover"` restores the previous look. Breadcrumbs keep the
  hover-only underline.
- **Chip**: the delete icon is a non-focusable `<span aria-hidden title>`; deletable chips are
  removed with `Delete`/`Backspace` (`aria-keyshortcuts`). `data-delete-label` sets the `title`.
  Pre-rendered `<button class="mtx-chip__delete">` is converted automatically.
- **Focus trap** (Dialog, temporary Drawer, modal Popover) always handles `Tab`/`Shift+Tab`
  explicitly, so links are included in WebKit/Safari. Dialog, Drawer and Popover return focus to the
  trigger that was clicked even when the browser did not focus it (WebKit).
- **ButtonGroup** no longer sets `aria-orientation` on `role="group"` (only with `role="toolbar"`).
- **AppBar / Toolbar**: consecutive actions placed directly in the Toolbar (IconButton, Button,
  Avatar, Badge, ToggleButton) are separated by `--mtx-toolbar-action-gap` (8px by default), so
  icons, badges and the avatar no longer touch. Set it to `0` for MUI's flush icon buttons.
- **Divider** inside a list (`<li>`) no longer uses `role="separator"`; an empty one is `aria-hidden`.
- **Drawer**: collapsed nested menus are `hidden` + `inert`.

### Deprecated

The old event names are still dispatched, with the same `detail`, next to the new ones. They will
be removed in **1.0.0**.

| Old name | New name |
|---|---|
| `mtx-select` (List) | `mtx:list:select` |
| `mtx:change` (RadioGroup) | `mtx:radio-group:change` |
| `mtx:change` / `mtx:open` / `mtx:close` (DateTimePicker) | `mtx:date-time-picker:change` / `:open` / `:close` |
| `mtx:password-visibility` | `mtx:text-field:password-visibility` |
| `mtx:adornment-click` | `mtx:text-field:adornment-click` |
| `mtx:drawer:modechange` | `mtx:drawer:mode-change` |
| `mtx:localechange` | `mtx:locale:change` |
| `mtx:theme-change` | `mtx:theme:change` |
| `mtx-speed-dial-open` / `mtx-speed-dial-close` | `mtx:speed-dial:open` / `mtx:speed-dial:close` |

### Removed

- `examples/input-base` (it was not a component; use TextField).
- `box.css` (its utilities live in `utilities.css`, which is part of `materix.min.css`).

### Fixed

- Alert `[hidden]` and `close()` no longer leave an empty gap.
- Global `[hidden]` support inside `.mtx-root`.
- IconButton no longer clips a Badge placed inside it.
- Importing the library in a non-browser environment (SSR, Node) no longer throws because of the
  Dialog trigger listener.
- Fixed-position roots (Dialog, Drawer and its backdrop, DateTimePicker backdrops, Snackbar, Menu
  and Autocomplete poppers) set `margin: 0`, so page styles can no longer offset them.
- `Escape` no longer closes several stacked surfaces at once.
- Clickable filled Chips with dark text (warning and info in the light theme, every palette color in
  the dark theme) lighten on hover instead of darkening, like contained Buttons, so the label keeps
  at least 4.5:1 (light info dropped to 4.3:1). `data-mtx-contrast="mui"` keeps MUI's darkening.
- Skeleton wraps direct text in `.mtx-skeleton__text` and hides it with `visibility`, so automated
  contrast checks no longer flag the placeholder's transparent text.

## [0.1.0]

Initial development version (not published to npm).

### Added

- Vanilla architecture: `data-mtx` declarative initialization, central registry (`registerComponent`,
  `initAll`, `getInstance`, `init`, `watch`), idempotent initialization and single-element
  auto-scaffolding.
- MUI design tokens with light and dark themes.
- Components: Button (with Ripple), IconButton, Fab, SpeedDial, Grid, Paper, Divider, Card, Typography,
  Link, Avatar / AvatarGroup, Badge, Chip, Alert, Snackbar, Dialog, Drawer, AppBar, Tabs, List, Menu,
  Table, TextField, Select, NativeSelect, Checkbox, Radio, Switch, DateTimePicker and CssBaseline.
- i18n with English and Spanish dictionaries.
- Examples in `/examples` and Hugo documentation.

[Unreleased]: https://github.com/rubenchodev/materix-ui/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/rubenchodev/materix-ui/releases/tag/v0.3.1
[0.3.0]: https://github.com/rubenchodev/materix-ui/releases/tag/v0.3.0
[0.2.0]: https://github.com/rubenchodev/materix-ui/releases/tag/v0.2.0
[0.1.0]: https://github.com/rubenchodev/open-source-libraries/tree/main/materix-ui
