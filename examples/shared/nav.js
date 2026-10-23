/**
 * Materix UI — Ejemplos
 * Shell de navegación compartido: AppBar fija + Drawer de componentes
 * (persistente bajo la AppBar en desktop ≥ 900px, temporal con backdrop en móvil).
 * Reutiliza las clases de AppBar, Toolbar, Drawer, List e IconButton de la librería.
 * Solo actúa en páginas que contienen `.demo-shell`.
 */
(function () {
  if (window.__MTX_DEMO_NAV__) return;
  window.__MTX_DEMO_NAV__ = true;

  // Favicon en línea: evita el 404 de /favicon.ico en la consola de cada ejemplo.
  if (!document.querySelector('link[rel~="icon"]')) {
    var favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%234818d0'/%3E%3Cpath d='M8 23V9h3l5 7 5-7h3v14h-3v-9l-5 7-5-7v9z' fill='%23fff'/%3E%3C/svg%3E";
    document.head.appendChild(favicon);
  }

  /** Grupos y orden oficiales (contrato §1, igual que la documentación). */
  var GROUPS = [
    {
      title: 'Layout',
      items: [
        { slug: 'grid', name: 'Grid', icon: 'grid_view', keys: 'columns layout responsive' },
        { slug: 'css-baseline', name: 'CSS Baseline', icon: 'format_paint', keys: 'reset base normalize' },
        { slug: 'container', name: 'Container', icon: 'crop_free', keys: 'max width centered layout' },
        { slug: 'stack', name: 'Stack', icon: 'view_agenda', keys: 'stacking flex gap layout' },
        { slug: 'utilities', name: 'Utilities', icon: 'build', keys: 'utility classes helpers spacing display flex' },
      ],
    },
    {
      title: 'Inputs',
      items: [
        { slug: 'button', name: 'Button', icon: 'smart_button', keys: 'action click' },
        { slug: 'button-group', name: 'Button Group', icon: 'view_week', keys: 'group buttons split segmented' },
        { slug: 'icon-button', name: 'Icon Button', icon: 'ads_click', keys: 'icon action' },
        { slug: 'fab', name: 'Fab', icon: 'add_circle', keys: 'floating action button' },
        { slug: 'checkbox', name: 'Checkbox', icon: 'check_box', keys: 'check tick' },
        { slug: 'radio', name: 'Radio', icon: 'radio_button_checked', keys: 'option group' },
        { slug: 'rating', name: 'Rating', icon: 'star_half', keys: 'stars score review' },
        { slug: 'slider', name: 'Slider', icon: 'tune', keys: 'range continuous control volume price' },
        { slug: 'switch', name: 'Switch', icon: 'toggle_on', keys: 'toggle on off' },
        { slug: 'text-field', name: 'Text Field', icon: 'edit', keys: 'field text input' },
        { slug: 'select', name: 'Select', icon: 'list', keys: 'dropdown picker' },
        { slug: 'native-select', name: 'Native Select', icon: 'arrow_drop_down_circle', keys: 'native dropdown' },
        { slug: 'autocomplete', name: 'Autocomplete', icon: 'manage_search', keys: 'suggestions combobox search filter chips multiple' },
        { slug: 'date-time-picker', name: 'Date Time Picker', icon: 'event', keys: 'date time calendar clock' },
        { slug: 'toggle-button', name: 'Toggle Button', icon: 'toggle_off', keys: 'toggle group exclusive selection multiple' },
      ],
    },
    {
      title: 'Data display',
      items: [
        { slug: 'avatar', name: 'Avatar', icon: 'account_circle', keys: 'user image profile' },
        { slug: 'badge', name: 'Badge', icon: 'notifications', keys: 'counter notification dot' },
        { slug: 'chip', name: 'Chip', icon: 'label', keys: 'tag label' },
        { slug: 'divider', name: 'Divider', icon: 'horizontal_rule', keys: 'separator rule' },
        { slug: 'list', name: 'List', icon: 'format_list_bulleted', keys: 'items' },
        { slug: 'table', name: 'Table', icon: 'table_chart', keys: 'data grid rows' },
        { slug: 'typography', name: 'Typography', icon: 'text_fields', keys: 'text type scale' },
        { slug: 'tooltip', name: 'Tooltip', icon: 'info', keys: 'hint floating label hover title description' },
      ],
    },
    {
      title: 'Feedback',
      items: [
        { slug: 'alert', name: 'Alert', icon: 'warning', keys: 'message warning notice' },
        { slug: 'backdrop', name: 'Backdrop', icon: 'gradient', keys: 'overlay dim loading' },
        { slug: 'dialog', name: 'Dialog', icon: 'open_in_browser', keys: 'modal popup' },
        { slug: 'progress', name: 'Progress', icon: 'donut_large', keys: 'spinner bar circular linear loading' },
        { slug: 'skeleton', name: 'Skeleton', icon: 'view_day', keys: 'placeholder loading shimmer' },
        { slug: 'snackbar', name: 'Snackbar', icon: 'chat_bubble', keys: 'notification toast' },
      ],
    },
    {
      title: 'Surfaces',
      items: [
        { slug: 'accordion', name: 'Accordion', icon: 'expand_circle_down', keys: 'faq collapsible expansion panel details' },
        { slug: 'app-bar', name: 'App Bar', icon: 'view_headline', keys: 'header bar toolbar' },
        { slug: 'card', name: 'Card', icon: 'web', keys: 'tile surface' },
        { slug: 'paper', name: 'Paper', icon: 'layers', keys: 'surface elevation' },
        { slug: 'popover', name: 'Popover', icon: 'picture_in_picture', keys: 'floating anchored panel popup' },
      ],
    },
    {
      title: 'Navigation',
      items: [
        { slug: 'breadcrumbs', name: 'Breadcrumbs', icon: 'more_horiz', keys: 'path navigation hierarchy' },
        { slug: 'drawer', name: 'Drawer', icon: 'menu_open', keys: 'side panel sidebar' },
        { slug: 'link', name: 'Link', icon: 'link', keys: 'anchor href' },
        { slug: 'menu', name: 'Menu', icon: 'more_vert', keys: 'context menu dropdown' },
        { slug: 'pagination', name: 'Pagination', icon: 'last_page', keys: 'pages numbers' },
        { slug: 'tabs', name: 'Tabs', icon: 'tab', keys: 'tab panels' },
        { slug: 'speed-dial', name: 'Speed Dial', icon: 'touch_app', keys: 'floating actions' },
        { slug: 'stepper', name: 'Stepper', icon: 'linear_scale', keys: 'steps wizard progress' },
      ],
    },
  ];

  var DESKTOP_QUERY = '(min-width: 900px)';
  var COLLAPSED_KEY = 'mtx-drawer-collapsed';
  var scriptSrc = (document.currentScript && document.currentScript.src) || '';

  /**
   * Escapa texto para interpolarlo en HTML.
   * @param {string} value Texto plano.
   * @returns {string} Texto escapado.
   */
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /**
   * Normaliza texto para búsqueda (minúsculas y sin tildes).
   * @param {string} value Texto.
   * @returns {string} Texto normalizado.
   */
  function normalize(value) {
    return String(value).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /**
   * Lee sessionStorage de forma segura.
   * @param {string} key Clave.
   * @returns {string|null} Valor.
   */
  function readSession(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  /**
   * Escribe sessionStorage de forma segura.
   * @param {string} key Clave.
   * @param {string} value Valor.
   * @returns {void}
   */
  function writeSession(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      /* almacenamiento no disponible */
    }
  }

  /**
   * Resuelve la URL raíz de /examples a partir de la ubicación de este script.
   * @returns {URL} URL de la carpeta examples/.
   */
  function getExamplesRoot() {
    if (scriptSrc) return new URL('../', scriptSrc);
    var path = window.location.pathname;
    var idx = path.lastIndexOf('/examples/');
    return new URL(idx !== -1 ? path.slice(0, idx + 10) : './', window.location.href);
  }

  /**
   * Obtiene el slug del ejemplo actual ('' en el catálogo).
   * @param {URL} root Raíz de examples.
   * @returns {string} Slug activo.
   */
  function getActiveSlug(root) {
    var here = window.location.href.split(/[?#]/)[0];
    if (here.indexOf(root.href) !== 0) return '';
    var segment = here.slice(root.href.length).split('/')[0];
    return /\.html?$/.test(segment) ? '' : segment;
  }

  /**
   * Construye el HTML de un ítem de navegación.
   * @param {{href:string,name:string,icon:string,active:boolean,search?:string}} item Datos del ítem.
   * @returns {string} Marcado del ítem.
   */
  function itemHtml(item) {
    return (
      '<li class="demo-nav-entry"' + (item.search ? ' data-search="' + escapeHtml(item.search) + '"' : '') + '>' +
      '<a class="mtx-list-item-button demo-nav-item' + (item.active ? ' mtx-list-item--selected' : '') + '"' +
      ' data-mtx="list-item-button" href="' + escapeHtml(item.href) + '"' +
      (item.active ? ' aria-current="page"' : '') + '>' +
      '<span class="mtx-list-item-icon demo-nav-item-icon"><span class="material-icons" aria-hidden="true">' + item.icon + '</span></span>' +
      '<span class="mtx-list-item-text"><span class="mtx-list-item-text__primary">' + escapeHtml(item.name) + '</span></span>' +
      '</a></li>'
    );
  }

  /**
   * Crea la AppBar superior.
   * @param {URL} root Raíz de examples.
   * @returns {HTMLElement} AppBar.
   */
  function buildAppBar(root) {
    var docsHref = new URL('../docs/', root).href;
    var bar = document.createElement('header');
    bar.id = 'demo-app-bar';
    bar.className = 'mtx-app-bar mtx-app-bar--fixed mtx-app-bar--default demo-nav-appbar';
    bar.innerHTML =
      '<div class="mtx-toolbar demo-nav-toolbar">' +
      '<button type="button" class="mtx-icon-button mtx-icon-button--edge-start demo-nav-toggle" id="demo-drawer-toggle"' +
      ' data-mtx="icon-button" aria-controls="demo-nav-drawer" aria-expanded="false" aria-label="Show navigation">' +
      '<span class="material-icons" aria-hidden="true">menu</span></button>' +
      '<a class="demo-nav-brand" href="' + root.href + 'index.html">' +
      '<span class="demo-nav-logo" aria-hidden="true">M</span>' +
      '<span class="demo-nav-brand-text">Materix UI</span>' +
      '<span class="demo-nav-tag">Examples</span></a>' +
      '<span class="mtx-toolbar__spacer"></span>' +
      '<div class="demo-nav-actions">' +
      '<a class="mtx-icon-button demo-nav-action--wide" data-mtx="icon-button" href="' + escapeHtml(docsHref) + '"' +
      ' aria-label="Documentation" title="Documentation"><span class="material-icons" aria-hidden="true">menu_book</span></a>' +
      '<button type="button" class="mtx-icon-button" id="theme-toggle" data-mtx="icon-button" aria-label="Toggle theme">' +
      '<span class="material-icons" aria-hidden="true">dark_mode</span></button>' +
      '</div></div>';
    return bar;
  }

  /**
   * Crea el Drawer de navegación con filtro y grupos.
   * @param {URL} root Raíz de examples.
   * @param {string} activeSlug Slug activo.
   * @returns {HTMLElement} Drawer.
   */
  function buildDrawer(root, activeSlug) {
    var html =
      '<div class="demo-nav-search" role="search">' +
      '<span class="material-icons" aria-hidden="true">search</span>' +
      '<label class="demo-visually-hidden" for="demo-nav-filter">Search components</label>' +
      '<input id="demo-nav-filter" class="demo-nav-search-input" type="search" placeholder="Search components"' +
      ' autocomplete="off" spellcheck="false" aria-controls="demo-nav-list" aria-describedby="demo-nav-filter-hint">' +
      '<kbd class="demo-nav-kbd" aria-hidden="true">/</kbd>' +
      '<span id="demo-nav-filter-hint" class="demo-visually-hidden">Type to filter; Enter opens the first result.</span>' +
      '</div>' +
      '<div class="mtx-drawer__content demo-nav-content">' +
      '<nav aria-label="Components">' +
      '<ul class="mtx-list demo-nav-list" id="demo-nav-list">' +
      itemHtml({ href: root.href + 'index.html', name: 'Catalog', icon: 'apps', active: activeSlug === '' });

    GROUPS.forEach(function (group, index) {
      var headId = 'demo-nav-group-' + index;
      html +=
        '<li class="demo-nav-group">' +
        '<div class="mtx-list-subheader demo-nav-subheader" id="' + headId + '">' + escapeHtml(group.title) + '</div>' +
        '<ul class="demo-nav-sublist" aria-labelledby="' + headId + '">';
      group.items.forEach(function (item) {
        html += itemHtml({
          href: root.href + item.slug + '/index.html',
          name: item.name,
          icon: item.icon,
          active: item.slug === activeSlug,
          search: normalize(item.name + ' ' + item.slug + ' ' + group.title + ' ' + item.keys),
        });
      });
      html += '</ul></li>';
    });

    html +=
      '</ul>' +
      '<p class="demo-nav-empty" id="demo-nav-empty" role="status" hidden>No results</p>' +
      '</nav></div>';

    var drawer = document.createElement('aside');
    drawer.id = 'demo-nav-drawer';
    drawer.className = 'mtx-drawer mtx-drawer--left demo-nav-drawer';
    drawer.setAttribute('aria-label', 'Examples navigation');
    drawer.innerHTML = html;
    return drawer;
  }

  /**
   * Inicializa el shell completo de navegación.
   * @returns {void}
   */
  function init() {
    var shell = document.querySelector('.demo-shell');
    if (!shell || document.getElementById('demo-nav-drawer')) return;

    var body = document.body;
    var root = getExamplesRoot();
    var activeSlug = getActiveSlug(root);
    var desktopMq = window.matchMedia(DESKTOP_QUERY);

    if (!shell.id) shell.id = 'demo-main';
    if (!shell.hasAttribute('tabindex')) shell.setAttribute('tabindex', '-1');

    var skip = document.createElement('a');
    skip.className = 'demo-skip-link';
    skip.href = '#' + shell.id;
    skip.textContent = 'Skip to content';

    var appBar = buildAppBar(root);
    var drawer = buildDrawer(root, activeSlug);
    var backdrop = document.createElement('div');
    backdrop.className = 'mtx-drawer__backdrop demo-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    body.prepend(skip, appBar, drawer, backdrop);
    body.classList.add('demo-has-nav');

    var toggleBtn = appBar.querySelector('#demo-drawer-toggle');
    var filter = drawer.querySelector('#demo-nav-filter');
    var content = drawer.querySelector('.demo-nav-content');
    var emptyMsg = drawer.querySelector('#demo-nav-empty');
    var mobileOpen = false;

    /**
     * Indica si el drawer es visible en el modo actual.
     * @returns {boolean} Visible.
     */
    function isVisible() {
      return desktopMq.matches ? !body.classList.contains('demo-nav-collapsed') : mobileOpen;
    }

    /**
     * Refleja el estado actual en clases y ARIA.
     * @returns {void}
     */
    function render() {
      var visible = isVisible();
      var modal = !desktopMq.matches;
      drawer.classList.toggle('mtx-drawer--open', visible);
      drawer.classList.toggle('demo-nav-drawer--modal', modal);
      drawer.classList.toggle('mtx-drawer--persistent', !modal);
      drawer.classList.toggle('mtx-drawer--clipped', !modal);
      backdrop.classList.toggle('mtx-drawer__backdrop--open', modal && visible);
      body.classList.toggle('demo-nav-lock', modal && visible);
      if (modal && visible) {
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
      } else {
        drawer.removeAttribute('role');
        drawer.removeAttribute('aria-modal');
      }
      toggleBtn.setAttribute('aria-expanded', String(visible));
      toggleBtn.setAttribute('aria-label', visible ? 'Hide navigation' : 'Show navigation');
    }

    /**
     * Abre o cierra el drawer según el modo (persistente o temporal).
     * @param {boolean} open Estado deseado.
     * @param {{focus?:boolean}} [opts] Gestión de foco.
     * @returns {void}
     */
    function setOpen(open, opts) {
      var focus = !opts || opts.focus !== false;
      drawer.classList.add('mtx-drawer--animated');
      if (desktopMq.matches) {
        body.classList.toggle('demo-nav-collapsed', !open);
        writeSession(COLLAPSED_KEY, String(!open));
        render();
        return;
      }
      mobileOpen = open;
      render();
      if (!focus) return;
      if (open) {
        window.setTimeout(function () {
          filter.focus();
        }, 50);
      } else {
        toggleBtn.focus();
      }
    }

    /**
     * Desplaza la lista para mostrar el ítem activo sin mover la página.
     * @returns {void}
     */
    function revealActive() {
      var active = drawer.querySelector('[aria-current="page"]');
      if (!active || !content) return;
      var target = active.offsetTop - content.clientHeight / 2 + active.offsetHeight / 2;
      content.scrollTop = Math.max(0, target);
    }

    /**
     * Filtra los ítems del drawer por texto.
     * @returns {void}
     */
    function applyFilter() {
      var query = normalize(filter.value.trim());
      var total = 0;
      drawer.querySelectorAll('.demo-nav-group').forEach(function (group) {
        var visibleInGroup = 0;
        group.querySelectorAll('.demo-nav-entry').forEach(function (entry) {
          var match = !query || (entry.getAttribute('data-search') || '').indexOf(query) !== -1;
          entry.hidden = !match;
          if (match) visibleInGroup += 1;
        });
        group.hidden = visibleInGroup === 0;
        total += visibleInGroup;
      });
      var catalog = drawer.querySelector('.demo-nav-list > .demo-nav-entry');
      if (catalog) catalog.hidden = Boolean(query);
      emptyMsg.hidden = total > 0;
    }

    /**
     * Mantiene el foco dentro del drawer temporal.
     * @param {KeyboardEvent} event Evento de teclado.
     * @returns {void}
     */
    function trapFocus(event) {
      var focusables = Array.prototype.filter.call(
        drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])'),
        function (el) {
          return el.offsetParent !== null;
        }
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    // Estado inicial
    if (desktopMq.matches && readSession(COLLAPSED_KEY) === 'true') {
      body.classList.add('demo-nav-collapsed');
    }
    render();
    revealActive();
    window.requestAnimationFrame(function () {
      body.classList.add('demo-nav-ready');
    });

    // Eventos
    toggleBtn.addEventListener('click', function () {
      setOpen(!isVisible());
    });

    backdrop.addEventListener('click', function () {
      setOpen(false);
    });

    drawer.addEventListener('click', function (event) {
      if (!desktopMq.matches && event.target.closest('a[href]')) setOpen(false, { focus: false });
    });

    filter.addEventListener('input', applyFilter);
    filter.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        var first = drawer.querySelector('.demo-nav-entry:not([hidden]) a[href]');
        if (first) window.location.href = first.href;
      } else if (event.key === 'ArrowDown') {
        var next = drawer.querySelector('.demo-nav-group:not([hidden]) .demo-nav-entry:not([hidden]) a[href]');
        if (next) {
          event.preventDefault();
          next.focus();
        }
      } else if (event.key === 'Escape' && filter.value) {
        event.stopPropagation();
        filter.value = '';
        applyFilter();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !desktopMq.matches && mobileOpen) {
        setOpen(false);
      } else if (event.key === 'Tab' && !desktopMq.matches && mobileOpen) {
        trapFocus(event);
      } else if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        var tag = (document.activeElement && document.activeElement.tagName) || '';
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (document.activeElement && document.activeElement.isContentEditable)) return;
        event.preventDefault();
        if (!isVisible()) setOpen(true, { focus: false });
        filter.focus();
      }
    });

    var onBreakpoint = function () {
      mobileOpen = false;
      drawer.classList.remove('mtx-drawer--animated');
      body.classList.toggle('demo-nav-collapsed', desktopMq.matches && readSession(COLLAPSED_KEY) === 'true');
      render();
    };
    if (desktopMq.addEventListener) desktopMq.addEventListener('change', onBreakpoint);
    else desktopMq.addListener(onBreakpoint);

    // Componentes de la librería (ripple), tema e idioma
    if (window.Materix && typeof window.Materix.initAll === 'function') {
      window.Materix.initAll(appBar);
      window.Materix.initAll(drawer);
    }
    if (window.MtxDemoTheme) window.MtxDemoTheme.sync();
    if (window.MtxDemoLocale) window.MtxDemoLocale.mount(appBar.querySelector('.demo-nav-actions'));

    initTocSpy();
  }

  /**
   * Resalta en `.demo-toc` el enlace de la sección visible.
   * @returns {void}
   */
  function initTocSpy() {
    var toc = document.querySelector('.demo-toc');
    if (!toc || !('IntersectionObserver' in window)) return;
    var links = {};
    toc.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var id = decodeURIComponent(link.getAttribute('href').slice(1));
      if (id) links[id] = link;
    });
    var sections = Object.keys(links)
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);
    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          Object.keys(links).forEach(function (id) {
            links[id].classList.toggle('demo-toc__link--active', id === entry.target.id);
          });
        });
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /**
   * Hace accesibles por teclado los bloques de código y registros con scroll (axe scrollable-region-focusable).
   * @returns {void}
   */
  function initScrollRegions() {
    var REGIONS = [
      { selector: 'pre.demo-code', role: 'region', label: 'Code example' },
      { selector: '.demo-log', role: 'log', label: 'Event log' },
    ];
    REGIONS.forEach(function (region) {
      document.querySelectorAll(region.selector).forEach(function (el) {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        if (!el.hasAttribute('role')) el.setAttribute('role', region.role);
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
          el.setAttribute('aria-label', region.label);
        }
      });
    });
  }

  /**
   * Arranca la navegación y las mejoras de accesibilidad de la página de ejemplo.
   * @returns {void}
   */
  function boot() {
    initScrollRegions();
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
