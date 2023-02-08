import {UnityContext} from 'react-unity-webgl';

import {getUnityPosition} from 'core/utils';
import {UnityEventEmitter, UnityTargetTypeEnum} from 'core/constants';
import {UnityApiInterface} from 'core/interfaces';
import {PosBusService} from 'shared/services';
import {GizmoTypeEnum, PosBusEventEnum} from 'core/enums';
import {PosBusEmojiMessageType} from 'core/types';

export class UnityService {
  unityApi?: UnityApiInterface;
  unityContext?: UnityContext;
  isPaused = false;
  isBuildMode = false;

  getCurrentWorld?: () => void;
  getUserPosition?: () => void;
  getUserRotation?: () => void;
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
    this.getUserRotation = undefined;
    this.getIntState = undefined;
    this.setIntState = undefined;
    this.getStrState = undefined;
    this.setStrState = undefined;
    this.triggerInteractionMsg = undefined;
  }

  initialize(unityContext: UnityContext) {
    this.unityContext = unityContext;

    /* Unity Events */

    this.unityContext.on('MomentumLoaded', () => {
      this.unityApi = this.unityContext?.unityInstance?.Module.UnityAPI;

      this.getCurrentWorld = function () {
        return this.unityApi?.getCurrentWorld();
      };

      this.getUserPosition = function () {
        return this.unityApi?.getUserPosition();
      };

      this.getUserRotation = function () {
        return this.unityApi?.getUserRotation();
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

    this.unityContext.on('HideMinimap', () => {
      UnityEventEmitter.emit('HideMinimap');
    });

    this.unityContext.on('ExterminateUnity', (topic: string) => {
      UnityEventEmitter.emit('ExterminateUnity', topic);
    });

    this.unityContext.on('ClickEvent', (identifier: string) => {
      console.log('UnityService ClickEvent', identifier);
      const [label, id] = identifier.split('|');

      if (this.isBuildMode) {
        UnityEventEmitter.emit('EditObjectEvent', id);
        return;
      }

      UnityEventEmitter.emit('ClickObjectEvent', id, label);
    });

    this.unityContext.on('ProfileHasBeenClicked', (identifier: string) => {
      const [id, rawLocation] = identifier.split('|');
      UnityEventEmitter.emit('ProfileClickEvent', id, getUnityPosition(rawLocation));
    });

    this.unityContext.on('InvalidToken', () => {
      UnityEventEmitter.emit('InvalidToken');
    });

    this.unityContext.on('Error', (message: string) => {
      console.info('UnityContext error', message);
      UnityEventEmitter.emit('Error', message);
    });

    /* PosBus Events */

    this.unityContext?.on('RelayMessage', (target: string, message: string) => {
      let msgJSON;
      try {
        msgJSON = JSON.parse(message);
      } catch (e) {
        console.error(`No valid JSON in relay message "${message}"`);
        msgJSON = '';
      }
      try {
        PosBusService.handleRelayMessage(target, msgJSON);
      } catch (e) {
        console.error('Error in RelayMessage handler.', e);
      }
    });

    this.unityContext?.on('SimpleNotification', (kind: number, flag: number, message: string) => {
      PosBusService.handleSimpleNotification(kind, flag, message);
    });
  }

  setAuthToken(token?: string) {
    this.unityApi?.setToken(token);
  }

  setAddressablesURL(url?: string) {
    this.unityApi?.setAddressablesURL(url);
  }

  setTargetWorldId(id?: string) {
    this.unityApi?.setTargetWorldId(id);
  }

  triggerTeleport(domain?: string, worldId?: string) {
    console.log(domain);
    console.log(worldId);
    this.unityApi?.triggerTeleport(domain, worldId);
  }

  pause() {
    document.body.classList.remove('unity-active');
    this.unityApi?.pauseUnity(true);
    this.isPaused = true;
  }

  resume() {
    document.body.classList.add('unity-active');
    this.unityApi?.pauseUnity(false);
    this.isPaused = false;
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

  sendHighFive(receiverId: string) {
    try {
      this.unityApi?.triggerInteractionMsg?.(PosBusEventEnum.HighFive, receiverId, 0, '');
    } catch (error) {
      console.error(error);
    }
  }

  sendEmoji({
    emojiUrl,
    emojiId,
    userUUID,
    userAvatarSrc,
    userName,
    targetType = UnityTargetTypeEnum.USER
  }: {
    emojiId: string;
    emojiUrl: string;
    userUUID: string;
    userAvatarSrc: string;
    userName: string;
    targetType?: UnityTargetTypeEnum;
  }) {
    try {
      const topic = 'emoji';

      const data: PosBusEmojiMessageType = {
        targetType,
        targetID: userUUID,
        urlAvatar: userAvatarSrc,
        nickname: userName,
        url: emojiUrl,
        emojiID: emojiId
      };
      this.unityApi?.relayMessage(topic, JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
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

  showMinimap() {
    this.unityApi?.showMinimap();
  }

  hideMinimap() {
    this.unityApi?.hideMinimap();
  }

  setKeyboardControl(value: boolean) {
    this.unityApi?.controlKeyboard(value);
  }

  setSoundEffectVolume(value: string) {
    this.unityApi?.controlVolume(value);
  }

  startFlyWithMe(pilotId: string) {
    this.unityApi?.startFlyWithMe(pilotId);
  }

  disengageFlyWithMe() {
    this.unityApi?.disengageFlyWithMe();
  }

  changeSkybox(skyboxId: string) {
    this.unityApi?.changeSkybox(skyboxId);
  }

  toggleBuildMode() {
    this.unityApi?.toggleBuildMode();
    this.isBuildMode = !this.isBuildMode;
    console.log('Toggle Build Mode to', this.isBuildMode);
  }

  undo() {
    this.unityApi?.undoActionWorldBuilder();
  }

  redo() {
    this.unityApi?.redoActionWorldBuilder();
  }

  colorPickedPreview(objectId: string, colorHex: string) {
    this.unityApi?.colorPickedPreview(objectId, colorHex);
  }

  changeGizmoType(type: GizmoTypeEnum) {
    switch (type) {
      case GizmoTypeEnum.POSITION:
        this.unityApi?.setPositionGizmoWorldBuilder();
        break;
      case GizmoTypeEnum.ROTATION:
        this.unityApi?.setRotationGizmoWorldBuilder();
        break;
      case GizmoTypeEnum.SCALE:
        this.unityApi?.setScaleGizmoWorldBuilder();
        break;
    }
  }

  leaveSpace(id: string) {
    try {
      this.unityApi?.triggerInteractionMsg?.(PosBusEventEnum.LeftSpace, id, 0, '');
    } catch (error) {
      console.info(error);
    }
  }
}

export default new UnityService();
