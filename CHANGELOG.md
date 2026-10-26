# Changelog

All notable changes to Materix UI for React (`@rubenchodev/materix-react`) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the version is `0.x`, a minor release may contain breaking changes; every one of them is listed here.

## [Unreleased]

## [0.2.0] - 2026-10-26

### Added
- `useDrawer({ id, defaultOpen, onOpen, onClose })`: open state plus `getTriggerProps()` (`aria-controls`, `aria-expanded`, `onClick`) and `drawerProps`.
- `useContextMenu().openFor(event, area)` to open a context menu anchored to an explicit area.
- `Breadcrumbs` `defaultExpanded`.
- `getPortalRoot()` in the core: shared `div.mtx-root[data-mtx-portal-root]` container for portaled content.
- Documentation: Spanish demo variants on every `/es/` page.

### Changed
- `Portal` mounts into the shared `.mtx-root` container (or `body` when it already is `.mtx-root`), so popovers, menus, tooltips, selects, dialogs and drawers inherit the base typography.
- `ContextMenu` with a selector `target` delegates `contextmenu` on `document`, so areas added after mounting work.
- `ToggleButton` `onChange` only fires when the group applied the change; the group is notified first.
- `Tabs` with `value` inside a `TabContext` keeps the context in sync.
- `Dialog` `maxWidth="xs"` is 20rem, below `sm`.

### Fixed
- `useControlled`: no false "changing the default value" warnings for object/array defaults recreated on each render (StrictMode).
- Controlled `Slider`; `TextField` and `NativeSelect` chain `onFocus`/`onBlur` from `inputProps` and props; mask cursor after Backspace over literals.
- `Rating` resets to `defaultValue` on `form.reset()` and keeps an explicit `aria-label` in `readOnly`.
- Shift+F10 and the Menu key open `ContextMenu` anchored to the area with focus on the first item.
- `Drawer` responsive mode no longer reports a mode change while hydrating.
- `Tab`s and `Breadcrumbs` items inside Fragments; `Pagination` with `count=0` and both nav buttons hidden renders nothing.
- `Snackbar`/`Backdrop` stable live regions, `Stepper` SSR and inert handling, `DateTimePicker`, `Select`, `Autocomplete`, `Popover`, `SpeedDial` and other minor fixes.
- `ThemeProvider` no longer flashes with `defaultMode="system"`.

### Removed
- `Menu` `submenu` prop (internal; `Submenu` handles it).
- `ToggleButtonGroupContext` export (internal).

## [0.1.0] - 2026-10-24

First release: 47 React components on top of the `@rubenchodev/materix-ui` CSS.

[Unreleased]: https://github.com/rubenchodev/materix-ui/compare/react-v0.2.0...react-js
[0.2.0]: https://github.com/rubenchodev/materix-ui/releases/tag/react-v0.2.0
[0.1.0]: https://www.npmjs.com/package/@rubenchodev/materix-react/v/0.1.0
