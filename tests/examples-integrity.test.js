import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/index.js';

describe('Examples Integrity & Full Component Auto-Initialization Suite', () => {
  const examplesDir = path.resolve(__dirname, '../examples');
  const exampleFolders = fs.readdirSync(examplesDir).filter((file) => {
    const fullPath = path.join(examplesDir, file);
    return fs.statSync(fullPath).isDirectory() && file !== 'shared';
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps the catalog (examples/index.html) in sync with the example folders and its counters', () => {
    const html = fs.readFileSync(path.join(examplesDir, 'index.html'), 'utf-8');
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const cards = [...doc.querySelectorAll('a.demo-card')].map((a) => a.getAttribute('href').split('/')[0]);
    const pages = exampleFolders.filter((f) => fs.existsSync(path.join(examplesDir, f, 'index.html')));

    expect([...cards].sort()).toEqual([...pages].sort());
    doc.querySelectorAll('section.demo-section').forEach((section) => {
      const counter = Number(section.querySelector('.demo-section__count').textContent);
      expect(counter, section.id).toBe(section.querySelectorAll('a.demo-card').length);
    });
    const leadCount = Number(doc.querySelector('.demo-lead').textContent.match(/\d+/)[0]);
    expect(leadCount).toBe(cards.filter((slug) => slug !== 'utilities').length);
  });

  exampleFolders.forEach((folder) => {
    it(`initializes all components in example: ${folder} without errors`, () => {
      const indexPath = path.join(examplesDir, folder, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      const html = fs.readFileSync(indexPath, 'utf-8');
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const content = bodyMatch ? bodyMatch[1] : html;

      // Montar HTML del ejemplo en JSDOM
      document.body.innerHTML = content;

      // Desactivar scripts embebidos en el template para no disparar llamadas de navegador
      document.body.querySelectorAll('script').forEach((s) => s.remove());

      // Debe inicializar limpiamente sin lanzar excepciones
      expect(() => initAll(document.body)).not.toThrow();

      // Verificar que los elementos declarativos data-mtx se inicialicen
      const mtxElements = document.body.querySelectorAll('[data-mtx]');
      expect(mtxElements.length).toBeGreaterThan(0);

      mtxElements.forEach((el) => {
        expect(el.hasAttribute('data-mtx-initialized')).toBe(true);
      });
    });
  });
});
