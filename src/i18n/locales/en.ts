import type { BaseDictionaryShape } from '../types';

/**
 * Diccionario oficial en Inglés (en) para Materix UI.
 * Idioma por defecto de la librería.
 */
const en = {
  code: 'en',
  name: 'English',

  drawer: {
    close: 'Close'
  },

  appBar: {
    openNavigation: 'Open navigation',
    moreOptions: 'More options'
  },

  dateTimePicker: {
    today: 'Today',
    clear: 'Clear',
    cancel: 'Cancel',
    ok: 'OK',
    date: 'Date',
    time: 'Time',
    dates: 'Dates',
    start: 'Start',
    end: 'End',
    startTimeHeader: 'START TIME',
    endTimeHeader: 'END TIME',
    selectRange: 'Select range',
    selectEnd: 'Select end date',
    enterTime: 'Enter time',
    selectTime: 'Select time',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    switchToClock: 'Switch to clock view',
    switchToKeyboard: 'Enter time with keyboard',
    chooseDate: 'Choose date',
    chooseTime: 'Choose time',
    chooseDateTime: 'Choose date and time',
    chooseDateRange: 'Choose date range',
    chooseWithValue: '{label}, selected: {value}',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    chooseMonth: 'Choose month',
    chooseYear: 'Choose year',
    monthViewLabel: '{month}, choose month',
    yearViewLabel: '{year}, choose year',
    selectHours: 'Select hours',
    selectMinutes: 'Select minutes',
    selectSeconds: 'Select seconds',
    hoursValue: '{value} hours',
    minutesValue: '{value} minutes',
    secondsValue: '{value} seconds',
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    monthsShort: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },

  select: {
    searchPlaceholder: 'Search…',
    searchAriaLabel: 'Search options',
    noneResultsText: 'No results found for "{0}"',
    selectAllText: 'Select all',
    deselectAllText: 'Deselect all',
    selectedCountSingular: '{0} selected',
    selectedCountPlural: '{0} selected'
  },

  table: {
    selectAllRows: 'Select all rows',
    selectRow: 'Select {0}',
    selectedCountSingular: '{0} selected',
    selectedCountPlural: '{0} selected',
    toolbar: 'Table toolbar',
    scrollRegion: 'Scrollable table'
  },

  tablePagination: {
    rowsPerPage: 'Rows per page:',
    all: 'All',
    of: 'of',
    moreThan: 'more than',
    firstPage: 'First page',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    lastPage: 'Last page'
  },

  breadcrumbs: {
    label: 'breadcrumb',
    showPath: 'Show path'
  },

  pagination: {
    label: 'pagination navigation',
    page: 'page {page}',
    goToPage: 'Go to page {page}',
    first: 'Go to first page',
    previous: 'Go to previous page',
    next: 'Go to next page',
    last: 'Go to last page'
  },

  textField: {
    showPassword: 'Show password',
    counterWords: '{count} words',
    counterWordsShort: '{value} words',
    counterCharsShort: '{value} chars'
  },

  dialog: {
    cancel: 'Cancel',
    ok: 'OK'
  },

  stepper: {
    optional: 'Optional',
    step: 'Step {n} of {total}',
    completed: 'completed',
    error: 'error',
    back: 'Back',
    next: 'Next',
    fraction: '{n} / {total}'
  },

  progress: {
    loading: 'Loading'
  },

  alert: {
    close: 'Close'
  },

  chip: {
    delete: 'Delete'
  },

  autocomplete: {
    clear: 'Clear',
    open: 'Open',
    close: 'Close',
    noOptions: 'No options',
    loading: 'Loading…',
    more: '+{0}',
    result: '1 result available',
    results: '{0} results available',
    invalid: 'Select an option from the list.'
  },

  avatarGroup: {
    surplus: '{count} more'
  },

  speedDial: {
    actions: 'Actions'
  },

  card: {
    actions: 'Actions'
  },

  slider: {
    minimum: 'Minimum',
    maximum: 'Maximum',
    thumbLabel: '{label}: {thumb}'
  },

  rating: {
    star: '{value} Star',
    stars: '{value} Stars',
    empty: 'Empty',
    readOnly: 'Rated {value} out of {max}'
  },

  theme: {
    toggle: 'Dark theme',
    switchToDark: 'Switch to dark theme',
    switchToLight: 'Switch to light theme',
    light: 'Light theme',
    dark: 'Dark theme',
    system: 'System theme'
  }
} satisfies BaseDictionaryShape;

export default en;
