'use client';
/**
 * Alert de Materix UI: mensaje breve con severidad, icono, título, acción y cierre (patrón `Alert` de MUI).
 */
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/alert.css';
import { cx, mtxClasses, prefersReducedMotion, useControlled, useEventCallback } from '../../core';
import { useT } from '../../i18n';
import { AlertTitle } from './AlertTitle';

/** Severidades de la alerta. */
export type AlertSeverity = 'success' | 'info' | 'warning' | 'error';
/** Variantes visuales. */
export type AlertVariant = 'standard' | 'filled' | 'outlined';

/** Propiedades de {@link Alert}. */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Severidad: color e icono (`data-severity`, por defecto `success`). */
  severity?: AlertSeverity;
  /** Variante: `standard` (por defecto), `filled` u `outlined`. */
  variant?: AlertVariant;
  /** Título en negrita sobre el mensaje (`data-title`); equivale a un `<AlertTitle>`. */
  title?: ReactNode;
  /** Icono propio (nodo o nombre de Material Icons); `false` lo oculta (`data-icon="false"`). */
  icon?: ReactNode | false;
  /** Acción a la derecha del mensaje (p. ej. un botón "Deshacer"). */
  action?: ReactNode;
  /** Muestra el botón de cierre sin `onClose` (`data-dismissible`). */
  dismissible?: boolean;
  /** Clic en el botón de cierre; su presencia muestra el botón. */
  onClose?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  /** Tras el fundido de cierre, con la alerta ya oculta (equivale a `mtx:alert:close`). */
  onClosed?: () => void;
  /** Al volver a mostrarse una alerta cerrada (equivale a `mtx:alert:open`). */
  onOpen?: () => void;
  /** Visibilidad controlada. */
  open?: boolean;
  /** Visibilidad inicial no controlada (por defecto `true`). */
  defaultOpen?: boolean;
  /** Nombre accesible del botón de cierre (`data-close-label`); por defecto i18n `alert.close`. */
  closeLabel?: string;
  /** Idioma de los textos propios (prevalece sobre el `I18nProvider`). */
  locale?: string;
  /** Mensaje. */
  children?: ReactNode;
}

/** Trazados SVG de los iconos por severidad (iguales a vanilla). */
const ICON_PATHS: Record<AlertSeverity, string> = {
  success: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
  info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  error: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
};

/** Duración del fundido de cierre (ms), como vanilla. */
export const ALERT_CLOSE_DURATION = 200;
const TRANSITION = 'opacity 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1)';

/** Fase de visibilidad: sin estilos, cerrando, cerrada, reapareciendo o reaparecida. */
type Phase = 'idle' | 'closing' | 'closed' | 'entering' | 'entered';

const PHASE_STYLES: Record<Phase, CSSProperties | undefined> = {
  idle: undefined,
  closing: { opacity: 0, transform: 'translateY(-4px)', transition: TRANSITION },
  closed: { opacity: 0, transform: 'translateY(-4px)', transition: TRANSITION },
  entering: { opacity: 0, transform: 'translateY(-4px)', transition: TRANSITION },
  entered: { opacity: 1, transform: 'translateY(0)', transition: TRANSITION },
};

/**
 * Alerta: informa del resultado de una acción o del estado del sistema sin interrumpir.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  const {
    severity = 'success',
    variant = 'standard',
    title,
    icon,
    action,
    dismissible = false,
    onClose,
    onClosed,
    onOpen,
    open: openProp,
    defaultOpen = true,
    closeLabel,
    locale,
    children,
    className,
    style,
    role = 'alert',
    hidden,
    ...rest
  } = props;

  const t = useT('alert', locale);
  const [open, setOpen] = useControlled({ controlled: openProp, default: defaultOpen, name: 'Alert', state: 'open' });
  const [phase, setPhase] = useState<Phase>(open ? 'idle' : 'closed');
  const prevOpen = useRef(open);
  const handleClosed = useEventCallback(() => onClosed?.());
  const handleOpened = useEventCallback(() => onOpen?.());

  useEffect(() => {
    if (prevOpen.current === open) return undefined;
    prevOpen.current = open;
    if (!open) {
      if (prefersReducedMotion()) {
        setPhase('closed');
        handleClosed();
        return undefined;
      }
      setPhase('closing');
      const timer = setTimeout(() => {
        setPhase('closed');
        handleClosed();
      }, ALERT_CLOSE_DURATION);
      // Desmontada o reabierta durante el fundido: no emite el cierre.
      return () => clearTimeout(timer);
    }
    setPhase('entering');
    handleOpened();
    const frame = requestAnimationFrame(() => setPhase('entered'));
    return () => cancelAnimationFrame(frame);
  }, [open, handleClosed, handleOpened]);

  const handleCloseClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    onClose?.(event);
  };

  const showClose = dismissible || Boolean(onClose);
  const phaseStyle = PHASE_STYLES[phase];

  let iconNode: ReactNode = null;
  if (icon !== false) {
    if (icon == null || icon === true) {
      iconNode = (
        <span className="mtx-alert__icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" focusable="false" aria-hidden="true">
            <path d={ICON_PATHS[severity] ?? ICON_PATHS.success} />
          </svg>
        </span>
      );
    } else if (typeof icon === 'string') {
      iconNode = (
        <span className="mtx-alert__icon">
          <span className="material-icons" aria-hidden="true">
            {icon}
          </span>
        </span>
      );
    } else {
      iconNode = <span className="mtx-alert__icon">{icon}</span>;
    }
  }

  return (
    <div
      ref={ref}
      role={role}
      className={cx(mtxClasses('alert', { severity, variant }), className)}
      style={phaseStyle ? { ...style, ...phaseStyle } : style}
      hidden={phase === 'closed' || hidden}
      {...rest}
    >
      {iconNode}
      <div className="mtx-alert__message">
        {title != null && title !== false ? <AlertTitle>{title}</AlertTitle> : null}
        {children}
      </div>
      {action}
      {showClose ? (
        <button
          type="button"
          className="mtx-alert__close"
          aria-label={closeLabel ?? t('close', null, 'Close')}
          onClick={handleCloseClick}
        >
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
});
