import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { initAll } from '../src/core/registry.js';
import '../src/index.js';

describe('Templates Integrity & Full Component Auto-Initialization Suite', () => {
  const templatesDir = path.resolve(__dirname, '../templates');
  const templateFolders = fs.existsSync(templatesDir)
    ? fs.readdirSync(templatesDir).filter((file) => {
      const fullPath = path.join(templatesDir, file);
      return fs.statSync(fullPath).isDirectory()
        && file !== 'shared'
        && fs.existsSync(path.join(fullPath, 'index.html'));
    })
    : [];

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('has at least one template', () => {
    expect(templateFolders.length).toBeGreaterThan(0);
  });

  templateFolders.forEach((folder) => {
    it(`initializes all components in template: ${folder} without errors`, () => {
      const html = fs.readFileSync(path.join(templatesDir, folder, 'index.html'), 'utf-8');
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

      // Montar el cuerpo de la plantilla en JSDOM sin ejecutar sus scripts
      document.body.innerHTML = bodyMatch ? bodyMatch[1] : html;
      document.body.querySelectorAll('script').forEach((s) => s.remove());

      expect(() => initAll(document.body)).not.toThrow();

      const mtxElements = document.body.querySelectorAll('[data-mtx]');
      expect(mtxElements.length).toBeGreaterThan(0);

      const uninitialized = Array.from(mtxElements)
        .filter((el) => !el.hasAttribute('data-mtx-initialized'))
        .map((el) => `${el.tagName.toLowerCase()}[data-mtx="${el.getAttribute('data-mtx')}"]`);
      expect(uninitialized).toEqual([]);
    });

    it(`template ${folder} declares lang="en", the theme script and the theme toggle`, () => {
      const html = fs.readFileSync(path.join(templatesDir, folder, 'index.html'), 'utf-8');
      expect(html).toMatch(/<html lang="en"[\s>]/);
      expect(html).toContain('../shared/template.js');
      // `data-mtx-theme-toggle` (API de la librería); `data-tpl-theme-toggle` se acepta como alias heredado.
      expect(html).toMatch(/data-(mtx|tpl)-theme-toggle/);
    });
  });
});
