import type { LocaleDictionary } from '../types';

/**
 * Diccionario oficial en Español (es) para Materix UI.
 */
const es: LocaleDictionary = {
  code: 'es',
  name: 'Español',

  drawer: {
    close: 'Cerrar'
  },

  appBar: {
    openNavigation: 'Abrir navegación'
  },

  dateTimePicker: {
    today: 'Hoy',
    clear: 'Borrar',
    cancel: 'Cancelar',
    ok: 'Aceptar',
    date: 'Fecha',
    time: 'Hora',
    dates: 'Fechas',
    start: 'Inicio',
    end: 'Fin',
    startTimeHeader: 'HORA DE INICIO',
    endTimeHeader: 'HORA DE FIN',
    selectRange: 'Selecciona rango',
    selectEnd: 'Selecciona fin',
    enterTime: 'Ingresar hora',
    selectTime: 'Seleccionar hora',
    hour: 'Hora',
    minute: 'Minuto',
    second: 'Segundo',
    switchToClock: 'Cambiar a reloj radial',
    switchToKeyboard: 'Introducir hora con teclado',
    chooseDate: 'Elegir fecha',
    chooseTime: 'Elegir hora',
    chooseDateTime: 'Elegir fecha y hora',
    chooseDateRange: 'Elegir rango de fechas',
    chooseWithValue: '{label}, seleccionado: {value}',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    chooseMonth: 'Elegir mes',
    chooseYear: 'Elegir año',
    monthViewLabel: '{month}, elegir mes',
    yearViewLabel: '{year}, elegir año',
    selectHours: 'Seleccionar horas',
    selectMinutes: 'Seleccionar minutos',
    selectSeconds: 'Seleccionar segundos',
    hoursValue: '{value} horas',
    minutesValue: '{value} minutos',
    secondsValue: '{value} segundos',
    months: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthsShort: [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ],
    weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  },

  select: {
    searchPlaceholder: 'Buscar…',
    searchAriaLabel: 'Buscar opciones',
    noneResultsText: 'No se encontraron resultados para "{0}"',
    selectAllText: 'Seleccionar todo',
    deselectAllText: 'Deseleccionar todo',
    selectedCountSingular: '{0} seleccionado',
    selectedCountPlural: '{0} seleccionados'
  },

  table: {
    selectAllRows: 'Seleccionar todas las filas',
    selectRow: 'Seleccionar {0}',
    selectedCountSingular: '{0} seleccionado',
    selectedCountPlural: '{0} seleccionados',
    toolbar: 'Barra de herramientas de la tabla',
    scrollRegion: 'Tabla desplazable'
  },

  tablePagination: {
    rowsPerPage: 'Filas por página:',
    all: 'Todas',
    of: 'de',
    moreThan: 'más de',
    firstPage: 'Primera página',
    previousPage: 'Página anterior',
    nextPage: 'Página siguiente',
    lastPage: 'Última página'
  },

  breadcrumbs: {
    label: 'ruta de navegación',
    showPath: 'Mostrar ruta'
  },

  pagination: {
    label: 'navegación de paginación',
    page: 'página {page}',
    goToPage: 'Ir a la página {page}',
    first: 'Ir a la primera página',
    previous: 'Ir a la página anterior',
    next: 'Ir a la página siguiente',
    last: 'Ir a la última página'
  },

  textField: {
    showPassword: 'Mostrar contraseña',
    counterWords: '{count} palabras',
    counterWordsShort: '{value} pal.',
    counterCharsShort: '{value} car.'
  },

  dialog: {
    cancel: 'Cancelar',
    ok: 'Aceptar'
  },

  stepper: {
    optional: 'Opcional',
    step: 'Paso {n} de {total}',
    completed: 'completado',
    error: 'error',
    back: 'Atrás',
    next: 'Siguiente',
    fraction: '{n} / {total}'
  },

  progress: {
    loading: 'Cargando'
  },

  alert: {
    close: 'Cerrar'
  },

  chip: {
    delete: 'Eliminar'
  },

  autocomplete: {
    clear: 'Borrar',
    open: 'Abrir',
    close: 'Cerrar',
    noOptions: 'Sin opciones',
    loading: 'Cargando…',
    more: '+{0}',
    result: '1 resultado disponible',
    results: '{0} resultados disponibles',
    invalid: 'Selecciona una opción de la lista.'
  },

  avatarGroup: {
    surplus: '{count} más'
  },

  speedDial: {
    actions: 'Acciones'
  },

  card: {
    actions: 'Acciones'
  },

  slider: {
    minimum: 'Mínimo',
    maximum: 'Máximo',
    thumbLabel: '{label}: {thumb}'
  },

  rating: {
    star: '{value} estrella',
    stars: '{value} estrellas',
    empty: 'Sin valoración',
    readOnly: 'Valoración: {value} de {max}'
  },

  theme: {
    toggle: 'Tema oscuro',
    switchToDark: 'Cambiar a tema oscuro',
    switchToLight: 'Cambiar a tema claro',
    light: 'Tema claro',
    dark: 'Tema oscuro',
    system: 'Tema del sistema'
  }
};

export default es;
