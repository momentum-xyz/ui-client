import {UnityContext} from 'react-unity-webgl';

import {EventEmitter} from 'core/utils';

import {useUnityStore} from '../../store/unityStore';
import {Position} from '../type/World';

export type UnityEvents = {
  MomentumLoaded: () => void;
  TeleportReady: () => void;
  ExterminateUnity: (topic: string) => void;
  PublishMessage: (topic: string, message: string) => void;
  SubscribeToTopic: (topic: string) => void;
  UnsubscribeFromTopic: (topic: string) => void;
  Screen1ClickEvent: (id: string) => void;
  Screen2ClickEvent: (id: string) => void;
  Screen3ClickEvent: (id: string) => void;
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

export class UnityService {
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
      // @ts-ignore
      this.getCurrentWorld = unityContext?.unityInstance?.Module?.cwrap?.(
        'extGetCurrentWorld',
        'string',
        []
      );
      // @ts-ignore
      this.getUserPosition = unityContext?.unityInstance?.Module?.cwrap?.(
        'extGetUserPosition',
        'string',
        []
      );

      // @ts-ignore
      this.getIntState = unityContext?.unityInstance?.Module.cwrap('extGetIntState', 'number', [
        'string',
        'string'
      ]);
      // @ts-ignore
      this.setIntState = unityContext?.unityInstance?.Module.cwrap('extSetIntState', null, [
        'string',
        'string',
        'number'
      ]);
      // @ts-ignore
      this.getStrState = unityContext?.unityInstance?.Module.cwrap('extGetStrState', 'string', [
        'string',
        'string'
      ]);
      // @ts-ignore
      this.setStrState = unityContext?.unityInstance?.Module.cwrap('extSetStrState', null, [
        'string',
        'string',
        'string'
      ]);
      // @ts-ignore
      this.triggerInteractionMsg = unityContext?.unityInstance?.Module.cwrap(
        'extTriggerInteractionMsg',
        null,
        ['int', 'string', 'int', 'string']
      );

      UnityEventEmitter.emit('MomentumLoaded');

      if (useUnityStore.getState().muted) {
        this.unityContext?.send('UnityManager', 'turnAllSoundOff');
      } else {
        this.unityContext?.send('UnityManager', 'turnAllSoundOn');
      }
    });

    this.unityContext.on('TeleportReady', () => {
      UnityEventEmitter.emit('TeleportReady');
    });

    // websockets proxy

    this.unityContext.on('PublishMessage', (payload: string) => {
      const [topic, message] = payload.split('|');

      UnityEventEmitter.emit('PublishMessage', topic, message);
    });

    this.unityContext.on('SubscribeToTopic', (topic: string) => {
      UnityEventEmitter.emit('SubscribeToTopic', topic);
    });

    this.unityContext.on('UnsubscribeFromTopic', (topic: string) => {
      UnityEventEmitter.emit('UnsubscribeFromTopic', topic);
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

    //deprecated by ClickEvent
    // this.unityContext.on('Screen1ClickEvent', (identifier: string) => {
    //   //console.info('Screen1ClickEvent', identifier);
    //   // const [type, id] = identifier.split('|');
    //   //UnityEventEmitter.emit('Screen1ClickEvent', id);
    // });
    //
    // //deprecated by ClickEvent
    // this.unityContext.on('Screen2ClickEvent', (identifier: string) => {
    //   //console.info('Screen2ClickEvent', identifier);
    //   // const [type, id] = identifier.split('|');
    //   //UnityEventEmitter.emit('Screen2ClickEvent',  id);
    // });
    //
    // //deprecated by ClickEvent
    // this.unityContext.on('Screen3ClickEvent', (identifier: string) => {
    //   //console.info('Screen3ClickEvent', identifier);
    //   // const [type, id] = identifier.split('|');
    //   //UnityEventEmitter.emit('Screen3ClickEvent', id);
    // });
    //
    // this.unityContext.on('TeamPlasmaClickEvent', (identifier: string) => {
    //   //console.info('PlasmaClickEvent', identifier);
    //   // const [type, id] = identifier.split('|');
    //   //UnityEventEmitter.emit('PlasmaClickEvent', id);
    // });

    this.unityContext.on('ProfileHasBeenClicked', (identifier: string) => {
      console.info('ProfileHasBeenClicked', identifier);
      const [id, rawLocation] = identifier.split('|');
      UnityEventEmitter.emit('ProfileClickEvent', id, stringToPosition(rawLocation));
    });

    // if (process.env.NODE_ENV === 'development')
    //   setTimeout(() => {
    //     UnityEventEmitter.emit('MomentumLoaded');
    //   }, 3000);
    //
    //   setTimeout(() => {
    //     UnityEventEmitter.emit('TeleportReady');
    //   }, 3500);
  }

  setAuthToken(token?: string) {
    this.unityContext?.send('UnityManager', 'setToken', token);
  }

  setOverrideDomain(domain: string) {
    this.unityContext?.send('UnityManager', 'setOverwriteDomain', domain);
  }

  sendWebsocketMessage(message: string) {
    this.unityContext?.send('UnityManager', 'consumeMessage', message);
  }

  pause() {
    document.body.classList.remove('unity-active');
    this.unityContext?.send('UnityManager', 'pauseUnityClient');
  }

  resume() {
    document.body.classList.add('unity-active');
    this.unityContext?.send('UnityManager', 'resumeUnityClient');
  }

  pauseSound() {
    this.unityContext?.send('UnityManager', 'turnAllSoundOff');
  }

  continueSound() {
    const muted = useUnityStore.getState().muted;
    if (!muted) {
      this.unityContext?.send('UnityManager', 'turnAllSoundOn');
    }
  }

  toggleAllSound() {
    const muted = useUnityStore.getState().muted;
    if (muted) this.unityContext?.send('UnityManager', 'turnAllSoundOn');
    else this.unityContext?.send('UnityManager', 'turnAllSoundOff');
    useUnityStore.setState({muted: !muted});
  }

  enableStageMode(spaceId: string) {
    this.setIntState?.(spaceId, 'stagemode', 1);
  }

  disableStageMode(spaceId: string) {
    this.setIntState?.(spaceId, 'stagemode', 0);
  }

  lookAtWisp(userId: string) {
    this.unityContext?.send('UnityManager', 'lookAtWisp', userId);
  }

  teleportToSpace(id) {
    this.resume();
    this.unityContext?.send('UnityManager', 'teleportToSpace', id);
  }

  teleportToVector3(vector) {
    this.resume();
    this.unityContext?.send('UnityManager', 'teleportToVector3', vector);
  }

  teleportToUser(id) {
    this.resume();
    this.unityContext?.send('UnityManager', 'teleportToUser', id);
  }

  toggleMiniMap() {
    this.unityContext?.send('UnityManager', 'toggleMinimap');
  }

  setKeyboardControl(value: boolean) {
    this.unityContext?.send('UnityManager', 'controlKeyboard', value ? 1 : 0);
  }

  setSoundEffectVolume(value: string) {
    this.unityContext?.send('UnityManager', 'setVolume', value);
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

  simpleNotificationHandler(handler: (kind: PosBusNotificationType, flag, msg) => void) {
    this.unityContext?.on('SimpleNotification', (kind: number, flag: number, message: string) => {
      handler(kind, flag, message);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}

export default new UnityService();
