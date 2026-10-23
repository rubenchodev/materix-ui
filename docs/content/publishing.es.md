---
title: "Publicación y versionado"
description: "Versionado SemVer, changelog, contenido del paquete y los pasos exactos para publicar Materix UI en npm con las comprobaciones de prepublishOnly y etiquetas de Git."
weight: 10
---

## Versionado SemVer

Materix UI utiliza **Semantic Versioning (SemVer)** con el formato `MAJOR.MINOR.PATCH`.

* **MAJOR**: cambios incompatibles con la API pública (breaking changes).
* **MINOR**: nuevas funcionalidades compatibles hacia atrás.
* **PATCH**: correcciones de errores compatibles hacia atrás.

La API pública es todo aquello en lo que se apoya quien consume la librería: nombres `data-mtx` y atributos `data-*`, clases BEM, design tokens (`--mtx-*`), la API JavaScript (`Materix.*`, métodos de los componentes), los nombres de los eventos `mtx:*` y su `detail`, las rutas `exports` del paquete y los tipos TypeScript.

### Reglas para 0.x

* Antes de `1.0.0`, una versión `MINOR` puede incluir breaking changes. Cada uno se lista en `CHANGELOG.md` y se explica en `MIGRATION.md` (cómo detectarlo y cómo migrar, con fragmentos antes/después).
* Los eventos renombrados siguen emitiendo el nombre antiguo como alias deprecado hasta `1.0.0`.
* Un componente **no** se considera estable hasta que tenga implementación, ejemplo funcional, documentación bilingüe y pruebas.

### Commits

Los prefijos semánticos facilitan redactar el changelog:

```text
feat: add Slider component
fix: fix TextField focus
docs: update Button documentation
refactor: simplify the component registry
```

## Qué contiene el paquete

`package.json` publica solo `dist/`, `types/`, `README.md`, `LICENSE`, `CHANGELOG.md` y `MIGRATION.md` (campo `files`). Los ejemplos, la documentación, las plantillas y las pruebas no se publican.

| Campo | Valor |
|---|---|
| `main` | `dist/materix.umd.cjs` (CommonJS) |
| `module` | `dist/materix.es.js` |
| `types` | `types/index.d.ts` |
| `style` | `dist/materix.min.css` |
| `unpkg` / `jsdelivr` | `dist/materix.umd.js` (el archivo por defecto de `https://cdn.jsdelivr.net/npm/materix-ui`) |
| `exports` | `.`, `./core`, `./components/*`, `./components/*.css`, `./base.css`, `./utilities.css`, `./materix.min.css`, `./dist/*` |
| `sideEffects` | Los CSS y `dist/**/*.js` (los módulos registran componentes al importarse) |

`npm run build` ejecuta tres pasos: el bundle completo (`vite build`), los módulos por componente (`vite build -c vite.modules.config.js`) y las declaraciones TypeScript (`node scripts/gen-types.mjs`, que escribe `types/lib` y `types/components` a partir del JSDoc de `src/`). Los archivos escritos a mano, `types/index.d.ts`, `types/core.d.ts` y `types/events.d.ts`, refinan esa base; `npm run types:check` compila `tests/types/*.ts` contra ellos.

## Pasos de publicación

El paquete se publica desde la raíz del [repositorio materix-ui](https://github.com/rubenchodev/materix-ui).

1. **Actualiza el changelog.** Mueve las entradas de `## [Unreleased]` de `CHANGELOG.md` a una nueva sección `## [x.y.z] - AAAA-MM-DD` (Added / Changed / Deprecated / Removed / Fixed). Si hay breaking changes, actualiza `MIGRATION.md`.
2. **Sube la versión** en `package.json` y en `docs/hugo.toml` (`params.version`, que muestra la documentación y usan los enlaces CDN del playground). Usa `npm version` sin etiqueta, para que el commit y la etiqueta se creen solo tras publicar con éxito (paso 5):

   ```bash
   npm version 0.3.0 --no-git-tag-version
   ```

3. **Revisa el contenido del paquete** (no ejecuta scripts):

   ```bash
   npm run build
   npm pack --dry-run
   ```

   La lista solo debe contener `dist/`, `types/` y los archivos README, LICENSE, CHANGELOG y MIGRATION.

4. **Inicia sesión y publica.** `prepublishOnly` ejecuta `npm run build`, `npm test` y `npm run types:check`; si alguno falla, no se publica nada.

   ```bash
   npm login
   npm publish
   ```

   `publishConfig.access` es `public`. Para probar la versión con una instalación real antes, usa `npm pack` e instala el `.tgz` generado en un proyecto de prueba.

5. **Haz commit y etiqueta** la versión:

   ```bash
   git commit -am "chore: release 0.3.0"
   git tag v0.3.0
   git push && git push --tags
   ```

6. **Publica una release en GitHub** desde la etiqueta con las notas del changelog y vuelve a desplegar la documentación.

### Versiones previas

Publica las betas con una dist-tag para que `npm install materix-ui` siga instalando la versión estable:

```bash
npm version 0.3.0-beta.1 --no-git-tag-version
npm publish --tag next
```

### Corregir una publicación defectuosa

npm no permite volver a publicar una versión. Publica un `PATCH` nuevo con la corrección y, si hace falta, depreca la defectuosa:

```bash
npm deprecate materix-ui@0.3.0 "Broken build, use 0.3.1"
```
