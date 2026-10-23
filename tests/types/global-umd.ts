// Uso del global UMD sin imports (script clásico).
/// <reference path="../../types/index.d.ts" />
// En un proyecto consumidor: /// <reference types="@rubenchodev/materix-ui" />
const umdButton = new Materix.Button(document.createElement('button'));
umdButton.enable();
Materix.initAll();
Materix.snackbar.show('From UMD');
