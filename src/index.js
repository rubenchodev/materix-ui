/**
 * Materix UI — Punto de entrada de la librería.
 *
 * Importa los estilos globales y expone la API pública de todos los
 * componentes y utilidades. Cada componente se registra automáticamente
 * al importarse (mediante `registerComponent`) y sus estilos se incluyen
 * en el bundle CSS único.
 */

import './styles/tokens.css';
import './styles/base.css';
import './styles/ripple.css';

import {
  registerComponent,
  initAll,
  initElement,
  init,
  getInstance,
  watch,
  destroy,
  destroyAll,
} from './core/registry.js';

import { ComponentBase } from './core/component-base.js';
import { createRipple } from './core/ripple.js';
import { theme } from './core/theme.js';
import {
  i18n,
  getLocale,
  setLocale,
  resetLocale,
  addLocale,
  updateLocale,
  t,
  getComponentLocale
} from './i18n/index.js';

// --- Componentes ---------------------------------------------------------

import { CssBaseline } from './components/css-baseline/css-baseline.js';

import { Typography } from './components/typography/typography.js';
import './components/typography/typography.css';

import { Container } from './components/container/container.js';
import './components/container/container.css';

import { Stack } from './components/stack/stack.js';
import './components/stack/stack.css';

import { Paper } from './components/paper/paper.js';
import './components/paper/paper.css';

import { Accordion, AccordionGroup, AccordionActions } from './components/accordion/accordion.js';
import './components/accordion/accordion.css';

import { Grid } from './components/grid/grid.js';
import './components/grid/grid.css';

import { Divider } from './components/divider/divider.js';
import './components/divider/divider.css';

import { Button } from './components/button/button.js';
import './components/button/button.css';

import { ButtonGroup } from './components/button-group/button-group.js';
import './components/button-group/button-group.css';

import { IconButton } from './components/icon-button/icon-button.js';
import './components/icon-button/icon-button.css';

import { Fab } from './components/fab/fab.js';
import './components/fab/fab.css';

import { SpeedDial } from './components/speed-dial/speed-dial.js';
import './components/speed-dial/speed-dial.css';

import { Link } from './components/link/link.js';
import './components/link/link.css';

import { Avatar, AvatarGroup } from './components/avatar/avatar.js';
import './components/avatar/avatar.css';

import { Badge } from './components/badge/badge.js';
import './components/badge/badge.css';

import { Chip } from './components/chip/chip.js';
import './components/chip/chip.css';

import { Alert } from './components/alert/alert.js';
import './components/alert/alert.css';

import { CircularProgress, LinearProgress, createCircularProgress } from './components/progress/progress.js';
import './components/progress/progress.css';

import { Skeleton, skeleton } from './components/skeleton/skeleton.js';
import './components/skeleton/skeleton.css';

import { Backdrop } from './components/backdrop/backdrop.js';
import './components/backdrop/backdrop.css';

import {
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
} from './components/card/card.js';
import './components/card/card.css';

import { FormHelperText } from './components/form-helper-text/form-helper-text.js';
import './components/form-helper-text/form-helper-text.css';

import { Checkbox } from './components/checkbox/checkbox.js';
import './components/checkbox/checkbox.css';

import { Radio, RadioGroup } from './components/radio/radio.js';
import './components/radio/radio.css';

import { Switch } from './components/switch/switch.js';
import './components/switch/switch.css';

import { ToggleButton, ToggleButtonGroup } from './components/toggle-button/toggle-button.js';
import './components/toggle-button/toggle-button.css';

import { Rating } from './components/rating/rating.js';
import './components/rating/rating.css';

import { Slider } from './components/slider/slider.js';
import './components/slider/slider.css';

import { TextField } from './components/text-field/text-field.js';
import './components/text-field/text-field.css';

import { NativeSelect } from './components/native-select/native-select.js';
import './components/native-select/native-select.css';

import { Select } from './components/select/select.js';
import './components/select/select.css';

import { Autocomplete } from './components/autocomplete/autocomplete.js';
import './components/autocomplete/autocomplete.css';

import {
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
} from './components/list/list.js';
import './components/list/list.css';

import { Menu, MenuItem } from './components/menu/menu.js';
import './components/menu/menu.css';

import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  TableToolbar,
} from './components/table/table.js';
import './components/table/table.css';

import { Tabs, Tab } from './components/tabs/tabs.js';
import './components/tabs/tabs.css';

import { Stepper, MobileStepper } from './components/stepper/stepper.js';
import './components/stepper/stepper.css';

import { Breadcrumbs } from './components/breadcrumbs/breadcrumbs.js';
import './components/breadcrumbs/breadcrumbs.css';

import { Pagination } from './components/pagination/pagination.js';
import './components/pagination/pagination.css';

import { Dialog, DialogActions } from './components/dialog/dialog.js';
import './components/dialog/dialog.css';

import { Drawer } from './components/drawer/drawer.js';
import './components/drawer/drawer.css';

import { AppBar } from './components/app-bar/app-bar.js';
import './components/app-bar/app-bar.css';

import { Snackbar, snackbar, showSnackbar } from './components/snackbar/snackbar.js';
import './components/snackbar/snackbar.css';

import { DateTimePicker } from './components/date-time-picker/date-time-picker.js';
import './components/date-time-picker/date-time-picker.css';

import { computePosition, autoUpdate } from './core/position.js';
import {
  pushLayer,
  removeLayer,
  isTopLayer,
  getTopLayer,
  isInUpperLayer,
  isEscapeHandled,
  markEscapeHandled,
} from './core/layers.js';

/** API de la pila común de capas (Escape cierra solo la superior). */
const layers = {
  push: pushLayer,
  remove: removeLayer,
  isTop: isTopLayer,
  getTop: getTopLayer,
  isInUpper: isInUpperLayer,
  isEscapeHandled,
  markEscapeHandled,
};

import { Tooltip, tooltip } from './components/tooltip/tooltip.js';
import './components/tooltip/tooltip.css';

import { Popover } from './components/popover/popover.js';
import './components/popover/popover.css';

// Utilidades (mtx-d-*, mtx-p-*, mtx-gap-*…): SIEMPRE después de todos los componentes.
import './styles/utilities.css';

/**
 * Objeto público de Materix UI.
 *
 * Permite el uso programático:
 * ```javascript
 * const button = new Materix.Button(element);
 * ```
 */
const Materix = {
  // Utilidades
  registerComponent,
  initAll,
  initElement,
  init,
  getInstance,
  watch,
  destroy,
  destroyAll,
  ComponentBase,
  createRipple,
  theme,
  // Internacionalización (i18n)
  i18n,
  getLocale,
  setLocale,
  resetLocale,
  addLocale,
  updateLocale,
  t,
  getComponentLocale,
  // Componentes
  CssBaseline,
  Typography,
  Container,
  Stack,
  Paper,
  Accordion,
  AccordionGroup,
  AccordionActions,
  Grid,
  Divider,
  Button,
  IconButton,
  Fab,
  SpeedDial,
  Link,
  Avatar,
  AvatarGroup,
  Badge,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  createCircularProgress,
  ButtonGroup,
  Skeleton,
  skeleton,
  Backdrop,
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  FormHelperText,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Rating,
  Slider,
  TextField,
  NativeSelect,
  Select,
  Autocomplete,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  TableToolbar,
  Tabs,
  Tab,
  Stepper,
  MobileStepper,
  Breadcrumbs,
  Pagination,
  Dialog,
  DialogActions,
  Drawer,
  AppBar,
  Snackbar,
  snackbar,
  showSnackbar,
  DateTimePicker,
  DatePicker: DateTimePicker,
  TimePicker: DateTimePicker,
  DateRangePicker: DateTimePicker,
  DateTimeRangePicker: DateTimePicker,
  computePosition,
  autoUpdate,
  layers,
  Tooltip,
  tooltip,
  Popover,
};

export const DatePicker = DateTimePicker;
export const TimePicker = DateTimePicker;
export const DateRangePicker = DateTimePicker;
export const DateTimeRangePicker = DateTimePicker;

export {
  registerComponent,
  initAll,
  initElement,
  init,
  getInstance,
  watch,
  destroy,
  destroyAll,
  ComponentBase,
  createRipple,
  theme,
  i18n,
  getLocale,
  setLocale,
  resetLocale,
  addLocale,
  updateLocale,
  t,
  getComponentLocale,
  CssBaseline,
  Typography,
  Container,
  Stack,
  Paper,
  Accordion,
  AccordionGroup,
  AccordionActions,
  Grid,
  Divider,
  Button,
  IconButton,
  Fab,
  SpeedDial,
  Link,
  Avatar,
  AvatarGroup,
  Badge,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  createCircularProgress,
  ButtonGroup,
  Skeleton,
  skeleton,
  Backdrop,
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  FormHelperText,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Rating,
  Slider,
  TextField,
  NativeSelect,
  Select,
  Autocomplete,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  TableToolbar,
  Tabs,
  Tab,
  Stepper,
  MobileStepper,
  Breadcrumbs,
  Pagination,
  Dialog,
  DialogActions,
  Drawer,
  AppBar,
  Snackbar,
  snackbar,
  showSnackbar,
  DateTimePicker,
  computePosition,
  autoUpdate,
  layers,
  Tooltip,
  tooltip,
  Popover,
};

export default Materix;

// Inicialización automática al cargar el DOM.
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll());
  } else {
    initAll();
  }
}
