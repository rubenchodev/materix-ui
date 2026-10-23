---
title: "Publishing and versioning"
description: "SemVer versioning, changelog, the package contents and the exact steps to release Materix UI to npm with prepublishOnly checks and Git tags."
weight: 10
---

## SemVer versioning

Materix UI follows **Semantic Versioning (SemVer)** with the `MAJOR.MINOR.PATCH` format.

* **MAJOR**: changes that are incompatible with the public API (breaking changes).
* **MINOR**: new backward-compatible features.
* **PATCH**: backward-compatible bug fixes.

The public API is everything a consumer can rely on: `data-mtx` names and `data-*` attributes, BEM classes, design tokens (`--mtx-*`), the JavaScript API (`Materix.*`, component methods), the `mtx:*` event names and their `detail`, the `exports` paths of the package and the TypeScript types.

### Rules for 0.x

* Before `1.0.0`, a `MINOR` release may contain breaking changes. Each one is listed in `CHANGELOG.md` and explained in `MIGRATION.md` (how to detect it and how to migrate, with before/after snippets).
* Renamed events keep emitting the old name as a deprecated alias until `1.0.0`.
* A component is **not** considered stable until it has an implementation, a working example, bilingual documentation and tests.

### Commits

Semantic prefixes make it easy to write the changelog:

```text
feat: add Slider component
fix: fix TextField focus
docs: update Button documentation
refactor: simplify the component registry
```

## What the package contains

`package.json` publishes only `dist/`, `types/`, `README.md`, `LICENSE`, `CHANGELOG.md` and `MIGRATION.md` (field `files`). Examples, documentation, templates and tests are not published.

| Field | Value |
|---|---|
| `main` | `dist/materix.umd.cjs` (CommonJS) |
| `module` | `dist/materix.es.js` |
| `types` | `types/index.d.ts` |
| `style` | `dist/materix.min.css` |
| `unpkg` / `jsdelivr` | `dist/materix.umd.js` (the default file of `https://cdn.jsdelivr.net/npm/materix-ui`) |
| `exports` | `.`, `./core`, `./components/*`, `./components/*.css`, `./base.css`, `./utilities.css`, `./materix.min.css`, `./dist/*` |
| `sideEffects` | CSS files and `dist/**/*.js` (the modules register components when imported) |

`npm run build` runs three steps: the full bundle (`vite build`), the per-component modules (`vite build -c vite.modules.config.js`) and the TypeScript declarations (`node scripts/gen-types.mjs`, which writes `types/lib` and `types/components` from the JSDoc in `src/`). The files written by hand, `types/index.d.ts`, `types/core.d.ts` and `types/events.d.ts`, refine that base; `npm run types:check` compiles `tests/types/*.ts` against them.

## Release steps

The package is published from the root of the [materix-ui repository](https://github.com/rubenchodev/materix-ui).

1. **Update the changelog.** Move the entries of `## [Unreleased]` in `CHANGELOG.md` to a new `## [x.y.z] - YYYY-MM-DD` section (Added / Changed / Deprecated / Removed / Fixed). If there are breaking changes, update `MIGRATION.md`.
2. **Bump the version** in `package.json` and in `docs/hugo.toml` (`params.version`, shown in the docs and used by the playground CDN links). Use `npm version` without a tag, so the commit and tag are created only after a successful publish (step 5):

   ```bash
   npm version 0.3.0 --no-git-tag-version
   ```

3. **Check the package contents** (it runs no scripts):

   ```bash
   npm run build
   npm pack --dry-run
   ```

   The list must contain only `dist/`, `types/`, the README, LICENSE, CHANGELOG and MIGRATION files.

4. **Log in and publish.** `prepublishOnly` runs `npm run build`, `npm test` and `npm run types:check`; if any of them fails, nothing is published.

   ```bash
   npm login
   npm publish
   ```

   `publishConfig.access` is `public`. To try the release from a real install first, use `npm pack` and install the generated `.tgz` in a test project.

5. **Commit and tag** the release:

   ```bash
   git commit -am "chore: release 0.3.0"
   git tag v0.3.0
   git push && git push --tags
   ```

6. **Publish a GitHub release** from the tag with the changelog notes, and redeploy the documentation.

### Prereleases

Publish betas under a dist-tag so `npm install materix-ui` keeps installing the stable version:

```bash
npm version 0.3.0-beta.1 --no-git-tag-version
npm publish --tag next
```

### Fixing a bad release

npm does not allow republishing a version. Publish a new `PATCH` with the fix and, if needed, deprecate the faulty one:

```bash
npm deprecate materix-ui@0.3.0 "Broken build, use 0.3.1"
```
