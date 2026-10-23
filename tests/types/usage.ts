// Comprobación de tipos del bundle completo (`npm run types:check`).
import Materix, {
  Button, Dialog, Select, Tabs, Table, Autocomplete, DateTimePicker, DatePicker,
  getInstance, init, initAll, watch, destroy, destroyAll, theme, snackbar, tooltip, skeleton,
  createCircularProgress, computePosition, autoUpdate, i18n, setLocale, t,
  type MtxComponentMap, type Placement, type ThemeMode, type MtxEventDetailMap,
} from 'materix-ui';

const el = document.createElement('button');
const button: Button = new Button(el);
button.setLoading(true);
const loading: boolean = button.loading;
button.disable();
button.destroy();

const dialog = getInstance<Dialog>(document.getElementById('confirm'));
dialog?.open();
dialog?.close();

const typed = init(el, 'select');
const sel: Select | null = typed;
const tabs: MtxComponentMap['tabs'] | null = init(el, 'tabs');
void sel; void tabs; void loading;

initAll();
initAll(document.body);
const observer: MutationObserver = watch(document.body, { destroyOnRemove: true });
observer.disconnect();
const removed: boolean = destroy(el);
const count: number = destroyAll(document.body);
void removed; void count;

const mode: ThemeMode = theme.getMode();
const effective: 'light' | 'dark' = theme.set(mode === 'dark' ? 'light' : 'system', { persist: true });
theme.configure({ persist: 'my-key', query: true });
theme.toggle();
void effective;

snackbar.show('Saved');
snackbar.show({ message: 'Deleted', action: 'Undo', onAction: () => {}, duration: 6000, anchor: 'bottom-center' });
tooltip.show(el, { touch: false });
tooltip.hideAll();
skeleton.set('#card', true);
const spinner: HTMLElement = createCircularProgress({ size: 24, color: 'inherit', decorative: true });
void spinner;

const placement: Placement = 'top-start';
const floating = document.createElement('div');
const pos = computePosition(el, floating, { placement, offset: 8, flip: true, shift: true });
floating.style.left = `${pos.x}px`;
const stop: () => void = autoUpdate(el, floating, () => computePosition(el, floating));
stop();

setLocale('es');
const label: string = t('select', 'noOptions');
i18n.addLocale('fr', { select: { noOptions: 'Aucune option' } });
void label;

// Eventos tipados
el.addEventListener('mtx:tabs:change', (event) => {
  const tab: HTMLElement = event.detail.tab;
  void tab;
});
el.addEventListener('mtx:table:selection-change', (event) => {
  const ids: string[] = event.detail.selected;
  void ids;
});
el.addEventListener('mtx:stepper:change', (event) => {
  if (event.detail.activeStep > 2) event.preventDefault();
});
el.addEventListener('mtx:date-time-picker:change', (event) => {
  const date: Date | null = event.detail.date;
  const picker: DateTimePicker = event.detail.picker;
  void date; void picker;
});
document.addEventListener('mtx:theme:change', (event) => {
  const next: 'light' | 'dark' = event.detail.theme;
  void next;
});
const detail: MtxEventDetailMap['mtx:autocomplete:change'] = { value: 'a', option: null, reason: 'selectOption' };
void detail;

// Objeto por defecto (= global UMD)
Materix.initAll();
const viaDefault = Materix.getInstance<Table>(document.querySelector('table'));
void viaDefault;
const DP: typeof DateTimePicker = DatePicker;
void DP; void Autocomplete;
Materix.theme.toggle();
