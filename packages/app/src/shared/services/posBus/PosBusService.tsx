import {AttributeValueInterface} from '@momentum-xyz/sdk';
import {
  Client,
  loadClientWorker,
  MsgType,
  PosbusEvent,
  PosbusPort
  // posbus
} from '@momentum-xyz/posbus-client';
import {
  Event3dEmitter,
  ObjectTransformInterface,
  TransformNoScaleInterface
} from '@momentum-xyz/core';

// import {VoiceChatActionEnum} from 'api/enums';
import {PosBusEventEmitter} from 'core/constants';
import {
  PosBusMessageTypeEnum
  // PosBusNotificationEnum
} from 'core/enums';
import {
  // PosBusVibeMessageType,
  // PosBusHigh5MessageType,
  // PosBusMessageStatusType,
  // PosBusInviteMessageType,
  // PosBusBroadcastMessageType,
  // PosBusGatheringMessageType,
  // PosBusCommunicationMessageType,
  // PosBusEmojiMessageType,
  // PosBusMegamojiMessageType,
  // PosBusFlyWithMeType,
  // PosBusScreenShareMessageType,
  PosBusMiroStateMessageType as PosBusAttributeMessageType
  // PosBusFlyToMeType,
  // PosBusVoiceChatActionMessageType,
  // PosBusVoiceChatUserMessageType
} from 'core/types';
import {appVariables} from 'api/constants';

class PosBusService {
  private static main = new PosBusService();

  private _subscribedAttributeTypeTopics: Set<string>;

  private client: Client | null = null;
  private port: PosbusPort | null = null;
  private static userId: string;

  public static init(token: string, userId: string) {
    console.log('PosBusService init', token, userId);
    const workerUrl = new URL('@momentum-xyz/posbus-client/worker.mjs', import.meta.url);
    const wasmUrl = new URL('@momentum-xyz/posbus-client/pbc.wasm', import.meta.url);
    this.userId = userId;
    loadClientWorker(workerUrl, wasmUrl)
      .then((client) => {
        console.log('PosBus client loaded', client);
        this.main.client = client;
        return client.connect(`${appVariables.BE_URL}/posbus`, token, userId).then((port) => {
          this.main.port = port;
          port.onmessage = PosBusService.handleIncomingMessage;
          // port.onmessage = (event) => {
          //   console.log('PosBus message', event.data);
          // };
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static isConnected() {
    return !!(this.main.client && this.main.port);
  }

  static teleportToWorld(worldId: string) {
    if (this.main.client && this.main.port) {
      this.main.client.teleport(worldId);
    }
  }

  static handleIncomingMessage(message: PosbusEvent) {
    if (!Array.isArray(message.data)) {
      console.error('WTF: PosBus message data is not an array', message);
      return;
    }
    const [type, data] = message.data;

    switch (type) {
      case MsgType.SIGNAL: {
        console.log('PosBus signal', data);
        const {value} = data;
        if (value === 7) {
          PosBusEventEmitter.emit('posbus-connected');
        } else if (value === 8) {
          PosBusEventEmitter.emit('posbus-disconnected');
        }
        break;
      }

      case MsgType.ADD_USERS: {
        console.log('PosBus add_users', data);
        const {users} = data;
        for (const user of users) {
          Event3dEmitter.emit('UserAdded', user);
        }
        break;
      }

      case MsgType.REMOVE_USERS: {
        console.log('PosBus remove_users', data);
        const {users} = data;
        for (const user of users) {
          Event3dEmitter.emit('UserRemoved', user);
        }
        break;
      }

      case MsgType.USERS_TRANSFORM_LIST: {
        console.log('PosBus users_transform_list', data);
        const {value: users} = data;

        Event3dEmitter.emit('UsersTransformChanged', users);
        break;
      }

      case MsgType.OBJECT_TRANSFORM: {
        console.log('PosBus object_transform', data);
        const {id, object_transform} = data;
        Event3dEmitter.emit('ObjectTransform', id, object_transform);
        break;
      }

      // TODO add to MsgType
      case 'set_object_data' as MsgType: {
        console.log('PosBus set_object_data', data);

        const {id, entries} = data as any;
        if (entries?.texture?.name) {
          Event3dEmitter.emit('ObjectTextureChanged', {
            objectId: entries.texture.name,
            hash: id
            // textureColor
          });
        }
        break;
      }

      case MsgType.SET_WORLD: {
        console.log('Handle posbus set_world', data);
        Event3dEmitter.emit('SetWorld', data, PosBusService.userId);

        break;
      }

      case MsgType.ADD_OBJECTS: {
        console.log('Handle posbus message add_object', message.data);

        const {objects} = data;
        for (const object of objects) {
          console.log('Add object', object);
          // TODO we should equalise these
          Event3dEmitter.emit('ObjectCreated', {
            ...object,
            asset_3d_id: object.asset_type,
            transform: {
              ...object.transform
            }
          });
        }
        break;
      }

      case MsgType.LOCK_OBJECT: {
        console.log('Temp ignore posbus message lock_object', message.data);
        // console.log('Handle posbus message lock_object', message.data);
        // const {id, state} = data;
        // Event3dEmitter.emit('ObjectLockChanged', id, state === 1);
        break;
      }

      case MsgType.LOCK_OBJECT_RESPONSE: {
        console.log('Temp ignore posbus message lock_object_response', message.data);
        // console.log('Handle posbus message lock_object_response', message.data);
        // const {
        //   id,
        //   result
        //   //  owner - todo check if we need this
        // } = data;
        // Event3dEmitter.emit('ObjectLockChanged', id, result === 1);
        break;
      }

      default:
        console.log('Unhandled posbus message', message.data);
    }
  }

  static sendMyTransform(transform: TransformNoScaleInterface) {
    this.main.port?.postMessage([MsgType.MY_TRANSFORM, transform]);
  }

  static sendObjectTransform(objectId: string, transform: ObjectTransformInterface) {
    this.main.port?.postMessage([
      MsgType.OBJECT_TRANSFORM,
      {id: objectId, object_transform: transform}
    ]);
  }

  static requestObjectLock(objectId: string, lock: boolean) {
    if (this.isConnected()) {
      this.main.port?.postMessage([
        MsgType.LOCK_OBJECT,
        {
          id: objectId
        }
      ]);
    }
    // else what? TODO
  }

  public get subscribedAttributeTypeTopics(): Set<string> {
    return this._subscribedAttributeTypeTopics;
  }

  private constructor() {
    this._subscribedAttributeTypeTopics = new Set();
  }

  static subscribe(topic: string) {
    this.main._subscribedAttributeTypeTopics.add(topic);
  }

  static unsubscribe(topic: string) {
    this.main._subscribedAttributeTypeTopics.delete(topic);
  }

  // static handleIncomingVibe(message: PosBusVibeMessageType) {
  //   const {count, type} = message;
  //   PosBusEventEmitter.emit('user-vibed', type, count);
  // }

  // static handleIncomingInvite(message: PosBusInviteMessageType) {
  //   const {spaceId, sender, uiTypeId, uiTypeName} = message;
  //   PosBusEventEmitter.emit('space-invite', spaceId, sender.id, sender.name, uiTypeId, uiTypeName);
  // }

  // static handleIncomingBroadcast(message: PosBusBroadcastMessageType) {
  //   PosBusEventEmitter.emit('broadcast', message);
  // }

  // static handleScreenShareStart(message: PosBusScreenShareMessageType) {
  //   PosBusEventEmitter.emit('screen-share', message);
  // }

  // static handleVoiceChatAction(message: PosBusVoiceChatActionMessageType) {
  //   const voiceChatActionAttributeValue = message.data.value;

  //   if (
  //     message.type !== PosBusMessageTypeEnum.ATTRIBUTE_CHANGED ||
  //     !voiceChatActionAttributeValue
  //   ) {
  //     return;
  //   }

  //   switch (voiceChatActionAttributeValue.action) {
  //     case VoiceChatActionEnum.KICK_USER:
  //       PosBusEventEmitter.emit('voice-chat-kick-user', voiceChatActionAttributeValue.userId);
  //       break;
  //     case VoiceChatActionEnum.MUTE_USER:
  //       PosBusEventEmitter.emit('voice-chat-mute-user', voiceChatActionAttributeValue.userId);
  //       break;
  //     case VoiceChatActionEnum.MUTE_ALL:
  //       PosBusEventEmitter.emit('voice-chat-mute-all', voiceChatActionAttributeValue.userId);
  //       break;
  //   }
  // }

  // static handleVoiceChatUser(message: PosBusVoiceChatUserMessageType) {
  //   const userId = message.data.value?.userId;

  //   if (!userId || message.type !== PosBusMessageTypeEnum.ATTRIBUTE_CHANGED) {
  //     return;
  //   }

  //   if (message.data.value?.joined === true) {
  //     PosBusEventEmitter.emit('voice-chat-user-joined', userId);
  //   } else if (message.data.value?.joined === false) {
  //     PosBusEventEmitter.emit('voice-chat-user-left', userId);
  //   }
  // }

  // static handleIncomingCommunication(message: PosBusCommunicationMessageType) {
  //   switch (message.action) {
  //     case 'kick':
  //       PosBusEventEmitter.emit('meeting-kick', message.spaceId);
  //       break;
  //     case 'mute':
  //       PosBusEventEmitter.emit('meeting-mute');
  //       break;
  //     case 'mute-all':
  //       PosBusEventEmitter.emit('meeting-mute-all', message.moderatorId);
  //       break;
  //     default:
  //   }
  // }

  // static handleIncomingStageMode(message: any) {
  //   console.log(message);
  // }

  // static handleIncomingHigh5(message: PosBusHigh5MessageType) {
  //   PosBusEventEmitter.emit('high-five', message.senderId, message.message);
  // }

  // static handleIncomingEmoji(message: PosBusEmojiMessageType) {
  //   PosBusEventEmitter.emit('emoji', message);
  // }

  // static handleIncomingMegamoji(message: PosBusMegamojiMessageType) {
  //   PosBusEventEmitter.emit('megamoji', message.url);
  // }

  // static handleNotifyGathering(message: PosBusGatheringMessageType) {
  //   PosBusEventEmitter.emit('notify-gathering-start', message);
  // }

  // static handlePosBusMessage(message: PosBusMessageStatusType) {
  //   switch (message.status) {
  //     case 'connected':
  //       PosBusEventEmitter.emit('posbus-connected');
  //       break;
  //     case 'disconnected':
  //       PosBusEventEmitter.emit('posbus-disconnected');
  //       break;
  //     default:
  //       console.warn('Unknown posbus status', message.status);
  //   }
  // }

  // static handleFlyToMeMessage(message: PosBusFlyToMeType) {
  //   PosBusEventEmitter.emit('fly-to-me', message.spaceId, message.pilot, message.pilot_name);
  // }

  // static handleStartFlyWithMeMessage(message: PosBusFlyWithMeType) {
  //   PosBusEventEmitter.emit('start-fly-with-me', message.spaceId, message.pilot, message.pilotName);
  // }

  // static handleStopFlyWithMeMessage(message: PosBusFlyWithMeType) {
  //   PosBusEventEmitter.emit('stop-fly-with-me', message.spaceId, message.pilot, message.pilotName);
  // }

  static handleSpaceAttributeMessage(target: string, message: PosBusAttributeMessageType) {
    switch (message.type) {
      case PosBusMessageTypeEnum.ATTRIBUTE_CHANGED:
        PosBusEventEmitter.emit(
          'space-attribute-changed',
          target,
          message.data.attribute_name,
          message.data.value as AttributeValueInterface
        );
        break;
      case PosBusMessageTypeEnum.ATTRIBUTE_REMOVED:
        PosBusEventEmitter.emit('space-attribute-removed', target, message.data.attribute_name);
        break;
      case PosBusMessageTypeEnum.SUB_ATTRIBUTE_CHANGED:
        if (!message.data.sub_name) {
          return;
        }
        PosBusEventEmitter.emit(
          'space-attribute-item-changed',
          target,
          message.data.attribute_name,
          message.data.sub_name,
          message.data.value
        );
        break;
      case PosBusMessageTypeEnum.SUB_ATTRIBUTE_REMOVED:
        if (!message.data.sub_name) {
          return;
        }
        PosBusEventEmitter.emit(
          'space-attribute-item-removed',
          target,
          message.data.attribute_name,
          message.data.sub_name
        );
        break;
    }
  }

  // static handleRelayMessage(target: string, message: unknown): void {
  //   console.log('[unity message]:', target, message);

  //   if (this.main.subscribedAttributeTypeTopics.has(target)) {
  //     this.handleSpaceAttributeMessage(target, message as PosBusAttributeMessageType);
  //     return;
  //   }

  //   // TODO: Old stuff, refactor to new controller attributes system
  //   switch (target) {
  //     case 'notify-gathering-start':
  //       this.handleNotifyGathering(message as PosBusGatheringMessageType);
  //       break;
  //     case 'vibe':
  //       this.handleIncomingVibe(message as PosBusVibeMessageType);
  //       break;
  //     case 'invite':
  //       this.handleIncomingInvite(message as PosBusInviteMessageType);
  //       break;
  //     case 'meeting':
  //       this.handleIncomingCommunication(message as PosBusCommunicationMessageType);
  //       break;
  //     case 'broadcast':
  //       this.handleIncomingBroadcast(message as PosBusBroadcastMessageType);
  //       break;
  //     case 'stage':
  //       this.handleIncomingStageMode(message);
  //       break;
  //     case 'high5':
  //       this.handleIncomingHigh5(message as PosBusHigh5MessageType);
  //       break;
  //     case 'emoji':
  //       this.handleIncomingEmoji(message as PosBusEmojiMessageType);
  //       break;
  //     case 'megamoji':
  //       this.handleIncomingMegamoji(message as PosBusMegamojiMessageType);
  //       break;
  //     case 'posbus':
  //       this.handlePosBusMessage(message as PosBusMessageStatusType);
  //       break;
  //     case 'fly-to-me':
  //       this.handleFlyToMeMessage(message as PosBusFlyToMeType);
  //       break;
  //     case 'start-fly-with-me':
  //       this.handleStartFlyWithMeMessage(message as PosBusFlyWithMeType);
  //       break;
  //     case 'stop-fly-with-me':
  //       this.handleStopFlyWithMeMessage(message as PosBusFlyWithMeType);
  //       break;
  //     case 'screen-share':
  //       this.handleScreenShareStart(message as PosBusScreenShareMessageType);
  //       break;
  //     case 'voice-chat-action':
  //       this.handleVoiceChatAction(message as PosBusVoiceChatActionMessageType);
  //       break;
  //     case 'voice-chat-user':
  //       this.handleVoiceChatUser(message as PosBusVoiceChatUserMessageType);
  //       break;
  //     default:
  //       console.debug('Unknown relay message type', target);
  //   }
  // }

  // static handleSimpleNotification(kind: PosBusNotificationEnum, flag: number, message: string) {
  //   console.log('[unity simple message]:', kind, flag, message);
  //   if (kind === PosBusNotificationEnum.TextMessage) {
  //     PosBusEventEmitter.emit('simple-notification', message);
  //   } else if (kind === PosBusNotificationEnum.HighFive) {
  //     PosBusEventEmitter.emit('high-five-sent', message);
  //   }
  // }
}

export default PosBusService;
