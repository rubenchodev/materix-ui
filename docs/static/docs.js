/* ==========================================================================
   Materix UI — Sitio de documentación (Hugo)
   Tema, navegación móvil, búsqueda de texto completo, TOC activo, demos,
   copiar código, playground (CodePen/StackBlitz) y volver arriba.
   Vanilla, sin dependencias.
   ========================================================================== */

(function () {
  'use strict';

  var THEME_KEY = 'mtx-doc-theme';
  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Textos de interfaz por defecto (inglés); el layout inyecta los del idioma en #doc-i18n. */
  var UI = {
    copied: 'Copied',
    copyFailed: 'Could not copy',
    copyCode: 'Copy code',
    showCode: 'Show code',
    hideCode: 'Hide code',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    navOpen: 'Open navigation',
    navClose: 'Close navigation',
    table: 'Table',
    codeExample: 'Code example',
    noResults: 'No results',
    oneResult: '1 result',
    nResults: '{n} results',
    searchError: 'The search index could not be loaded.',
    searchInPage: 'Section',
    playgroundTitle: 'Materix UI demo'
  };
  (function loadUiStrings() {
    var el = document.getElementById('doc-i18n');
    if (!el) return;
    try {
      var data = JSON.parse(el.textContent) || {};
      Object.keys(data).forEach(function (key) { if (data[key]) UI[key] = data[key]; });
    } catch (e) { /* textos por defecto */ }
  })();

  /* ------------------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------------------ */

  /**
   * Lee un valor de localStorage sin lanzar errores.
   * @param {string} key Clave.
   * @returns {string|null} Valor guardado o null.
   */
  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  /**
   * Guarda un valor en localStorage sin lanzar errores.
   * @param {string} key Clave.
   * @param {string} value Valor.
   */
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* almacenamiento no disponible */ }
  }

  /**
   * Copia texto al portapapeles con respaldo para contextos no seguros.
   * @param {string} text Texto a copiar.
   * @returns {Promise<void>} Se resuelve al copiar.
   */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  /**
   * Muestra la confirmación "Copiado" en un botón y en una región aria-live.
   * @param {HTMLElement} button Botón pulsado.
   * @param {HTMLElement|null} status Región de estado (opcional).
   * @param {boolean} ok Resultado de la copia.
   */
  function flashCopied(button, status, ok) {
    var icon = button.querySelector('.material-icons');
    var label = button.getAttribute('aria-label');
    if (icon) icon.textContent = ok ? 'check' : 'error_outline';
    button.classList.toggle('is-success', ok);
    if (status) status.textContent = ok ? UI.copied : UI.copyFailed;
    clearTimeout(button._docTimer);
    button._docTimer = setTimeout(function () {
      if (icon) icon.textContent = 'content_copy';
      button.classList.remove('is-success');
      button.setAttribute('aria-label', label);
      if (status) status.textContent = '';
    }, 1800);
  }

  /**
   * Obtiene el texto limpio de un bloque resaltado (ignora números de línea).
   * @param {HTMLElement} container Contenedor con un <pre>.
   * @returns {string} Código fuente.
   */
  function getCodeText(container) {
    var cell = container.querySelector('.lntd:last-child code');
    var code = cell || container.querySelector('pre code') || container.querySelector('pre');
    return code ? code.textContent.replace(/\n+$/, '') : '';
  }

  /* ------------------------------------------------------------------------
     Tema claro/oscuro
     ------------------------------------------------------------------------ */

  /**
   * Aplica el tema y sincroniza el botón.
   * @param {'light'|'dark'} theme Tema a aplicar.
   */
  function applyTheme(theme) {
    root.setAttribute('data-mtx-theme', theme);
    var button = document.querySelector('[data-doc-theme]');
    if (button) {
      button.setAttribute('aria-label', theme === 'dark' ? UI.themeToLight : UI.themeToDark);
    }
  }

  /** Inicializa el botón de tema y el seguimiento de prefers-color-scheme. */
  function initTheme() {
    var media = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(root.getAttribute('data-mtx-theme') === 'dark' ? 'dark' : 'light');

    var button = document.querySelector('[data-doc-theme]');
    if (button) {
      button.addEventListener('click', function () {
        var next = root.getAttribute('data-mtx-theme') === 'dark' ? 'light' : 'dark';
        storageSet(THEME_KEY, next);
        applyTheme(next);
      });
    }

    var onChange = function (event) {
      if (!storageGet(THEME_KEY)) applyTheme(event.matches ? 'dark' : 'light');
    };
    if (media.addEventListener) media.addEventListener('change', onChange);
  }

  /* ------------------------------------------------------------------------
     Drawer de navegación (móvil y home)
     ------------------------------------------------------------------------ */

  /** Inicializa el sidebar como drawer con backdrop, Escape y retorno de foco. */
  function initDrawer() {
    var toggle = document.querySelector('[data-doc-menu]');
    var sidebar = document.getElementById('doc-sidebar');
    var backdrop = document.querySelector('[data-doc-backdrop]');
    if (!toggle || !sidebar || !backdrop) return;

    var isDrawerMode = function () {
      return window.getComputedStyle(toggle).display !== 'none';
    };

    var close = function (restoreFocus) {
      if (!sidebar.classList.contains('is-open')) return;
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-visible');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', UI.navOpen);
      document.body.style.overflow = '';
      var hide = function () { if (!sidebar.classList.contains('is-open')) backdrop.hidden = true; };
      reducedMotion.matches ? hide() : setTimeout(hide, 250);
      if (restoreFocus) toggle.focus();
    };

    var open = function () {
      backdrop.hidden = false;
      // Forzar reflow para que la transición de opacidad se aplique.
      void backdrop.offsetWidth;
      sidebar.classList.add('is-open');
      backdrop.classList.add('is-visible');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', UI.navClose);
      document.body.style.overflow = 'hidden';
      var current = sidebar.querySelector('[aria-current="page"]') || sidebar.querySelector('a');
      if (current) current.focus();
    };

    toggle.addEventListener('click', function () {
      sidebar.classList.contains('is-open') ? close(true) : open();
    });
    backdrop.addEventListener('click', function () { close(true); });
    // Escape cierra y Tab queda atrapado en el drawer abierto (patrón modal).
    document.addEventListener('keydown', function (event) {
      if (!sidebar.classList.contains('is-open') || !isDrawerMode()) return;
      if (event.key === 'Escape') { close(true); return; }
      if (event.key !== 'Tab') return;
      var focusables = Array.prototype.filter.call(
        sidebar.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        function (el) { return el.offsetParent !== null; }
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var inside = sidebar.contains(document.activeElement);
      if (!inside) { event.preventDefault(); first.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    sidebar.addEventListener('click', function (event) {
      if (event.target.closest('a') && isDrawerMode()) close(false);
    });
    window.addEventListener('resize', function () {
      if (!isDrawerMode()) close(false);
    });

    // Mantener visible el enlace activo dentro del sidebar.
    var active = sidebar.querySelector('[aria-current="page"]');
    if (active && !isDrawerMode()) {
      var top = active.offsetTop - sidebar.clientHeight / 2;
      if (top > 0) sidebar.scrollTop = top;
    }
  }

  /* ------------------------------------------------------------------------
     Demos y bloques de código
     ------------------------------------------------------------------------ */

  /** Activa los botones "Mostrar código" y "Copiar" de cada mtx-demo. */
  function initDemos() {
    document.querySelectorAll('[data-doc-code-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var panel = document.getElementById(button.getAttribute('aria-controls'));
        if (!panel) return;
        var expanded = button.getAttribute('aria-expanded') === 'true';
        var label = expanded ? UI.showCode : UI.hideCode;
        panel.hidden = expanded;
        button.setAttribute('aria-expanded', String(!expanded));
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
      });
    });

    document.querySelectorAll('[data-doc-copy]').forEach(function (button) {
      button.addEventListener('click', function () {
        var panel = document.getElementById(button.getAttribute('aria-controls'));
        var demo = button.closest('.doc-demo');
        var status = demo ? demo.querySelector('.doc-demo-status') : null;
        var text = panel ? getCodeText(panel) : '';
        if (!text) return;
        copyText(text).then(
          function () { flashCopied(button, status, true); },
          function () { flashCopied(button, status, false); }
        );
      });
    });

    document.querySelectorAll('[data-doc-copy-text]').forEach(function (button) {
      var status = document.createElement('span');
      status.className = 'doc-visually-hidden';
      status.setAttribute('role', 'status');
      button.after(status);
      button.addEventListener('click', function () {
        copyText(button.getAttribute('data-doc-copy-text')).then(
          function () { flashCopied(button, status, true); },
          function () { flashCopied(button, status, false); }
        );
      });
    });
  }

  /** Añade un botón "Copiar" a los bloques de código fuera de las demos. */
  function initCodeBlocks() {
    var blocks = document.querySelectorAll('.doc-content .highlight, .doc-install .highlight, .doc-content pre:not(.chroma)');
    blocks.forEach(function (block) {
      // Las demos y el generador de tema tienen sus propios botones de copiar.
      if (block.closest('.doc-demo, .doc-tb') || block.closest('.highlight') !== block && block.closest('.highlight')) return;
      if (block.tagName === 'PRE') {
        var wrap = document.createElement('div');
        wrap.className = 'doc-code-block';
        block.parentNode.insertBefore(wrap, block);
        wrap.appendChild(block);
        block = wrap;
      }
      var status = document.createElement('span');
      status.className = 'doc-visually-hidden';
      status.setAttribute('role', 'status');
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'doc-icon-btn doc-icon-btn--small doc-copy-btn';
      button.setAttribute('aria-label', UI.copyCode);
      button.setAttribute('title', UI.copyCode);
      button.innerHTML = '<span class="material-icons" aria-hidden="true">content_copy</span>';
      button.addEventListener('click', function () {
        copyText(getCodeText(block)).then(
          function () { flashCopied(button, status, true); },
          function () { flashCopied(button, status, false); }
        );
      });
      block.appendChild(button);
      block.appendChild(status);
    });
  }

  /** Hace enfocables los bloques de código (scroll horizontal) para recorrerlos con teclado (WCAG 2.1.1). */
  function initScrollableCode() {
    document.querySelectorAll('.doc-body pre').forEach(function (pre) {
      if (pre.closest('.doc-demo-stage')) return;
      if (!pre.hasAttribute('tabindex')) pre.setAttribute('tabindex', '0');
      if (!pre.hasAttribute('role')) pre.setAttribute('role', 'region');
      if (!pre.hasAttribute('aria-label') && !pre.hasAttribute('aria-labelledby')) {
        pre.setAttribute('aria-label', UI.codeExample);
      }
    });
  }

  /** Envuelve las tablas del contenido para permitir scroll horizontal en móvil. */
  function initTables() {
    document.querySelectorAll('.doc-content table').forEach(function (table) {
      if (table.closest('.doc-demo') || table.parentElement.classList.contains('doc-table-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'doc-table-wrap';
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('tabindex', '0');
      var heading = table.closest('.doc-content') ? findPreviousHeading(table) : null;
      wrap.setAttribute('aria-label', heading ? UI.table + ': ' + heading : UI.table);
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  /**
   * Busca el texto del encabezado anterior a un elemento.
   * @param {HTMLElement} el Elemento de referencia.
   * @returns {string|null} Texto del encabezado.
   */
  function findPreviousHeading(el) {
    var node = el.previousElementSibling;
    while (node) {
      if (/^H[2-4]$/.test(node.tagName)) return node.textContent.replace(/#$/, '').trim();
      node = node.previousElementSibling;
    }
    return null;
  }

  /* ------------------------------------------------------------------------
     TOC activo
     ------------------------------------------------------------------------ */

  /** Resalta en "En esta página" la sección visible con IntersectionObserver. */
  function initToc() {
    var toc = document.querySelector('.doc-toc');
    if (!toc || !('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var map = new Map();
    links.forEach(function (link) {
      var id = decodeURIComponent(link.getAttribute('href').slice(1));
      var heading = document.getElementById(id);
      if (heading) map.set(heading, link);
    });
    if (!map.size) return;

    var headings = Array.from(map.keys());
    var visible = new Set();

    var setActive = function (link) {
      links.forEach(function (l) {
        var on = l === link;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
      });
    };

    var update = function () {
      var current = null;
      // La primera sección visible; si ninguna, la última que quedó por encima.
      for (var i = 0; i < headings.length; i++) {
        if (visible.has(headings[i])) { current = headings[i]; break; }
      }
      if (!current) {
        for (var j = headings.length - 1; j >= 0; j--) {
          if (headings[j].getBoundingClientRect().top < 120) { current = headings[j]; break; }
        }
      }
      setActive(current ? map.get(current) : null);
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target);
      });
      update();
    }, { rootMargin: '-72px 0px -60% 0px', threshold: 0 });

    headings.forEach(function (h) { observer.observe(h); });
  }

  /* ------------------------------------------------------------------------
     Búsqueda de texto completo
     ------------------------------------------------------------------------ */

  /** Máximo de páginas y de secciones por página mostradas en los resultados. */
  var SEARCH_MAX_PAGES = 25;
  var SEARCH_MAX_SECTIONS = 4;

  /**
   * Normaliza texto para búsqueda (minúsculas y sin tildes). Conserva la longitud del texto NFC.
   * @param {string} text Texto original.
   * @returns {string} Texto normalizado.
   */
  function normalize(text) {
    return String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  /**
   * Escapa HTML para insertar texto de forma segura.
   * @param {string} text Texto.
   * @returns {string} Texto escapado.
   */
  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /**
   * Calcula los rangos [inicio, fin) de todas las apariciones de los términos, fusionados.
   * @param {string} text Texto original.
   * @param {string[]} terms Términos normalizados.
   * @returns {number[][]} Rangos ordenados.
   */
  function matchRanges(text, terms) {
    var norm = normalize(text);
    var ranges = [];
    terms.forEach(function (term) {
      if (!term) return;
      var from = 0;
      var i;
      while ((i = norm.indexOf(term, from)) !== -1) {
        ranges.push([i, i + term.length]);
        from = i + term.length;
      }
    });
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    ranges.forEach(function (r) {
      var last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push(r.slice());
    });
    return merged;
  }

  /**
   * Resalta todas las coincidencias de los términos dentro de un texto.
   * @param {string} text Texto original.
   * @param {string[]} terms Términos normalizados.
   * @returns {string} HTML con <mark>.
   */
  function highlight(text, terms) {
    text = String(text || '');
    if (!terms || !terms.length) return escapeHtml(text);
    var html = '';
    var pos = 0;
    matchRanges(text, terms).forEach(function (r) {
      html += escapeHtml(text.slice(pos, r[0])) + '<mark>' + escapeHtml(text.slice(r[0], r[1])) + '</mark>';
      pos = r[1];
    });
    return html + escapeHtml(text.slice(pos));
  }

  /**
   * Extrae un fragmento del texto alrededor de la primera coincidencia.
   * @param {string} text Texto completo de la sección.
   * @param {string[]} terms Términos normalizados.
   * @returns {string} Fragmento con elipsis.
   */
  function snippet(text, terms) {
    var norm = normalize(text);
    var first = -1;
    terms.forEach(function (t) {
      var i = norm.indexOf(t);
      if (i !== -1 && (first === -1 || i < first)) first = i;
    });
    if (first === -1) return text.slice(0, 140);
    var start = Math.max(0, first - 40);
    var end = Math.min(text.length, first + 120);
    // Ajusta a límites de palabra para no cortar a mitad.
    if (start > 0) { var sp = text.indexOf(' ', start); if (sp !== -1 && sp < first) start = sp + 1; }
    return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
  }

  /**
   * Comprueba que todos los términos aparezcan en un texto normalizado.
   * @param {string} hay Texto normalizado.
   * @param {string[]} terms Términos.
   * @returns {boolean} true si están todos.
   */
  function hasAll(hay, terms) {
    for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) === -1) return false;
    return true;
  }

  /**
   * Prepara el índice descargado (campos normalizados para buscar).
   * @param {Object[]} pages Páginas del índice.
   * @returns {Object[]} Mismo arreglo enriquecido.
   */
  function prepareIndex(pages) {
    pages.forEach(function (p, order) {
      p._order = order;
      p._t = normalize(p.t);
      p._page = normalize([p.t, p.d, p.g].join(' '));
      (p.s || []).forEach(function (s) {
        s._h = normalize(s.h);
        s._x = normalize(s.x);
      });
    });
    return pages;
  }

  /**
   * Busca en el índice con ranking título > encabezado > descripción > contenido.
   * @param {Object[]} pages Índice preparado.
   * @param {string[]} terms Términos normalizados.
   * @param {string} query Consulta normalizada completa.
   * @returns {Object[]} [{page, score, pageMatch, sections:[{section, score}]}] ordenado.
   */
  function searchIndex(pages, terms, query) {
    var out = [];
    pages.forEach(function (p) {
      var best = Infinity;
      var pageMatch = false;
      if (hasAll(p._t, terms)) {
        pageMatch = true;
        best = p._t === query ? 0 : p._t.indexOf(query) === 0 ? 1 : 2;
      } else if (hasAll(p._page, terms)) {
        pageMatch = true;
        best = 4;
      }
      var sections = [];
      (p.s || []).forEach(function (s) {
        // El título de la página cuenta para completar términos (p. ej. "table sort").
        if (!hasAll(s._h + ' ' + s._x + ' ' + p._t, terms)) return;
        var inHeading = s._h && terms.some(function (t) { return s._h.indexOf(t) !== -1; }) &&
          hasAll(s._h + ' ' + p._t, terms);
        var score = inHeading ? 3 : 5;
        sections.push({ section: s, score: score });
        if (score < best) best = score;
      });
      if (!pageMatch && !sections.length) return;
      // Encabezados primero; dentro de cada nivel, el orden del documento.
      sections.sort(function (a, b) { return a.score - b.score; });
      out.push({ page: p, score: best, pageMatch: pageMatch, sections: sections.slice(0, SEARCH_MAX_SECTIONS) });
    });
    out.sort(function (a, b) { return a.score - b.score || a.page._order - b.page._order; });
    return out.slice(0, SEARCH_MAX_PAGES);
  }

  /** Inicializa el diálogo de búsqueda (Ctrl/Cmd+K, "/", flechas, Enter, Escape) con índice bajo demanda. */
  function initSearch() {
    var dialog = document.querySelector('[data-doc-search]');
    var input = document.querySelector('[data-doc-search-input]');
    var list = document.querySelector('[data-doc-search-results]');
    var empty = document.querySelector('[data-doc-search-empty]');
    var loading = document.querySelector('[data-doc-search-loading]');
    var status = document.querySelector('[data-doc-search-status]');
    if (!dialog || !input || !list) return;
    var src = dialog.getAttribute('data-doc-search-src');

    var index = null;
    var loadPromise = null;
    var loadFailed = false;
    var options = [];
    var activeIndex = -1;
    var lastFocus = null;

    /**
     * Descarga el índice del idioma una sola vez.
     * @returns {Promise<Object[]>} Índice preparado.
     */
    var loadIndex = function () {
      if (loadPromise) return loadPromise;
      if (!src || !window.fetch) { loadFailed = true; return Promise.resolve([]); }
      loadPromise = fetch(src, { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (data) { index = prepareIndex(Array.isArray(data) ? data : []); loadFailed = false; return index; })
        .catch(function (e) {
          console.warn('[docs] search index', e);
          loadFailed = true;
          loadPromise = null; // permite reintentar al volver a abrir
          return [];
        });
      return loadPromise;
    };

    /**
     * Desplaza solo la lista para que la opción quede visible (scrollIntoView movería también el documento).
     * @param {HTMLElement} opt Opción activa.
     */
    var revealOption = function (opt) {
      var top = opt.offsetTop;
      var bottom = top + opt.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top - 8;
      else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 8;
    };

    var setActive = function (i, fromPointer) {
      var els = list.querySelectorAll('[role="option"]');
      if (!els.length) { activeIndex = -1; input.removeAttribute('aria-activedescendant'); return; }
      activeIndex = (i + els.length) % els.length;
      els.forEach(function (opt, n) {
        var on = n === activeIndex;
        opt.classList.toggle('is-active', on);
        opt.setAttribute('aria-selected', String(on));
        if (on) {
          input.setAttribute('aria-activedescendant', opt.id);
          if (!fromPointer) revealOption(opt);
        }
      });
    };

    /**
     * Genera el HTML de una opción.
     * @param {Object} o Opción {url, icon, title, desc, context, nested}.
     * @param {number} i Posición.
     * @returns {string} HTML.
     */
    var optionHtml = function (o, i) {
      return '<li class="doc-search-option' + (o.nested ? ' doc-search-option--nested' : '') + '" role="option" id="doc-search-opt-' + i +
        '" aria-selected="false" data-index="' + i + '">' +
        '<a href="' + escapeHtml(o.url) + '" tabindex="-1">' +
        '<span class="material-icons" aria-hidden="true">' + escapeHtml(o.icon) + '</span>' +
        '<span class="doc-search-option-text">' +
        (o.context ? '<span class="doc-visually-hidden">' + escapeHtml(o.context) + ': </span>' : '') +
        '<span class="doc-search-option-title">' + o.title + '</span>' +
        (o.desc ? '<span class="doc-search-option-desc">' + o.desc + '</span>' : '') +
        '</span></a></li>';
    };

    var render = function () {
      var raw = input.value.trim();
      var query = normalize(raw);
      var terms = query.split(/\s+/).filter(Boolean);
      var html = '';
      options = [];

      if (!index) {
        list.innerHTML = '';
        empty.hidden = true;
        if (loading) {
          loading.hidden = false;
          loading.textContent = loadFailed ? UI.searchError : loading.getAttribute('data-text') || loading.textContent;
        }
        return;
      }
      if (loading) loading.hidden = true;

      if (!terms.length) {
        // Sin consulta: todas las páginas agrupadas por sección.
        var lastGroup = null;
        index.forEach(function (p) {
          if (p.g !== lastGroup) {
            html += '<li class="doc-search-group" role="presentation">' + escapeHtml(p.g) + '</li>';
            lastGroup = p.g;
          }
          var o = { url: p.u, icon: p.i || 'article', title: escapeHtml(p.t), desc: escapeHtml(p.d || '') };
          html += optionHtml(o, options.length);
          options.push(o);
        });
      } else {
        // Con consulta: agrupado por página; dentro, la página y sus secciones coincidentes.
        var q = '?q=' + encodeURIComponent(raw);
        searchIndex(index, terms, query).forEach(function (r) {
          var p = r.page;
          html += '<li class="doc-search-group" role="presentation">' + escapeHtml(p.t) +
            ' <span class="doc-search-group-meta">· ' + escapeHtml(p.g) + '</span></li>';
          if (r.pageMatch || !r.sections.length) {
            var po = { url: p.u, icon: p.i || 'article', title: highlight(p.t, terms), desc: highlight(p.d || '', terms) };
            html += optionHtml(po, options.length);
            options.push(po);
          }
          r.sections.forEach(function (sr) {
            var s = sr.section;
            var hash = s.a ? '#' + encodeURIComponent(s.a) : '';
            var so = {
              url: p.u + q + hash,
              icon: sr.score === 3 ? 'tag' : 'subject',
              title: highlight(s.h || p.t, terms),
              desc: s.x ? highlight(snippet(s.x, terms), terms) : '',
              context: p.t,
              nested: true
            };
            html += optionHtml(so, options.length);
            options.push(so);
          });
        });
      }

      list.innerHTML = html;
      empty.hidden = options.length > 0;
      status.textContent = !options.length ? UI.noResults
        : options.length === 1 ? UI.oneResult : UI.nResults.replace('{n}', String(options.length));
      setActive(0);
    };

    var open = function () {
      if (!dialog.hidden) return;
      lastFocus = document.activeElement;
      dialog.hidden = false;
      document.body.style.overflow = 'hidden';
      input.value = '';
      render();
      list.scrollTop = 0;
      input.focus({ preventScroll: true });
      if (!index) {
        loadIndex().then(function () { if (!dialog.hidden) render(); });
      }
    };

    var close = function () {
      if (dialog.hidden) return;
      dialog.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    };

    var go = function () {
      var o = options[activeIndex];
      if (o) window.location.href = o.url;
    };

    if (loading) loading.setAttribute('data-text', loading.textContent);
    document.querySelectorAll('[data-doc-search-open]').forEach(function (b) {
      b.addEventListener('click', open);
      // Precarga al acercarse al botón para que el primer resultado sea instantáneo.
      b.addEventListener('pointerenter', loadIndex, { once: true });
      b.addEventListener('focus', loadIndex, { once: true });
    });
    dialog.querySelectorAll('[data-doc-search-close]').forEach(function (b) { b.addEventListener('click', close); });
    input.addEventListener('input', render);

    // Navegar a una sección de la misma página: cerrar el diálogo y aplicar el resaltado sin recargar.
    list.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link) return;
      var url = new URL(link.href, window.location.href);
      if (url.pathname === window.location.pathname) {
        event.preventDefault();
        close();
        highlightSearchHits(url.searchParams.get('q'), url.hash);
      }
    });

    list.addEventListener('mousemove', function (event) {
      var opt = event.target.closest('[role="option"]');
      if (opt && Number(opt.dataset.index) !== activeIndex) setActive(Number(opt.dataset.index), true);
    });

    dialog.addEventListener('keydown', function (event) {
      switch (event.key) {
        case 'ArrowDown': event.preventDefault(); setActive(activeIndex + 1); break;
        case 'ArrowUp': event.preventDefault(); setActive(activeIndex - 1); break;
        case 'Enter':
          if (event.target === input) {
            event.preventDefault();
            var o = options[activeIndex];
            var link = o ? list.querySelector('#doc-search-opt-' + activeIndex + ' a') : null;
            if (link) link.click(); else go();
          }
          break;
        case 'Escape': event.preventDefault(); close(); break;
        case 'Tab': {
          // Trampa de foco: el diálogo solo contiene el campo y el botón Esc.
          var focusables = dialog.querySelectorAll('input, button');
          var first = focusables[0];
          var last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          break;
        }
        default: break;
      }
    });

    document.addEventListener('keydown', function (event) {
      var key = event.key ? event.key.toLowerCase() : '';
      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault();
        dialog.hidden ? open() : close();
        return;
      }
      if (key === '/' && dialog.hidden) {
        var t = event.target;
        var editable = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
        if (!editable) { event.preventDefault(); open(); }
      }
    });

    // Mostrar el atajo correcto en macOS.
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
      document.querySelectorAll('.doc-search-btn .doc-kbd').forEach(function (k) { k.textContent = '⌘ K'; });
    }
  }

  /**
   * Resalta en la página los términos buscados dentro de la sección de destino y la muestra.
   * @param {string|null} raw Consulta original (parámetro ?q=).
   * @param {string} hash Ancla de la sección (#id) o cadena vacía.
   */
  function highlightSearchHits(raw, hash) {
    var content = document.querySelector('.doc-content');
    if (!content || !raw) return;
    var terms = normalize(raw.trim()).split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!terms.length) return;

    // Limpia un resaltado anterior.
    content.querySelectorAll('mark.doc-search-hit').forEach(function (m) {
      m.replaceWith(document.createTextNode(m.textContent));
    });
    content.normalize();

    // Ámbito: desde el encabezado del ancla hasta el siguiente H2/H3 del contenido.
    var range = document.createRange();
    range.selectNodeContents(content);
    var id = hash ? decodeURIComponent(hash.replace(/^#/, '')) : '';
    var heading = id ? document.getElementById(id) : null;
    if (heading && content.contains(heading)) {
      range.setStartAfter(heading);
      var headings = Array.prototype.filter.call(content.querySelectorAll('h2[id], h3[id]'), function (h) {
        return h.querySelector('.doc-anchor');
      });
      var next = headings[headings.indexOf(heading) + 1];
      if (next) range.setEndBefore(next);
    } else if (id) {
      heading = null;
    }

    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue.trim() || !range.intersectsNode(node)) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        // No se tocan demos vivas, código, scripts ni anclas de encabezado.
        if (!parent || parent.closest('script, style, .doc-demo, pre, .doc-anchor, mark')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode() && nodes.length < 400) nodes.push(walker.currentNode);

    var marks = [];
    nodes.forEach(function (node) {
      if (marks.length >= 60) return;
      var text = node.nodeValue;
      var ranges = matchRanges(text, terms);
      if (!ranges.length) return;
      var frag = document.createDocumentFragment();
      var pos = 0;
      ranges.forEach(function (r) {
        frag.appendChild(document.createTextNode(text.slice(pos, r[0])));
        var mark = document.createElement('mark');
        mark.className = 'doc-search-hit';
        mark.textContent = text.slice(r[0], r[1]);
        frag.appendChild(mark);
        marks.push(mark);
        pos = r[1];
      });
      frag.appendChild(document.createTextNode(text.slice(pos)));
      node.parentNode.replaceChild(frag, node);
    });

    var behavior = reducedMotion.matches ? 'auto' : 'smooth';
    var target = marks[0] || heading;
    if (target) {
      var rect = target.getBoundingClientRect();
      var visible = rect.top >= 72 && rect.bottom <= window.innerHeight;
      // Con encabezado, mostrarlo arriba salvo que la coincidencia quede fuera de la vista.
      if (heading && marks[0]) {
        heading.scrollIntoView({ block: 'start', behavior: behavior });
        var mr = marks[0].getBoundingClientRect();
        if (mr.bottom > window.innerHeight) marks[0].scrollIntoView({ block: 'center', behavior: behavior });
      } else if (!visible) {
        target.scrollIntoView({ block: 'center', behavior: behavior });
      }
    }
    if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    // Quita ?q= de la URL conservando el ancla.
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + (id ? '#' + encodeURIComponent(id) : window.location.hash));
    }
  }

  /** Aplica el resaltado si la página se abrió desde la búsqueda (?q=término#seccion). */
  function initSearchHits() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) highlightSearchHits(q, window.location.hash);
  }

  /* ------------------------------------------------------------------------
     Playground: abrir una demo en CodePen o StackBlitz
     ------------------------------------------------------------------------ */

  /** Configuración del sitio (#doc-config): base de dist/, versión y fuentes. */
  var CONFIG = { version: 'latest', cdnBase: '', useLocal: false, localBase: '/dist/', fonts: [] };
  (function loadConfig() {
    var el = document.getElementById('doc-config');
    if (!el) return;
    try { Object.assign(CONFIG, JSON.parse(el.textContent) || {}); } catch (e) { /* valores por defecto */ }
  })();

  /**
   * Base absoluta de dist/ para el proyecto generado.
   * @returns {string} URL terminada en "/".
   */
  function playgroundBase() {
    var base = CONFIG.useLocal || !CONFIG.cdnBase ? new URL(CONFIG.localBase || '/dist/', window.location.href).href : CONFIG.cdnBase;
    return /\/$/.test(base) ? base : base + '/';
  }

  /**
   * Obtiene los <script> en línea de la página que acompañan a una demo: los indicados con
   * data-doc-demo-script o, si no hay, los que referencian algún id definido en la demo.
   * @param {HTMLElement} demo Contenedor .doc-demo.
   * @param {string} html Código fuente de la demo.
   * @returns {string} Código JavaScript (puede estar vacío).
   */
  function demoScripts(demo, html) {
    var explicit = demo.getAttribute('data-doc-demo-script');
    var scripts = [];
    if (explicit) {
      explicit.split(',').forEach(function (sel) {
        try {
          document.querySelectorAll(sel.trim()).forEach(function (s) { if (scripts.indexOf(s) === -1) scripts.push(s); });
        } catch (e) { console.warn('[docs] mtx-demo script: selector no válido', sel); }
      });
    } else {
      var tpl = document.createElement('template');
      tpl.innerHTML = html;
      var ids = Array.prototype.map.call(tpl.content.querySelectorAll('[id]'), function (el) { return el.id; });
      if (ids.length) {
        document.querySelectorAll('.doc-content script:not([src])').forEach(function (s) {
          if (s.type && !/javascript|^module$/i.test(s.type)) return;
          if (s.closest('.doc-demo-stage')) return;
          var code = s.textContent;
          var uses = ids.some(function (id) {
            var esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp('[\'"#]' + esc + '(?![\\w-])').test(code);
          });
          if (uses) scripts.push(s);
        });
      }
    }
    return scripts.map(function (s) { return s.textContent.trim(); }).filter(Boolean).join('\n\n');
  }

  /**
   * Construye los datos del proyecto de una demo.
   * @param {HTMLElement} demo Contenedor .doc-demo.
   * @returns {{title: string, html: string, js: string, theme: string, css: string[], script: string, document: string}|null} Proyecto.
   */
  function buildPlayground(demo) {
    var panel = demo.querySelector('.doc-demo-code');
    var html = panel ? getCodeText(panel) : '';
    if (!html) return null;
    var titleEl = demo.querySelector('.doc-demo-title');
    var pageTitle = (document.querySelector('.doc-title') || {}).textContent || document.title;
    var title = (pageTitle.trim() + ' · ' + (titleEl ? titleEl.textContent.trim() : '')).replace(/\s·\s$/, '') + ' — ' + UI.playgroundTitle;
    var base = playgroundBase();
    var theme = root.getAttribute('data-mtx-theme') === 'dark' ? 'dark' : 'light';
    var lang = root.getAttribute('lang') || 'en';
    var css = (CONFIG.fonts || []).concat([base + 'materix.min.css']);
    var script = base + 'materix.umd.js';
    var js = demoScripts(demo, html);
    var doc = '<!DOCTYPE html>\n<html lang="' + escapeHtml(lang) + '" data-mtx-theme="' + theme + '">\n<head>\n' +
      '  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '  <title>' + escapeHtml(title) + '</title>\n' +
      css.map(function (href) { return '  <link rel="stylesheet" href="' + escapeHtml(href) + '">\n'; }).join('') +
      '  <script src="' + escapeHtml(script) + '"><\/script>\n' +
      '  <style>body { padding: 24px; }</style>\n</head>\n<body class="mtx-root">\n' +
      html + '\n' + (js ? '\n<script>\n' + js.replace(/<\/script/gi, '<\\/script') + '\n<\/script>\n' : '') +
      '</body>\n</html>\n';
    return { title: title, html: html, js: js, theme: theme, css: css, script: script, document: doc };
  }

  /**
   * Envía un formulario POST en una pestaña nueva. Emite antes el evento cancelable
   * "doc:playground" en document con {provider, action, fields} (útil para pruebas).
   * @param {string} provider codepen | stackblitz.
   * @param {string} action URL de destino.
   * @param {Object<string,string>} fields Campos del formulario.
   */
  function postForm(provider, action, fields) {
    var event = new CustomEvent('doc:playground', { cancelable: true, detail: { provider: provider, action: action, fields: fields } });
    if (!document.dispatchEvent(event)) return;
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = action;
    form.target = '_blank';
    form.hidden = true;
    Object.keys(fields).forEach(function (name) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = fields[name];
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  /**
   * Abre la demo en CodePen (API "prefill" mediante POST a /pen/define).
   * @param {Object} p Proyecto de buildPlayground().
   */
  function openCodePen(p) {
    // CodePen no permite atributos en <html>: el tema y la clase raíz se aplican desde el JS.
    var setup = "document.documentElement.setAttribute('data-mtx-theme', '" + p.theme + "');\n" +
      "document.body.classList.add('mtx-root');";
    var data = {
      title: p.title,
      html: p.html,
      css: 'body {\n  padding: 24px;\n}\n',
      js: setup + (p.js ? '\n\n' + p.js : '') + '\n',
      css_external: p.css.join(';'),
      js_external: p.script,
      head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      editors: p.js ? '101' : '100',
      layout: 'top'
    };
    postForm('codepen', 'https://codepen.io/pen/define', { data: JSON.stringify(data) });
  }

  /**
   * Abre la demo en StackBlitz (POST a /run con un proyecto de plantilla "html").
   * @param {Object} p Proyecto de buildPlayground().
   */
  function openStackBlitz(p) {
    postForm('stackblitz', 'https://stackblitz.com/run', {
      'project[title]': p.title,
      'project[description]': 'Materix UI v' + CONFIG.version,
      'project[template]': 'html',
      'project[files][index.html]': p.document
    });
  }

  /** Activa los botones de playground de cada mtx-demo. */
  function initPlayground() {
    document.addEventListener('click', function (event) {
      var button = event.target.closest('[data-doc-playground]');
      if (!button) return;
      var demo = button.closest('.doc-demo');
      var project = demo ? buildPlayground(demo) : null;
      if (!project) return;
      if (button.getAttribute('data-doc-playground') === 'stackblitz') openStackBlitz(project);
      else openCodePen(project);
    });
  }

  /* ------------------------------------------------------------------------
     Volver arriba
     ------------------------------------------------------------------------ */

  /** Muestra "Volver arriba" solo en páginas largas y lleva el foco al contenido principal. */
  function initBackToTop() {
    var link = document.querySelector('[data-doc-back-to-top]');
    var main = document.getElementById('doc-content');
    if (!link || !main) return;
    var check = function () {
      link.hidden = document.documentElement.scrollHeight < window.innerHeight * 2.5;
    };
    check();
    window.addEventListener('load', check);
    window.addEventListener('resize', check);
    link.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      main.focus({ preventScroll: true });
    });
  }

  /* ------------------------------------------------------------------------
     Selector de idioma (disclosure con enlaces)
     ------------------------------------------------------------------------ */

  /** Inicializa el menú de idiomas: abrir/cerrar, flechas, Escape y clic fuera. */
  function initLanguageMenu() {
    var wrap = document.querySelector('[data-doc-lang]');
    if (!wrap) return;
    var toggle = wrap.querySelector('[data-doc-lang-toggle]');
    var menu = document.getElementById(toggle ? toggle.getAttribute('aria-controls') : '');
    if (!toggle || !menu) return;
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));

    var setOpen = function (open, restoreFocus) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      wrap.classList.toggle('is-open', open);
      if (open) {
        var current = menu.querySelector('[aria-current]') || links[0];
        if (current) current.focus();
      } else if (restoreFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener('click', function () { setOpen(menu.hidden); });
    wrap.addEventListener('keydown', function (event) {
      if (menu.hidden) {
        if (event.target === toggle && event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); }
        return;
      }
      var i = links.indexOf(document.activeElement);
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); }
      else if (event.key === 'ArrowDown') { event.preventDefault(); links[(i + 1) % links.length].focus(); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
    });
    wrap.addEventListener('focusout', function (event) {
      if (!menu.hidden && !wrap.contains(event.relatedTarget)) setOpen(false);
    });
    document.addEventListener('click', function (event) {
      if (!menu.hidden && !wrap.contains(event.target)) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------------ */

  /** Inicializa Materix y todas las funciones del sitio. */
  function boot() {
    if (window.Materix && typeof window.Materix.initAll === 'function') {
      try { window.Materix.initAll(); } catch (e) { console.error('[docs] Materix.initAll', e); }
    }
    initTheme();
    initLanguageMenu();
    initDrawer();
    initDemos();
    initCodeBlocks();
    initScrollableCode();
    initTables();
    initToc();
    initSearch();
    initSearchHits();
    initPlayground();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
