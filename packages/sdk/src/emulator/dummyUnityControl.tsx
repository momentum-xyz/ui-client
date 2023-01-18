import {UnityControlInterface} from '../interfaces';

export const dummyUnityControl: UnityControlInterface & {_isPaused: boolean} = {
  _isPaused: false,
  takeKeyboardControl() {
    console.log('DummyUnityControl.takeKeyboardControl');
  },
  releaseKeyboardControl() {
    console.log('DummyUnityControl.releaseKeyboardControl');
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
  }
};
