/**
 * Núcleo de Materix UI para React: hooks, capas, foco, posicionamiento, ripple y transiciones.
 */
export { cx, mtxClasses } from './classes';
export type { ClassValue, ClassModifiers } from './classes';

export { canUseDOM, isDev, ownerDocument, prefersReducedMotion, resolveTarget } from './dom';
export type { ElementTarget } from './dom';

export {
  useControlled,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
  setRef,
  usePrefersReducedMotion,
} from './hooks';
export type { UseControlledOptions } from './hooks';

export { useRipple, RIPPLE_DURATION, RIPPLE_REMOVE_FALLBACK } from './ripple';
export type { UseRippleOptions, UseRippleResult, RippleHandlers } from './ripple';

export { Portal } from './portal';
export type { PortalProps } from './portal';

export {
  useLayer,
  pushLayer,
  removeLayer,
  refreshLayerStack,
  isTopLayer,
  getTopLayer,
  hasLayer,
  layerCount,
  isInUpperLayer,
  markEscapeHandled,
  isEscapeHandled,
} from './layers';
export type { LayerKind, LayerNodes, LayerOptions, LayerStackItem, UseLayerOptions, UseLayerResult } from './layers';

export { useScrollLock, addModal, removeModal, isTopModal, hasOpenModal } from './scroll-lock';

export {
  useFocusTrap,
  getFocusable,
  getTabbable,
  resolveFocusTarget,
  focusFirst,
  trapTab,
} from './focus-trap';
export type { UseFocusTrapOptions } from './focus-trap';

export { useClickAway, onClickAway, SYNTHETIC_MOUSE_WINDOW } from './click-away';
export type { ClickAwayTargets, UseClickAwayOptions } from './click-away';

export { computePosition, positionDropdown, autoUpdate, parsePlacement, isRtl } from './position';
export type {
  Align,
  ComputePositionOptions,
  ComputePositionResult,
  Placement,
  PositionAnchor,
  PositionDropdownOptions,
  PositionDropdownResult,
  Side,
  VirtualElement,
} from './position';

export { usePosition } from './use-position';
export type { UsePositionOptions, UsePositionResult, UsePositionDropdownOptions } from './use-position';

export {
  Fade,
  Collapse,
  Grow,
  useTransition,
  getTimeout,
  TRANSITION_DURATION,
  EASING_ENTER,
  EASING_EXIT,
  EASING_STANDARD,
} from './transition';
export type {
  GrowProps,
  TransitionProps,
  TransitionStatus,
  TransitionTimeout,
  UseTransitionOptions,
  UseTransitionResult,
} from './transition';
