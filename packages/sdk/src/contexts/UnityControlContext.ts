import {createContext} from 'react';

import {UnityControlInterface} from '../interfaces';

export const UnityControlContext = createContext<UnityControlInterface>({
  takeKeyboardControl: () => {
    console.warn('takeKeyboardControl: UnityControlContext not provided');
  },
  releaseKeyboardControl: () => {
    console.warn('releaseKeyboardControl: UnityControlContext not provided');
  },

  pause: () => {
    console.warn('pause: UnityControlContext not provided');
  },
  resume: () => {
    console.warn('resume: UnityControlContext not provided');
  },
  isPaused: () => {
    console.warn('isPaused: UnityControlContext not provided');
    return false;
  }
});

export const UnityControlContextProvider = UnityControlContext.Provider;
