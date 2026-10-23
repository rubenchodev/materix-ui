# Pruebas E2E, visuales y de accesibilidad (Playwright)

Los tests unitarios (`npm test`, Vitest + JSDOM) no ven el CSS. Esta carpeta valida la librería **en navegadores reales**: Chromium, Firefox y WebKit (Safari), en escritorio (1280×800) y móvil (Pixel 5 en Chromium, iPhone 13 en WebKit).

## Puesta en marcha

```bash
npm install
npm run test:e2e:install   # descarga chromium, firefox y webkit
npm run build              # los ejemplos y plantillas cargan ../../dist
```

`playwright.config.js` arranca `tests/e2e/server.mjs` (servidor estático sin dependencias que sirve la raíz del repo en `http://127.0.0.1:4173`; puerto configurable con `E2E_PORT`). Si ya hay uno levantado, lo reutiliza.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run test:e2e` | Todas las specs en todos los proyectos. |
| `npm run test:smoke` | `smoke.spec.js` en los 5 proyectos. |
| `npm run test:interactions` | `interactions.spec.js` en chromium, firefox y webkit. |
| `npm run test:a11y` | `a11y.spec.js` (axe-core) en chromium. |
| `npm run test:visual` | `visual.spec.js` en chromium y mobile-chromium. |
| `npm run test:visual:update` | Regenera las capturas base. |
| `npm run test:all` | `vitest run` + build + toda la suite E2E. |

Filtrar: `npx playwright test smoke --project=webkit -g "examples/dialog"`. Informe HTML: `npx playwright show-report` (en `playwright-report/`). Las trazas de fallos quedan en `test-results/`.

## Specs

- **`smoke.spec.js`**: descubre con `fs` todas las páginas `examples/*/index.html` y `templates/*/index.html` (más las portadas) y, en tema claro y oscuro (`?theme=dark|light`, que soportan `examples/shared/theme.js` y `templates/shared/template.js`), comprueba: 0 `pageerror` y 0 errores de consola, 0 respuestas 4xx/5xx de recursos locales, todo `[data-mtx]` con `data-mtx-initialized`, sin overflow horizontal, ningún `.material-icons` renderizado como texto (> 40px) y ningún `.material-icons` con `font-size` distinto de 24px. Los recursos rotos a propósito (`no-existe.*`, `missing.*`, `broken.*`: fallback de Avatar) están en la lista blanca de `support/audit.js`.
- **`interactions.spec.js`**: flujos con teclado y ratón reales: Dialog, Menu, Select, Autocomplete, Tabs, Drawer responsive (plantilla dashboard a 1280 y 390), DateTimePicker, Slider, Tooltip, Snackbar, Popover, Backdrop, ButtonGroup, Skeleton y tema. Usa selectores por `data-mtx`, roles ARIA e ids de demo (nunca textos visibles ni ids de sección). Si un ejemplo no existe, el bloque se salta con `fs.existsSync`.
- **`a11y.spec.js`**: axe-core con reglas WCAG 2.0/2.1 A y AA en cada página y tema. Solo falla por violaciones `serious`/`critical`; el JSON completo se adjunta al informe.
- **`visual.spec.js`**: `toHaveScreenshot` de página completa en chromium (1280, claro y oscuro) y mobile-chromium (claro), con reloj congelado (`2026-01-15 10:30`), animaciones desactivadas, `prefers-reduced-motion`, caret oculto, sin ripples y máscara para `[data-e2e-dynamic]`, `video`, `iframe` y `canvas`. Umbral `maxDiffPixelRatio: 0.01`.

## Capturas base

Las capturas se guardan en `tests/e2e/__screenshots__/{proyecto}/{kind}-{slug}-{tema}.png` y se versionan. Mientras no existan, `visual.spec.js` **salta** cada caso en vez de crearlas en silencio.

```bash
npm run build
npm run test:visual:update   # genera o reemplaza todas las capturas base
npm run test:visual          # compara contra ellas
```

Regenera las capturas solo tras revisar visualmente el cambio y súbelas en el mismo commit. Para probar sin tocar el repo: `E2E_SNAPSHOT_DIR=/ruta/temporal npm run test:visual:update`. Las capturas dependen del sistema operativo y de las fuentes (Roboto y Material Icons se cargan desde Google Fonts): genera y compara siempre en la misma plataforma (idealmente la de CI).

## Notas

- Si otro proceso ejecuta `npm run build` a la vez, Vite vacía `dist/` y pueden aparecer 404 de `materix.umd.js`/`materix.min.css` transitorios: vuelve a lanzar la suite.
- Contenido dinámico en una página nueva: márcalo con `data-e2e-dynamic` para enmascararlo en las capturas.
