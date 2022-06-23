import {UnityContext} from 'react-unity-webgl';

import {EventEmitter} from 'core/utils';

import {useUnityStore} from '../../store/unityStore';
import {Position} from '../type/Position';

export type UnityEvents = {
  MomentumLoaded: () => void;
  TeleportReady: () => void;
  ExterminateUnity: (topic: string) => void;
  ClickEventDashboard: (id: string) => void;
  ClickEventVideo: (id: string) => void;
  PlasmaClickEvent: (id: string) => void;
  ProfileClickEvent: (id: string, position: Position) => void;
  Error: (message: string) => void;
};

export enum PosBusInteractionType {
  None = 0,
  Wow = 1,
  HighFive = 2,
  EnteredSpace = 3,
  LeftSpace = 4,
  TriggerStake = 5
}

export enum PosBusNotificationType {
  None = 0,
  Wow = 1,
  HighFive = 2,
  StageModeAccept = 10,
  StageModeInvitation = 11,
  StageModeSet = 12,
  StageModeStageJoin = 13,
  StageModeStageRequest = 14,
  StageModeStageDeclined = 15,
  TextMessage = 500,
  Relay = 501,
  Generic = 999,
  Legacy = 1000
}

export const UnityEventEmitter = new EventEmitter<UnityEvents>();

const stringToPosition = (posString: string): Position => {
  const [x, y, z] = posString.split(':').map(Number);
  return {x, y, z};
};

interface UnityAPI {
  toggleMinimap(): any;

  teleportToUser(userGuid: string): any;

  teleportToSpace(spaceGuid: string): any;

  teleportToVector3(position: string): any;

  lookAtWisp(userGuid: string): any;

  controlKeyboard(unityIsInControl: boolean): any;

  controlVolume(gain: string): any;

  controlSound(isOn: boolean): any;

  pauseUnity(isPaused: boolean): any;

  setToken(token?: string): any;

  getCurrentWorld(): string;

  getUserPosition(): string;

  triggerInteractionMsg(kind: number, guid: string, flag: number, message: string): any;
}

export class UnityService {
  unityApi?: UnityAPI;
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

    // Error handling
    this.unityContext.on('Error', (message: string) => {
      console.info('unitycontext error', message);
      UnityEventEmitter.emit('Error', message);
    });

    // Game state

    this.unityContext.on('MomentumLoaded', () => {
      this.unityApi = this.unityContext?.unityInstance?.Module.UnityAPI;

      // @ts-ignore
      this.getCurrentWorld = function () {
        return this.unityApi?.getCurrentWorld();
      };
      // @ts-ignore
      this.getUserPosition = function () {
        return this.unityApi?.getUserPosition();
      };

      // @ts-ignore
      this.triggerInteractionMsg = function (
        kind: number,
        guid: string,
        flag: number,
        message: string
      ) {
        this.unityApi?.triggerInteractionMsg(kind, guid, flag, message);
      };

      UnityEventEmitter.emit('MomentumLoaded');

      this.unityApi?.controlSound(useUnityStore.getState().muted);
    });

    this.unityContext.on('TeleportReady', () => {
      UnityEventEmitter.emit('TeleportReady');
    });

    this.unityContext.on('ExterminateUnity', (topic: string) => {
      UnityEventEmitter.emit('ExterminateUnity', topic);
    });

    // Interactions
    this.unityContext.on('ClickEvent', (identifier: string) => {
      console.info('ClickEvent', identifier);
      const [type, id] = identifier.split('|');

      if (type === 'video') {
        UnityEventEmitter.emit('ClickEventVideo', id);
      } else {
        UnityEventEmitter.emit('ClickEventDashboard', id);
      }
    });

    // InvalidToken
    this.unityContext.on('InvalidToken', () => {
      console.info('Got Invalid Token from Unity');
    });

    this.unityContext.on('ProfileHasBeenClicked', (identifier: string) => {
      console.info('ProfileHasBeenClicked', identifier);
      const [id, rawLocation] = identifier.split('|');
      UnityEventEmitter.emit('ProfileClickEvent', id, stringToPosition(rawLocation));
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
    const muted = useUnityStore.getState().muted;
    if (!muted) {
      this.unityApi?.controlSound(true);
    }
  }

  toggleAllSound() {
    const muted = useUnityStore.getState().muted;
    this.unityApi?.controlSound(!muted);
    useUnityStore.setState({muted: !muted});
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
  simpleNotificationHandler(handler: (kind: PosBusNotificationType, flag, msg) => void) {
    this.unityContext?.on('SimpleNotification', (kind: number, flag: number, message: string) => {
      handler(kind, flag, message);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}

export default new UnityService();
