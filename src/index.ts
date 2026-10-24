/**
 * Materix UI para React: punto de entrada (barrel).
 * Lo mantiene el orquestador al cerrar cada oleada; los agentes no lo editan.
 */

// Tema e internacionalización
export * from './theme';
export * from './i18n';

// Utilidades públicas del núcleo (transiciones, portal, clases)
export { Portal, Fade, Collapse, Grow, useTransition, cx } from './core';
export type { Placement } from './core';

// Componentes (se añaden al cerrar cada oleada)
export * from './components/alert';
export * from './components/avatar';
export * from './components/badge';
export * from './components/button';
export * from './components/button-group';
export * from './components/card';
export * from './components/checkbox';
export * from './components/chip';
export * from './components/container';
export * from './components/css-baseline';
export * from './components/divider';
export * from './components/fab';
export * from './components/form-helper-text';
export * from './components/grid';
export * from './components/icon-button';
export * from './components/link';
export * from './components/list';
export * from './components/paper';
export * from './components/progress';
export * from './components/radio';
export * from './components/skeleton';
export * from './components/stack';
export * from './components/switch';
export * from './components/typography';
export * from './components/accordion';
export * from './components/app-bar';
export * from './components/backdrop';
export * from './components/breadcrumbs';
export * from './components/native-select';
export * from './components/pagination';
export * from './components/rating';
export * from './components/slider';
export * from './components/snackbar';
export * from './components/stepper';
export * from './components/tabs';
export * from './components/toggle-button';
export * from './components/dialog';
export * from './components/drawer';
export * from './components/menu';
export * from './components/popover';
export * from './components/select';
export * from './components/table';
export * from './components/tooltip';
export * from './components/speed-dial';
export * from './components/text-field';
export * from './components/autocomplete';
export * from './components/date-time-picker';
