import {UnityContext} from 'react-unity-webgl';

import {getUnityPosition} from 'core/utils';
import {UnityEventEmitter} from 'core/constants';
import {PosBusNotificationEnum} from 'core/enums';
import {UnityApiInterface} from 'core/interfaces';

export class UnityService {
  unityApi?: UnityApiInterface;
  unityContext?: UnityContext;

  getCurrentWorld?: () => void;
  getUserPosition?: () => void;
  getIntState?: (spaceId: string, key: string) => number;
  setIntState?: (spaceId: string, key: string, value: number) => void;
  getStrState?: (spaceId: string, key: string) => string;
  setStrState?: (spaceId: string, key: string, value: string) => void;
  triggerInteractionMsg?: (type: number, targetId: string, flag: number, message: string) => void;

  constructor() {
    this.unityContext = undefined;
    this.unityApi = undefined;
    this.getCurrentWorld = undefined;
    this.getUserPosition = undefined;
    this.getIntState = undefined;
    this.setIntState = undefined;
    this.getStrState = undefined;
    this.setStrState = undefined;
    this.triggerInteractionMsg = undefined;
  }

  initialize(unityContext: UnityContext) {
    this.unityContext = unityContext;

    this.unityContext.on('Error', (message: string) => {
      console.info('UnityContext error', message);
      UnityEventEmitter.emit('Error', message);
    });

    this.unityContext.on('MomentumLoaded', () => {
      this.unityApi = this.unityContext?.unityInstance?.Module.UnityAPI;

      this.getCurrentWorld = function () {
        return this.unityApi?.getCurrentWorld();
      };

      this.getUserPosition = function () {
        return this.unityApi?.getUserPosition();
      };

      this.triggerInteractionMsg = function (
        kind: number,
        guid: string,
        flag: number,
        message: string
      ) {
        this.unityApi?.triggerInteractionMsg(kind, guid, flag, message);
      };

      UnityEventEmitter.emit('MomentumLoaded');
    });

    this.unityContext.on('TeleportReady', () => {
      UnityEventEmitter.emit('TeleportReady');
    });

    this.unityContext.on('ExterminateUnity', (topic: string) => {
      UnityEventEmitter.emit('ExterminateUnity', topic);
    });

    this.unityContext.on('ClickEvent', (identifier: string) => {
      const [type, id] = identifier.split('|');
      if (type === 'video') {
        UnityEventEmitter.emit('ClickEventVideo', id);
      } else {
        UnityEventEmitter.emit('ClickEventDashboard', id);
      }
    });

    this.unityContext.on('InvalidToken', () => {
      UnityEventEmitter.emit('InvalidToken');
    });

    this.unityContext.on('ProfileHasBeenClicked', (identifier: string) => {
      const [id, rawLocation] = identifier.split('|');
      UnityEventEmitter.emit('ProfileClickEvent', id, getUnityPosition(rawLocation));
    });
  }

  setAuthToken(token?: string) {
    this.unityApi?.setToken(token);
  }

  pause() {
    document.body.classList.remove('unity-active');
    this.unityApi?.pauseUnity(true);
  }

  resume() {
    document.body.classList.add('unity-active');
    this.unityApi?.pauseUnity(false);
  }

  pauseSound() {
    this.unityApi?.controlSound(false);
  }

  continueSound() {
    this.unityApi?.controlSound(true);
  }

  toggleAllSound(muted: boolean) {
    this.unityApi?.controlSound(!muted);
  }

  lookAtWisp(userId: string) {
    this.unityApi?.lookAtWisp(userId);
  }

  teleportToSpace(id: string) {
    this.resume();
    this.unityApi?.teleportToSpace(id);
  }

  teleportToVector3(vector: any) {
    this.resume();
    this.unityApi?.teleportToVector3(vector);
  }

  teleportToUser(id: string) {
    this.resume();
    this.unityApi?.teleportToUser(id);
  }

  toggleMiniMap() {
    this.unityApi?.toggleMinimap();
  }

  setKeyboardControl(value: boolean) {
    this.unityApi?.controlKeyboard(value);
  }

  setSoundEffectVolume(value: string) {
    this.unityApi?.controlVolume(value);
  }

  relayMessageHandler(handler: (target: string, msg: any) => void) {
    this.unityContext?.on('RelayMessage', (target: string, message: string) => {
      let msgJSON;
      try {
        msgJSON = JSON.parse(message);
      } catch (e) {
        console.error(`No valid JSON in relay message "${message}"`);
        msgJSON = '';
      }
      try {
        handler(target, msgJSON);
      } catch (e) {
        console.error('Error in RelayMessage handler.', e);
      }
    });
  }

  // @ts-ignore: refactoring
  simpleNotificationHandler(handler: (kind: PosBusNotificationEnum, flag, msg) => void) {
    this.unityContext?.on('SimpleNotification', (kind: number, flag: number, message: string) => {
      handler(kind, flag, message);
    });
  }
}

export default new UnityService();
