export interface UnityControlInterface {
  takeKeyboardControl: () => void;
  releaseKeyboardControl: () => void;

  pause: () => void;
  resume: () => void;
  isPaused: () => boolean;
}
