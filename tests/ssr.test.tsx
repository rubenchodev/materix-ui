// @vitest-environment node
/**
 * SSR e hidratación de los componentes públicos de src/index.ts.
 *
 * Fase servidor (entorno node real, sin window/document): `renderToString` de cada componente con props
 * mínimas; los overlays también abiertos. Un acceso no protegido a window/document lanza y falla el caso.
 *
 * Fase cliente: se instala un JSDOM en el global, se reimporta la librería en limpio (`vi.resetModules()`, para
 * que `canUseDOM` se evalúe con DOM) y se hidrata (`hydrateRoot`) el HTML de la fase servidor, comprobando que
 * no hay avisos de hydration mismatch en console.error ni errores recuperables.
 */
import type { ReactElement } from 'react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

/** Tipado local mínimo de jsdom (el proyecto no instala @types/jsdom). */
interface JSDOMInstance {
  window: Window & { close(): void };
}
type JSDOMConstructor = new (html: string, options: { url: string; pretendToBeVisual: boolean }) => JSDOMInstance;

/** Nombre del módulo en variable: la importación dinámica no exige declaración de tipos. */
const JSDOM_MODULE: string = 'jsdom';

type Lib = typeof import('../src/index');
type Case = [name: string, build: (M: Lib) => ReactElement];

/** Fecha fija para que servidor y cliente pinten lo mismo en los pickers. */
const FIXED_DATE = new Date(2026, 9, 20, 10, 30);
const COUNTRIES = [
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },
  { value: 'pe', label: 'Perú' },
];

const noop = () => {};

/** Casos SSR: cada componente exportado con props mínimas; los overlays también abiertos. */
const SSR_CASES: Case[] = [
  // Tema e i18n
  ['ThemeProvider', (M) => <M.ThemeProvider><span>x</span></M.ThemeProvider>],
  ['ThemeScript', (M) => <M.ThemeScript />],
  ['MaterixProvider', (M) => <M.MaterixProvider><span>x</span></M.MaterixProvider>],
  ['I18nProvider', (M) => <M.I18nProvider locale="es"><span>x</span></M.I18nProvider>],
  // Núcleo
  ['Portal', (M) => <M.Portal><span>portal</span></M.Portal>],
  ['Fade', (M) => <M.Fade in><div>fade</div></M.Fade>],
  ['Collapse', (M) => <M.Collapse in={false}><div>collapse</div></M.Collapse>],
  ['Grow', (M) => <M.Grow in><div>grow</div></M.Grow>],
  // Componentes
  ['Accordion', (M) => <M.Accordion summary="Sum">Body</M.Accordion>],
  ['AccordionGroup', (M) => (
    <M.AccordionGroup>
      <M.Accordion summary="A" defaultExpanded>a</M.Accordion>
      <M.Accordion summary="B">b</M.Accordion>
    </M.AccordionGroup>
  )],
  ['Accordion compuesto', (M) => (
    <M.Accordion>
      <M.AccordionSummary>Sum</M.AccordionSummary>
      <M.AccordionDetails>Det</M.AccordionDetails>
      <M.AccordionActions><M.Button>Ok</M.Button></M.AccordionActions>
    </M.Accordion>
  )],
  ['Alert', (M) => <M.Alert severity="success" onClose={noop}><M.AlertTitle>T</M.AlertTitle>Saved</M.Alert>],
  ['AppBar', (M) => (
    <M.AppBar position="static">
      <M.Toolbar><M.ToolbarTitle>App</M.ToolbarTitle></M.Toolbar>
    </M.AppBar>
  )],
  ['ToolbarOffset', (M) => <M.ToolbarOffset />],
  ['Avatar', (M) => <M.Avatar alt="Ana Pérez" />],
  ['AvatarGroup', (M) => <M.AvatarGroup max={2}><M.Avatar alt="A" /><M.Avatar alt="B" /><M.Avatar alt="C" /></M.AvatarGroup>],
  ['Backdrop', (M) => <M.Backdrop open={false} />],
  ['Backdrop abierto', (M) => <M.Backdrop open>loading</M.Backdrop>],
  ['Badge', (M) => <M.Badge badgeContent={4}><span className="material-icons">mail</span></M.Badge>],
  ['Breadcrumbs', (M) => (
    <M.Breadcrumbs>
      <M.Link href="/">Home</M.Link>
      <span>Current</span>
    </M.Breadcrumbs>
  )],
  ['Button', (M) => <M.Button variant="contained">Save</M.Button>],
  ['ButtonGroup', (M) => <M.ButtonGroup label="Group"><M.Button>One</M.Button><M.Button>Two</M.Button></M.ButtonGroup>],
  ['Card', (M) => (
    <M.Card>
      <M.CardHeader title="Title" subheader="Sub" />
      <M.CardMedia image="/x.png" alt="x" height={100} />
      <M.CardContent>Body</M.CardContent>
      <M.CardActions><M.Button>Ok</M.Button></M.CardActions>
    </M.Card>
  )],
  ['CardActionArea', (M) => <M.Card><M.CardActionArea>Click</M.CardActionArea></M.Card>],
  ['Checkbox', (M) => <M.Checkbox label="Accept" />],
  ['Chip', (M) => <M.Chip label="React" onDelete={noop} />],
  ['Container', (M) => <M.Container maxWidth="sm">c</M.Container>],
  ['CssBaseline', (M) => <M.CssBaseline />],
  ['ScopedCssBaseline', (M) => <M.ScopedCssBaseline>s</M.ScopedCssBaseline>],
  ['Dialog', (M) => <M.Dialog open={false} title="Dlg">body</M.Dialog>],
  ['Dialog abierto', (M) => (
    <M.Dialog open title="Dlg" onClose={noop}>
      <M.DialogContentText>body</M.DialogContentText>
    </M.Dialog>
  )],
  ['Dialog partes', (M) => (
    <div>
      <M.DialogTitle>T</M.DialogTitle>
      <M.DialogContent>C</M.DialogContent>
      <M.DialogActions><M.Button>Ok</M.Button></M.DialogActions>
    </div>
  )],
  ['Divider', (M) => <M.Divider />],
  ['Drawer temporal', (M) => <M.Drawer open={false} title="Nav">nav</M.Drawer>],
  ['Drawer abierto', (M) => <M.Drawer open title="Nav" onClose={noop}>nav</M.Drawer>],
  ['Drawer permanente', (M) => <M.Drawer variant="permanent" title="Nav">nav</M.Drawer>],
  ['Drawer responsive', (M) => <M.Drawer variant="responsive" title="Nav" onClose={noop}>nav</M.Drawer>],
  ['Drawer partes', (M) => (
    <M.Drawer variant="permanent">
      <M.DrawerHeader>H</M.DrawerHeader>
      <M.DrawerContent>
        <M.DrawerSubmenu label="Sub"><a href="#a">a</a></M.DrawerSubmenu>
      </M.DrawerContent>
      <M.DrawerFooter>F</M.DrawerFooter>
    </M.Drawer>
  )],
  ['Fab', (M) => <M.Fab icon="add" aria-label="Add" />],
  ['FormControl', (M) => (
    <M.FormControl>
      <M.FormLabel>Label</M.FormLabel>
      <M.FormHelperText>Help</M.FormHelperText>
    </M.FormControl>
  )],
  ['Grid', (M) => <M.Grid container spacing={2}><M.Grid size={6}>a</M.Grid></M.Grid>],
  ['IconButton', (M) => <M.IconButton icon="delete" aria-label="Delete" />],
  ['Link', (M) => <M.Link href="#x">Link</M.Link>],
  ['List', (M) => (
    <M.List>
      <M.ListSubheader>Sub</M.ListSubheader>
      <M.ListItem>
        <M.ListItemAvatar><M.Avatar alt="A" /></M.ListItemAvatar>
        <M.ListItemText primary="Item" secondary="Sec" />
        <M.ListItemSecondaryAction><M.IconButton icon="delete" aria-label="Delete" /></M.ListItemSecondaryAction>
      </M.ListItem>
      <M.ListItemButton icon="inbox">Inbox</M.ListItemButton>
      <M.ListItem><M.ListItemIcon>star</M.ListItemIcon></M.ListItem>
    </M.List>
  )],
  ['Menu', (M) => <M.Menu open={false}><M.MenuItem>One</M.MenuItem></M.Menu>],
  ['Menu abierto', (M) => (
    <M.Menu open onClose={noop}>
      <M.MenuItem icon="person">One</M.MenuItem>
      <M.MenuDivider />
      <M.MenuGroup label="Group"><M.MenuItem>Two</M.MenuItem></M.MenuGroup>
      <M.Submenu label="More"><M.MenuItem>Three</M.MenuItem></M.Submenu>
    </M.Menu>
  )],
  ['MenuList', (M) => <M.MenuList><M.MenuItem>One</M.MenuItem></M.MenuList>],
  ['ContextMenu', (M) => <M.ContextMenu target="#area" items={[{ label: 'Copy' }]} />],
  ['NativeSelect', (M) => (
    <M.NativeSelect label="Age" defaultValue="10">
      <option value="10">Ten</option>
      <option value="20">Twenty</option>
    </M.NativeSelect>
  )],
  ['Pagination', (M) => <M.Pagination count={10} aria-label="Pages" />],
  ['PaginationItem', (M) => <M.PaginationItem type="page" page={1} selected />],
  ['Paper', (M) => <M.Paper elevation={2}>p</M.Paper>],
  ['Popover', (M) => <M.Popover open={false}>pop</M.Popover>],
  ['Popover abierto', (M) => <M.Popover open label="Pop" onClose={noop}>pop</M.Popover>],
  ['CircularProgress', (M) => <M.CircularProgress />],
  ['LinearProgress', (M) => <M.LinearProgress variant="determinate" value={40} />],
  ['Radio', (M) => <M.Radio value="a" label="A" />],
  ['RadioGroup', (M) => (
    <M.RadioGroup name="g" defaultValue="a" label="Group">
      <M.Radio value="a" label="A" />
      <M.Radio value="b" label="B" />
    </M.RadioGroup>
  )],
  ['Rating', (M) => <M.Rating defaultValue={3} name="r" aria-label="Rating" />],
  ['Select', (M) => (
    <M.Select label="City" name="city">
      <option value="a">A</option>
      <option value="b">B</option>
    </M.Select>
  )],
  ['Select abierto', (M) => (
    <M.Select label="City" name="city" open>
      <option value="a">A</option>
    </M.Select>
  )],
  ['Skeleton', (M) => <M.Skeleton variant="text" />],
  ['SkeletonRegion', (M) => <M.SkeletonRegion loading>content</M.SkeletonRegion>],
  ['Slider', (M) => <M.Slider aria-label="Vol" defaultValue={30} />],
  ['Slider rango', (M) => <M.Slider aria-label="Range" defaultValue={[20, 40]} valueLabelDisplay="on" marks />],
  ['Snackbar', (M) => <M.Snackbar open={false} message="Hi" />],
  ['Snackbar abierto', (M) => <M.Snackbar open message="Hi" onClose={noop} />],
  ['SnackbarProvider', (M) => <M.SnackbarProvider><span>app</span></M.SnackbarProvider>],
  ['SpeedDial', (M) => (
    <M.SpeedDial ariaLabel="Actions" icon={<M.SpeedDialIcon />}>
      <M.SpeedDialAction icon="share" tooltipTitle="Share" />
    </M.SpeedDial>
  )],
  ['SpeedDial abierto', (M) => (
    <M.SpeedDial ariaLabel="Actions" open>
      <M.SpeedDialAction icon="share" tooltipTitle="Share" tooltipOpen />
    </M.SpeedDial>
  )],
  ['Stack', (M) => <M.Stack spacing={2}><div>a</div><div>b</div></M.Stack>],
  ['Stepper', (M) => (
    <M.Stepper activeStep={1}>
      <M.Step><M.StepLabel>One</M.StepLabel></M.Step>
      <M.Step><M.StepLabel>Two</M.StepLabel><M.StepContent>c</M.StepContent></M.Step>
    </M.Stepper>
  )],
  ['StepIcon', (M) => <M.StepIcon icon={1} active />],
  ['StepConnector', (M) => <M.StepConnector />],
  ['MobileStepper', (M) => <M.MobileStepper steps={4} activeStep={1} />],
  ['useStepper + StepperButton + StepPanel', (M) => {
    function Wizard() {
      const stepper = M.useStepper();
      return (
        <div>
          <M.Stepper apiRef={stepper.apiRef}>
            <M.Step label="One" />
            <M.Step label="Two" />
          </M.Stepper>
          <M.StepPanel stepper={stepper} index={0}>p0</M.StepPanel>
          <M.StepperButton stepper={stepper} action="next">Next</M.StepperButton>
        </div>
      );
    }
    return <Wizard />;
  }],
  ['Switch', (M) => <M.Switch label="Wifi" defaultChecked />],
  ['Table', (M) => (
    <M.TableContainer>
      <M.Table>
        <M.TableCaption>Cap</M.TableCaption>
        <M.TableHead>
          <M.TableRow>
            <M.TableCell><M.TableSortLabel active direction="asc">Name</M.TableSortLabel></M.TableCell>
          </M.TableRow>
        </M.TableHead>
        <M.TableBody>
          <M.TableRow><M.TableCell>Ana</M.TableCell></M.TableRow>
        </M.TableBody>
        <M.TableFooter>
          <M.TableRow><M.TableCell>f</M.TableCell></M.TableRow>
        </M.TableFooter>
      </M.Table>
    </M.TableContainer>
  )],
  ['TablePagination', (M) => <M.TablePagination count={100} defaultRowsPerPage={10} />],
  ['TableToolbar', (M) => <M.TableToolbar title="Rows" />],
  ['Tabs', (M) => (
    <M.TabContext defaultValue="a">
      <M.Tabs aria-label="T">
        <M.Tab value="a" label="A" />
        <M.Tab value="b" label="B" />
      </M.Tabs>
      <M.TabPanel value="a">pa</M.TabPanel>
      <M.TabPanel value="b">pb</M.TabPanel>
    </M.TabContext>
  )],
  ['TextField', (M) => <M.TextField label="Name" helperText="Help" />],
  ['TextField completo', (M) => (
    <M.TextField label="Pass" type="password" passwordToggle startIcon="lock" counter maxLength={10} mask="(000) 000-0000" />
  )],
  ['TextField multiline', (M) => <M.TextField label="Notes" multiline rows={3} />],
  ['ToggleButtonGroup', (M) => (
    <M.ToggleButtonGroup exclusive defaultValue="l" aria-label="Align">
      <M.ToggleButton value="l" icon="format_align_left" aria-label="Left" />
      <M.ToggleButton value="r" icon="format_align_right" aria-label="Right" />
    </M.ToggleButtonGroup>
  )],
  ['ToggleButton', (M) => <M.ToggleButton value="b" aria-label="Bold" icon="format_bold" />],
  ['Tooltip', (M) => <M.Tooltip title="Delete"><M.IconButton icon="delete" /></M.Tooltip>],
  ['Tooltip abierto', (M) => <M.Tooltip title="Delete" open><M.Button>Del</M.Button></M.Tooltip>],
  ['Typography', (M) => <M.Typography variant="h4">Title</M.Typography>],
  // Autocomplete
  ['Autocomplete', (M) => <M.Autocomplete label="Country" options={COUNTRIES} name="country" />],
  ['Autocomplete con valor', (M) => <M.Autocomplete label="Country" options={COUNTRIES} defaultValue="pe" />],
  ['Autocomplete múltiple', (M) => (
    <M.Autocomplete label="Countries" multiple options={COUNTRIES} defaultValue={['co', 'mx']} limitTags={1} name="countries" />
  )],
  ['Autocomplete abierto', (M) => <M.Autocomplete label="Country" options={COUNTRIES} open />],
  // DateTimePicker y alias
  ['DateTimePicker', (M) => <M.DateTimePicker label="Meeting" />],
  ['DateTimePicker con valor', (M) => <M.DateTimePicker label="Meeting" defaultValue="2026-10-20 10:30" />],
  ['DateTimePicker abierto', (M) => <M.DateTimePicker label="Meeting" open defaultValue="2026-10-20 10:30" />],
  ['DateTimePicker modal abierto', (M) => <M.DateTimePicker label="Meeting" display="modal" open defaultValue="2026-10-20 10:30" />],
  ['DatePicker', (M) => <M.DatePicker label="Date" defaultValue="2026-10-20" minDate="2026-01-01" maxDate="2027-12-31" />],
  ['TimePicker', (M) => <M.TimePicker label="Time" defaultValue="10:30" />],
  ['TimePicker reloj', (M) => <M.TimePicker label="Time" timeView="dial" ampm />],
  ['DateRangePicker', (M) => <M.DateRangePicker label="Stay" />],
  ['DateTimeRangePicker', (M) => <M.DateTimeRangePicker label="Window" />],
  ['StaticDatePicker', (M) => <M.StaticDatePicker label="Date" defaultValue="2026-10-20" />],
  ['StaticTimePicker', (M) => <M.StaticTimePicker label="Time" defaultValue="10:30" />],
  ['StaticDateTimePicker', (M) => <M.StaticDateTimePicker label="When" defaultValue="2026-10-20 10:30" />],
  ['StaticDateRangePicker', (M) => <M.StaticDateRangePicker label="Range" />],
  ['DateCalendar', (M) => <M.DateCalendar defaultValue={FIXED_DATE} />],
  ['DateCalendar sin valor (hoy)', (M) => <M.DateCalendar />],
  ['TimeView', (M) => <M.TimeView value={FIXED_DATE} onChange={noop} />],
];

/** Componentes con ids (useId) o estado inicial que se hidratan en el cliente. */
const HYDRATION_CASES = [
  'ThemeProvider', 'MaterixProvider', 'Accordion', 'AccordionGroup', 'Alert', 'AppBar', 'Avatar', 'AvatarGroup',
  'Backdrop', 'Badge', 'Breadcrumbs', 'ButtonGroup', 'Card', 'Checkbox', 'Chip', 'Dialog', 'Drawer temporal',
  'Drawer permanente', 'Drawer responsive', 'FormControl', 'List', 'Menu', 'NativeSelect', 'Pagination', 'Popover', 'LinearProgress',
  'RadioGroup', 'Rating', 'Select', 'SkeletonRegion', 'Slider', 'Slider rango', 'Snackbar', 'SpeedDial',
  'Stepper', 'MobileStepper', 'useStepper + StepperButton + StepPanel', 'Switch', 'Table', 'TablePagination',
  'Tabs', 'TextField', 'TextField completo', 'TextField multiline', 'ToggleButtonGroup', 'Tooltip', 'Typography',
  // Overlays abiertos desde el primer render (Portal vacío en servidor y en el primer render del cliente).
  'Dialog abierto', 'Drawer abierto', 'Menu abierto', 'Popover abierto', 'Select abierto', 'Snackbar abierto',
  'Backdrop abierto', 'SpeedDial abierto', 'Tooltip abierto', 'SnackbarProvider', 'I18nProvider', 'ThemeScript',
  // Autocomplete y pickers
  'Autocomplete', 'Autocomplete con valor', 'Autocomplete múltiple', 'Autocomplete abierto',
  'DateTimePicker', 'DateTimePicker con valor', 'DateTimePicker abierto', 'DateTimePicker modal abierto', 'DatePicker',
  'TimePicker', 'TimePicker reloj', 'DateRangePicker', 'DateTimeRangePicker', 'StaticDatePicker', 'StaticTimePicker',
  'StaticDateTimePicker', 'StaticDateRangePicker', 'DateCalendar', 'DateCalendar sin valor (hoy)', 'TimeView',
];

const casesByName = new Map(SSR_CASES);

/** Resultado del render en servidor por caso. */
const serverHtml = new Map<string, string>();
const serverErrors = new Map<string, string>();
const serverConsole = new Map<string, string[]>();

/** Globales que se pisan aunque Node ya los tenga (p. ej. `navigator` en Node 21+). */
const FORCED_GLOBALS = ['window', 'self', 'document', 'navigator', 'location', 'history', 'localStorage', 'sessionStorage'];
const installedKeys: string[] = [];
let dom: JSDOMInstance | null = null;

/** Instala un JSDOM en el global (equivalente mínimo al entorno jsdom de vitest). */
const installDom = async () => {
  const { JSDOM } = (await import(/* @vite-ignore */ JSDOM_MODULE)) as { JSDOM: JSDOMConstructor };
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
  const win = dom.window as unknown as Record<string, unknown>;
  const g = globalThis as Record<string, unknown>;
  const define = (key: string, value: unknown) => {
    try {
      Object.defineProperty(g, key, { configurable: true, writable: true, value });
      if (!installedKeys.includes(key)) installedKeys.push(key);
    } catch {
      /* propiedad no configurable */
    }
  };
  for (const key of Object.getOwnPropertyNames(win)) {
    if (key in g && !FORCED_GLOBALS.includes(key)) continue;
    const raw = win[key];
    define(key, typeof raw === 'function' && /^[a-z]/.test(key) ? (raw as (...args: unknown[]) => unknown).bind(win) : raw);
  }
  for (const key of FORCED_GLOBALS) define(key, key === 'window' || key === 'self' ? win : win[key]);
  // jsdom no implementa matchMedia ni ResizeObserver.
  const matchMedia = (query: string) => ({
    matches: false, media: query, onchange: null, addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
  });
  win.matchMedia = matchMedia;
  define('matchMedia', matchMedia);
  if (!g.ResizeObserver) define('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  define('IS_REACT_ACT_ENVIRONMENT', true);
};

/** Retira el JSDOM instalado. */
const uninstallDom = () => {
  const g = globalThis as Record<string, unknown>;
  for (const key of installedKeys.splice(0)) delete g[key];
  dom?.window.close();
  dom = null;
};

describe('SSR (entorno node, sin window/document)', () => {
  beforeAll(async () => {
    expect(typeof window, 'entorno node real').toBe('undefined');
    expect(typeof document).toBe('undefined');
    const { renderToString } = await import('react-dom/server');
    const M = (await import('../src/index')) as Lib;
    const originalError = console.error;
    for (const [name, build] of SSR_CASES) {
      const logged: string[] = [];
      console.error = (...args: unknown[]) => logged.push(args.map(String).join(' '));
      try {
        serverHtml.set(name, renderToString(build(M)));
      } catch (error) {
        serverErrors.set(name, error instanceof Error ? `${error.name}: ${error.message}` : String(error));
      } finally {
        console.error = originalError;
      }
      serverConsole.set(name, logged);
    }
  });

  it.each(SSR_CASES.map(([name]) => name))('%s renderiza sin errores en el servidor', (name) => {
    expect(serverErrors.get(name), 'excepción durante renderToString (¿acceso a window/document?)').toBeUndefined();
    expect(serverConsole.get(name), 'console.error durante renderToString').toEqual([]);
    expect(typeof serverHtml.get(name)).toBe('string');
  });

  it('los overlays abiertos no portan nada en el servidor (sin contenido fuera de su sitio)', () => {
    // Portal no renderiza en el servidor: su contenido no debe aparecer en el HTML.
    expect(serverHtml.get('Portal')).toBe('');
    for (const name of ['Dialog abierto', 'Drawer abierto', 'Menu abierto', 'Popover abierto', 'Snackbar abierto', 'Backdrop abierto', 'Tooltip abierto', 'Autocomplete abierto', 'DateTimePicker abierto', 'DateTimePicker modal abierto']) {
      expect(serverErrors.get(name), `${name}: excepción en servidor`).toBeUndefined();
    }
  });
});

describe('Hidratación (hydrateRoot sobre el HTML del servidor)', () => {
  let M: Lib;
  let hydrateRoot: typeof import('react-dom/client').hydrateRoot;
  let act: typeof import('react').act;

  beforeAll(async () => {
    await installDom();
    vi.resetModules();
    M = (await import('../src/index')) as Lib;
    ({ hydrateRoot } = await import('react-dom/client'));
    ({ act } = await import('react'));
  });

  afterAll(() => {
    uninstallDom();
  });

  it.each(HYDRATION_CASES)('%s hidrata sin mismatch', async (name) => {
    const html = serverHtml.get(name);
    expect(html, `${name}: no hay HTML de servidor`).toBeTypeOf('string');
    const build = casesByName.get(name)!;
    const container = document.createElement('div');
    container.innerHTML = html!;
    document.body.appendChild(container);

    const problems: string[] = [];
    const spy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      problems.push(args.map(String).join(' ').slice(0, 400));
    });
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, build(M), {
          onRecoverableError: (error) => problems.push(`recoverable: ${String((error as Error)?.message ?? error).slice(0, 400)}`),
        });
      });
    } finally {
      spy.mockRestore();
    }
    const mismatches = problems.filter((p) => /hydrat|did not match|didn't match|server rendered|recoverable/i.test(p));
    expect(mismatches, `${name}: avisos de hidratación`).toEqual([]);
    await act(async () => root?.unmount());
    container.remove();
  });

  it('ThemeProvider con preferencia guardada (localStorage) hidrata sin mismatch', async () => {
    localStorage.setItem('mtx-theme', 'dark');
    const container = document.createElement('div');
    container.innerHTML = serverHtml.get('ThemeProvider')!;
    document.body.appendChild(container);
    const problems: string[] = [];
    const spy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => problems.push(args.map(String).join(' ')));
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, casesByName.get('ThemeProvider')!(M), {
          onRecoverableError: (error) => problems.push(`recoverable: ${String((error as Error)?.message ?? error)}`),
        });
      });
      expect(problems.filter((p) => /hydrat|match|recoverable/i.test(p))).toEqual([]);
      expect(document.documentElement.getAttribute('data-mtx-theme'), 'aplica la preferencia tras hidratar').toBe('dark');
    } finally {
      spy.mockRestore();
      localStorage.removeItem('mtx-theme');
      await act(async () => root?.unmount());
      container.remove();
    }
  });
});
