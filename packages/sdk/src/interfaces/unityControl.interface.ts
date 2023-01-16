import React from 'react';

export interface UnityControlInterface {
  takeKeyboardControl: () => void;
  releaseKeyboardControl: () => void;
  AutoTakeKeyboardControl: React.FC;

  pause: () => void;
  resume: () => void;
  isPaused: () => boolean;
  AutoPauseUnity: React.FC;
}
