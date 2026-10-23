/* ==========================================================================
   Materix UI — Generador de tema (página de guía)
   Paleta MUI (main → light/dark/contrast), modo claro/oscuro, forma y tipografía.
   Vista previa en un iframe aislado con la librería real. Vanilla, sin dependencias.
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'mtx-doc-theme-builder';
  var COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
  /** Mínimo WCAG AA para texto normal. */
  var AA = 4.5;
  /** contrastThreshold por modo de contraste: AA (por defecto en Materix) o el 3 de MUI. */
  var THRESHOLDS = { aa: AA, mui: 3 };
  var DARK_TEXT = 'rgba(0, 0, 0, 0.87)';
  var WHITE = '#ffffff';

  /** Valores por defecto de src/styles/tokens.css. */
  var DEFAULTS = {
    light: { primary: '#4818d0', secondary: '#9c27b0', error: '#d32f2f', warning: '#ed6c02', info: '#0288d1', success: '#2e7d32' },
    dark: { primary: '#b388ff', secondary: '#ce93d8', error: '#f44336', warning: '#ffa726', info: '#64b5f6', success: '#66bb6a' }
  };
  /** Superficie (background.paper) de cada modo, para el contraste del color sobre el fondo. */
  var PAPER = { light: '#ffffff', dark: '#1e1e1e' };
  /** Fondo más exigente para el texto de color: el gris de los campos filled sobre paper. */
  var STRICT_BG = { light: '#f0f0f0', dark: '#323232' };
  var DEFAULT_RADIUS = 4;
  var DEFAULT_FONT = 'roboto';

  /* ------------------------------------------------------------------------
     Color
     ------------------------------------------------------------------------ */

  /**
   * Normaliza un hex (#rgb o #rrggbb, con o sin #) a #rrggbb en minúsculas.
   * @param {string} value Texto introducido.
   * @returns {string|null} Hex normalizado o null si no es válido.
   */
  function normalizeHex(value) {
    var v = String(value || '').trim().replace(/^#/, '').toLowerCase();
    if (/^[0-9a-f]{3}$/.test(v)) v = v.replace(/(.)/g, '$1$1');
    return /^[0-9a-f]{6}$/.test(v) ? '#' + v : null;
  }

  /**
   * Convierte #rrggbb a canales.
   * @param {string} hex Color.
   * @returns {number[]} [r, g, b] 0–255.
   */
  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  /**
   * Convierte canales a #rrggbb truncando decimales, como recomposeColor de MUI.
   * @param {number[]} rgb Canales 0–255.
   * @returns {string} Hex.
   */
  function rgbToHex(rgb) {
    return '#' + rgb.map(function (c) {
      var h = Math.floor(Math.max(0, Math.min(255, c))).toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');
  }

  /**
   * Aclara un color como MUI lighten(): c + (255 − c) · k.
   * @param {string} hex Color base.
   * @param {number} k Coeficiente 0–1.
   * @returns {string} Hex aclarado.
   */
  function lighten(hex, k) {
    return rgbToHex(hexToRgb(hex).map(function (c) { return c + (255 - c) * k; }));
  }

  /**
   * Oscurece un color como MUI darken(): c · (1 − k).
   * @param {string} hex Color base.
   * @param {number} k Coeficiente 0–1.
   * @returns {string} Hex oscurecido.
   */
  function darken(hex, k) {
    return rgbToHex(hexToRgb(hex).map(function (c) { return c * (1 - k); }));
  }

  /**
   * Luminancia relativa WCAG.
   * @param {number[]} rgb Canales 0–255.
   * @returns {number} Luminancia 0–1.
   */
  function luminance(rgb) {
    var c = rgb.map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  /**
   * Ratio de contraste WCAG entre dos colores opacos.
   * @param {number[]} a Canales del primer color.
   * @param {number[]} b Canales del segundo color.
   * @returns {number} Ratio 1–21.
   */
  function contrastRatio(a, b) {
    var la = luminance(a);
    var lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  /**
   * Compone rgba(0,0,0,.87) sobre un fondo para medir su contraste real.
   * @param {number[]} bg Canales del fondo.
   * @returns {number[]} Canales resultantes.
   */
  function darkTextOver(bg) {
    return bg.map(function (c) { return c * 0.13; });
  }

  /**
   * Formatea un ratio truncando a 2 decimales (4.497 no se muestra como 4.50).
   * @param {number} ratio Ratio de contraste.
   * @returns {string} Texto con 2 decimales.
   */
  function ratioText(ratio) {
    return (Math.floor(ratio * 100) / 100).toFixed(2);
  }

  /**
   * Color de texto accesible (-text): el principal si alcanza 4.5:1 sobre el fondo más exigente
   * del modo; si no, se oscurece (claro) o aclara (oscuro) en pasos del 5 % hasta alcanzarlo.
   * @param {string} main Color principal (#rrggbb).
   * @param {string} mode Modo 'light' u 'dark'.
   * @returns {string} Color #rrggbb.
   */
  function accessibleText(main, mode) {
    var bg = hexToRgb(STRICT_BG[mode]);
    for (var k = 0; k <= 1; k += 0.05) {
      var candidate = mode === 'dark' ? lighten(main, k) : darken(main, k);
      if (contrastRatio(hexToRgb(candidate), bg) >= AA) return candidate;
    }
    return mode === 'dark' ? WHITE : '#000000';
  }

  /**
   * Deriva las variantes de un color como augmentColor de MUI (tonalOffset 0.2).
   * @param {string} main Color principal (#rrggbb).
   * @param {string} [mode='light'] Modo 'light' u 'dark'.
   * @param {string} [contrastMode='aa'] 'aa' (contrastThreshold 4.5) o 'mui' (3, valores exactos de MUI).
   * @returns {{main: string, light: string, dark: string, contrast: string, ratio: number, text: string, textRatio: number}} Variantes y contrastes.
   */
  function augment(main, mode, contrastMode) {
    mode = mode === 'dark' ? 'dark' : 'light';
    var rgb = hexToRgb(main);
    var whiteRatio = contrastRatio([255, 255, 255], rgb);
    var darkRatio = contrastRatio(darkTextOver(rgb), rgb);
    var threshold = THRESHOLDS[contrastMode] || AA;
    // Como getContrastText de MUI; en AA, si ninguno llega al umbral se usa el de mayor contraste.
    var useWhite = whiteRatio >= threshold || (contrastMode !== 'mui' && whiteRatio > darkRatio);
    var text = contrastMode === 'mui' ? main : accessibleText(main, mode);
    return {
      main: main,
      light: lighten(main, 0.2),
      dark: darken(main, 0.3),
      contrast: useWhite ? WHITE : DARK_TEXT,
      ratio: useWhite ? whiteRatio : darkRatio,
      text: text,
      textRatio: contrastRatio(hexToRgb(text), hexToRgb(STRICT_BG[mode]))
    };
  }

  /* ------------------------------------------------------------------------
     Estado y persistencia
     ------------------------------------------------------------------------ */

  /**
   * Crea el estado inicial a partir de los valores por defecto.
   * @returns {Object} Estado.
   */
  function defaultState() {
    return {
      mode: 'light',
      light: Object.assign({}, DEFAULTS.light),
      dark: Object.assign({}, DEFAULTS.dark),
      radius: DEFAULT_RADIUS,
      font: DEFAULT_FONT,
      contrast: 'aa'
    };
  }

  /**
   * Lee el estado guardado validando cada campo.
   * @param {Object[]} fonts Fuentes disponibles.
   * @returns {Object} Estado válido.
   */
  function loadState(fonts) {
    var state = defaultState();
    var saved = null;
    try { saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { saved = null; }
    if (!saved || typeof saved !== 'object') return state;
    if (saved.mode === 'dark' || saved.mode === 'light') state.mode = saved.mode;
    if (saved.contrast === 'aa' || saved.contrast === 'mui') state.contrast = saved.contrast;
    ['light', 'dark'].forEach(function (mode) {
      COLORS.forEach(function (c) {
        var hex = saved[mode] && normalizeHex(saved[mode][c]);
        if (hex) state[mode][c] = hex;
      });
    });
    var r = Number(saved.radius);
    if (isFinite(r) && r >= 0 && r <= 24) state.radius = Math.round(r);
    if (fonts.some(function (f) { return f.id === saved.font; })) state.font = saved.font;
    return state;
  }

  /**
   * Guarda el estado sin lanzar errores (modo privado, almacenamiento bloqueado).
   * @param {Object} state Estado.
   */
  function saveState(state) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* sin persistencia */ }
  }

  /* ------------------------------------------------------------------------
     CSS generado
     ------------------------------------------------------------------------ */

  /**
   * Declaraciones de paleta de un modo.
   * @param {Object} palette Colores main por clave.
   * @param {string} mode Modo 'light' u 'dark'.
   * @param {string} contrastMode 'aa' o 'mui'.
   * @returns {string[]} Líneas CSS.
   */
  function paletteLines(palette, mode, contrastMode) {
    var lines = [];
    COLORS.forEach(function (c, i) {
      var v = augment(palette[c], mode, contrastMode);
      if (i) lines.push('');
      lines.push('  --mtx-color-' + c + ': ' + v.main + ';');
      lines.push('  --mtx-color-' + c + '-light: ' + v.light + ';');
      lines.push('  --mtx-color-' + c + '-dark: ' + v.dark + ';');
      lines.push('  --mtx-color-' + c + '-contrast: ' + v.contrast + ';');
      lines.push('  --mtx-color-' + c + '-text: ' + v.text + ';');
    });
    return lines;
  }

  /**
   * Genera el CSS de override completo.
   * @param {Object} state Estado.
   * @param {Object} font Fuente elegida.
   * @param {Object} t Textos.
   * @returns {string} CSS.
   */
  function buildCss(state, font, t) {
    var out = ['/* ' + t.header + ' */'];
    if (font.google) {
      out.push('/* ' + t.fontNote + ' */');
      out.push('/* <link rel="stylesheet" href="' + googleFontUrl(font) + '"> */');
    }
    out.push('/* ' + (state.contrast === 'mui' ? t.cssContrastMui : t.cssContrastAa) + ' */');
    out.push(':root {');
    out = out.concat(paletteLines(state.light, 'light', state.contrast));
    out.push('');
    out.push('  --mtx-shape-radius: ' + state.radius + 'px;');
    out.push('  --mtx-font-family: ' + font.family + ';');
    out.push('}');
    out.push('');
    out.push('[data-mtx-theme="dark"] {');
    out = out.concat(paletteLines(state.dark, 'dark', state.contrast));
    out.push('}');
    return out.join('\n') + '\n';
  }

  /**
   * URL de Google Fonts para una familia.
   * @param {Object} font Fuente.
   * @returns {string} URL.
   */
  function googleFontUrl(font) {
    return 'https://fonts.googleapis.com/css2?family=' + font.google + ':wght@300;400;500;700&display=swap';
  }

  /* ------------------------------------------------------------------------
     Interfaz
     ------------------------------------------------------------------------ */

  /**
   * Escapa HTML.
   * @param {string} text Texto.
   * @returns {string} Texto seguro.
   */
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /**
   * Sustituye {clave} en una plantilla de texto.
   * @param {string} tpl Plantilla.
   * @param {Object} data Valores.
   * @returns {string} Texto.
   */
  function format(tpl, data) {
    return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return k in data ? data[k] : m; });
  }

  /**
   * Inicializa un generador de tema.
   * @param {HTMLElement} root Contenedor [data-doc-theme-builder].
   */
  function initBuilder(root) {
    var cfgEl = root.querySelector('[data-doc-tb-config]');
    var cfg = {};
    try { cfg = JSON.parse(cfgEl.textContent) || {}; } catch (e) { return; }
    var t = cfg.strings || {};
    var fonts = cfg.fonts || [];
    var assets = cfg.assets || {};
    var state = loadState(fonts);

    var frame = root.querySelector('[data-doc-tb-frame]');
    var codeEl = root.querySelector('[data-doc-tb-css]');
    var warningsEl = root.querySelector('[data-doc-tb-warnings]');
    var statusEl = root.querySelector('[data-doc-tb-status]');
    var modeLabel = root.querySelector('[data-doc-tb-mode-label]');
    var radiusInput = root.querySelector('[data-doc-tb-radius]');
    var radiusOut = root.querySelector('[data-doc-tb-radius-out]');
    var fontSelect = root.querySelector('[data-doc-tb-font]');
    var modeInputs = root.querySelectorAll('[data-doc-tb-mode]');
    var contrastInputs = root.querySelectorAll('[data-doc-tb-contrast]');
    var rows = {};
    root.querySelectorAll('[data-doc-tb-color]').forEach(function (row) {
      rows[row.getAttribute('data-doc-tb-color')] = row;
    });
    var css = '';
    var statusTimer = 0;

    var currentFont = function () {
      return fonts.filter(function (f) { return f.id === state.font; })[0] || fonts[0];
    };

    var flash = function (text) {
      statusEl.textContent = text;
      clearTimeout(statusTimer);
      statusTimer = setTimeout(function () { statusEl.textContent = ''; }, 2000);
    };

    /** Escribe el estado en los controles. */
    var syncControls = function () {
      modeInputs.forEach(function (input) { input.checked = input.value === state.mode; });
      contrastInputs.forEach(function (input) { input.checked = input.value === state.contrast; });
      COLORS.forEach(function (c) {
        var row = rows[c];
        if (!row) return;
        var hex = state[state.mode][c];
        row.querySelector('[data-doc-tb-picker]').value = hex;
        var text = row.querySelector('[data-doc-tb-hex]');
        if (document.activeElement !== text) text.value = hex;
        setRowError(row, false);
      });
      radiusInput.value = String(state.radius);
      radiusOut.textContent = state.radius + 'px';
      fontSelect.value = state.font;
    };

    /**
     * Muestra u oculta el error de formato de una fila.
     * @param {HTMLElement} row Fila de color.
     * @param {boolean} invalid Si el valor no es válido.
     */
    var setRowError = function (row, invalid) {
      var text = row.querySelector('[data-doc-tb-hex]');
      var err = row.querySelector('[data-doc-tb-error]');
      text.setAttribute('aria-invalid', String(invalid));
      err.textContent = invalid ? t.invalidHex : '';
    };

    /** Recalcula derivados, avisos, CSS y vista previa. */
    var update = function () {
      var palette = state[state.mode];
      var warnings = [];
      COLORS.forEach(function (c) {
        var row = rows[c];
        var v = augment(palette[c], state.mode, state.contrast);
        var surface = v.textRatio;
        var name = row ? row.querySelector('.doc-tb-color-name').textContent.trim() : c;
        if (row) {
          ['light', 'main', 'dark'].forEach(function (k) {
            row.querySelector('[data-doc-tb-swatch="' + k + '"]').style.backgroundColor = v[k];
          });
          var sw = row.querySelector('[data-doc-tb-swatch="contrast"]');
          sw.style.backgroundColor = v.main;
          sw.style.color = v.contrast;
          var badge = row.querySelector('[data-doc-tb-badge]');
          var ok = v.ratio >= AA;
          badge.textContent = ratioText(v.ratio) + ':1';
          badge.className = 'doc-tb-badge ' + (ok ? 'is-ok' : 'is-low');
          badge.title = ok ? t.contrastOk : t.contrastLow;
        }
        if (v.ratio < AA) warnings.push(format(t.onColor, { color: name, ratio: ratioText(v.ratio) }));
        if (surface < AA) warnings.push(format(t.onSurface, { color: name, ratio: ratioText(surface) }));
      });
      warningsEl.innerHTML = warnings.length
        ? warnings.map(function (w) {
          return '<li class="doc-tb-warning"><span class="material-icons" aria-hidden="true">warning</span><span>' + escapeHtml(w) + '</span></li>';
        }).join('')
        : '<li class="doc-tb-warning is-ok"><span class="material-icons" aria-hidden="true">check_circle</span><span>' + escapeHtml(t.noWarnings) + '</span></li>';

      css = buildCss(state, currentFont(), t);
      codeEl.textContent = css;
      modeLabel.textContent = state.mode === 'dark' ? '[data-mtx-theme="dark"]' : ':root';
      applyPreview();
      saveState(state);
    };

    /* ---------------------------- Vista previa ---------------------------- */

    var frameReady = false;
    var absolute = function (url) { return new URL(url, window.location.href).href; };

    /** Construye el documento del iframe con la librería real. */
    var buildFrame = function () {
      var tpl = root.querySelector('template[data-doc-tb-preview]');
      var links = (assets.fonts || []).map(function (href) {
        return '<link rel="stylesheet" href="' + escapeHtml(href) + '">';
      }).join('');
      var doc = '<!DOCTYPE html><html lang="' + escapeHtml(t.lang || 'en') + '" data-mtx-theme="' + state.mode + '"><head>' +
        '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
        links + '<link rel="stylesheet" id="tb-font" href="">' +
        '<link rel="stylesheet" href="' + escapeHtml(absolute(assets.css)) + '">' +
        '<style id="tb-override"></style>' +
        '<style>html,body{margin:0}body{padding:24px;overflow:hidden}</style>' +
        '<script src="' + escapeHtml(absolute(assets.js)) + '"><\/script>' +
        '</head><body class="mtx-root">' + (tpl ? tpl.innerHTML : '') + '</body></html>';
      frame.addEventListener('load', function () {
        frameReady = true;
        applyPreview();
        var body = frame.contentDocument && frame.contentDocument.body;
        if (!body) return;
        var resize = function () { frame.style.height = Math.ceil(frame.contentDocument.documentElement.scrollHeight) + 'px'; };
        resize();
        if ('ResizeObserver' in window) new ResizeObserver(resize).observe(body);
      });
      frame.srcdoc = doc;
    };

    /** Aplica modo, fuente y CSS generado al iframe. */
    var applyPreview = function () {
      if (!frameReady) return;
      var doc = frame.contentDocument;
      if (!doc) return;
      doc.documentElement.setAttribute('data-mtx-theme', state.mode);
      var style = doc.getElementById('tb-override');
      if (style) style.textContent = css;
      var font = currentFont();
      var link = doc.getElementById('tb-font');
      var href = font.google ? googleFontUrl(font) : '';
      if (link && link.getAttribute('href') !== href) {
        if (href) link.setAttribute('href', href); else link.removeAttribute('href');
      }
    };

    /* ------------------------------ Eventos ------------------------------- */

    contrastInputs.forEach(function (input) {
      input.addEventListener('change', function () {
        if (!input.checked) return;
        state.contrast = input.value === 'mui' ? 'mui' : 'aa';
        update();
      });
    });

    modeInputs.forEach(function (input) {
      input.addEventListener('change', function () {
        if (!input.checked) return;
        state.mode = input.value === 'dark' ? 'dark' : 'light';
        syncControls();
        update();
      });
    });

    COLORS.forEach(function (c) {
      var row = rows[c];
      if (!row) return;
      var picker = row.querySelector('[data-doc-tb-picker]');
      var text = row.querySelector('[data-doc-tb-hex]');
      picker.addEventListener('input', function () {
        state[state.mode][c] = picker.value.toLowerCase();
        text.value = state[state.mode][c];
        setRowError(row, false);
        update();
      });
      text.addEventListener('input', function () {
        var hex = normalizeHex(text.value);
        // Solo se marca error cuando el valor está completo; mientras se escribe no se interrumpe.
        if (!hex) { if (text.value.replace('#', '').length >= 6) setRowError(row, true); return; }
        setRowError(row, false);
        state[state.mode][c] = hex;
        picker.value = hex;
        update();
      });
      text.addEventListener('blur', function () {
        var hex = normalizeHex(text.value);
        setRowError(row, !hex);
        if (hex) text.value = hex;
      });
    });

    radiusInput.addEventListener('input', function () {
      state.radius = Number(radiusInput.value) || 0;
      radiusOut.textContent = state.radius + 'px';
      update();
    });

    fontSelect.addEventListener('change', function () {
      state.font = fontSelect.value;
      update();
    });

    root.querySelector('[data-doc-tb-reset]').addEventListener('click', function () {
      var mode = state.mode;
      state = defaultState();
      state.mode = mode;
      syncControls();
      update();
      flash(t.resetDone);
    });

    root.querySelector('[data-doc-tb-copy]').addEventListener('click', function () {
      var done = function (ok) { flash(ok ? t.copied : t.copyFailed); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(css).then(function () { done(true); }, function () { done(false); });
        return;
      }
      var area = document.createElement('textarea');
      area.value = css;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try { done(document.execCommand('copy')); } catch (e) { done(false); }
      document.body.removeChild(area);
    });

    root.querySelector('[data-doc-tb-download]').addEventListener('click', function () {
      var blob = new Blob([css], { type: 'text/css' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'materix-theme.css';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      flash(t.downloaded);
    });

    root.querySelector('[data-doc-tb-form]').addEventListener('submit', function (e) { e.preventDefault(); });

    syncControls();
    update();
    buildFrame();

    // API mínima para depuración y pruebas automatizadas.
    root._docThemeBuilder = {
      getState: function () { return JSON.parse(JSON.stringify(state)); },
      getCss: function () { return css; },
      augment: augment,
      contrastRatio: function (a, b) { return contrastRatio(hexToRgb(normalizeHex(a)), hexToRgb(normalizeHex(b))); }
    };
  }

  /** Inicializa todos los generadores de la página. */
  function boot() {
    document.querySelectorAll('[data-doc-theme-builder]').forEach(initBuilder);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
