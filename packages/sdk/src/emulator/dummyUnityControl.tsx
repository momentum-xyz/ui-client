import {useEffect} from 'react';

import {UnityControlInterface} from '../interfaces';

export const dummyUnityControl: UnityControlInterface & {_isPaused: boolean} = {
  _isPaused: false,
  takeKeyboardControl() {
    console.log('DummyUnityControl.takeKeyboardControl');
  },
  releaseKeyboardControl() {
    console.log('DummyUnityControl.releaseKeyboardControl');
  },
  AutoTakeKeyboardControl() {
    useEffect(() => {
      console.log('DummyUnityControl.AutoTakeKeyboardControl');
      dummyUnityControl.takeKeyboardControl();
      return () => {
        console.log('DummyUnityControl.AutoTakeKeyboardControl - release');
        dummyUnityControl.releaseKeyboardControl();
      };
    }, []);
    return null;
  },
  pause() {
    console.log('DummyUnityControl.pause');
    this._isPaused = true;
  },
  resume() {
    console.log('DummyUnityControl.resume');
    this._isPaused = true;
  },
  isPaused() {
    return this._isPaused;
  },
  AutoPauseUnity() {
    useEffect(() => {
      console.log('DummyUnityControl.AutoPauseUnity');
      dummyUnityControl.pause();
      return () => {
        console.log('DummyUnityControl.AutoPauseUnity - resume');
        dummyUnityControl.resume();
      };
    }, []);
    return null;
  }
};
