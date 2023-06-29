import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {
  Client,
  loadClientWorker,
  MsgType,
  PosbusEvent,
  PosbusPort
} from '@momentum-xyz/posbus-client';
import {
  ActivityUpdateEnum,
  Event3dEmitter,
  ObjectTransformInterface,
  TransformNoScaleInterface
} from '@momentum-xyz/core';
import {AttributeValueChanged} from '@momentum-xyz/posbus-client/dist/build/posbus';

import {PosBusEventEmitter} from 'core/constants';
import {appVariables} from 'api/constants';
import {PluginIdEnum} from 'api/enums';

class PosBusService {
  private static main = new PosBusService();

  private _subscribedAttributeTypeTopics: Set<string>;

  private client: Client | null = null;
  private port: PosbusPort | null = null;
  private static userId: string;

  public static attachNextReceivedObjectToCamera = false;

  public static init(token: string, userId: string) {
    console.log('PosBusService init', token, userId);
    this.userId = userId;
    if (this.main.client) {
      this.main.client.disconnect();
      this.connect(this.main.client, token, userId).catch((err) => {
        console.error(err);
      });
    } else {
      const workerUrl = new URL('@momentum-xyz/posbus-client/worker.mjs', import.meta.url);
      const wasmUrl = new URL('@momentum-xyz/posbus-client/pbc.wasm', import.meta.url);
      loadClientWorker(workerUrl, wasmUrl)
        .then((client) => {
          console.log('PosBus client loaded', client);
          this.main.client = client;
          return this.connect(client, token, userId);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  static connect(client: Client, token: string, userId: string) {
    return client.connect(`${appVariables.BE_URL}/posbus`, token, userId).then((port) => {
      this.main.port = port;
      port.onmessage = (msg) => PosBusService.handleIncomingMessage(msg);
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

  static leaveWorld() {
    this.main.port?.postMessage([
      MsgType.SIGNAL,
      {
        // FIXME: Use const from posbus
        // value: SignalLeaveWorld
        value: 5
      }
    ]);
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

      case MsgType.OBJECT_DATA: {
        console.log('PosBus set_object_data', data);

        const {id, entries} = data as any;
        if (entries?.texture) {
          Object.entries(entries.texture).forEach(([label, hash]: any) => {
            Event3dEmitter.emit('ObjectTextureChanged', {
              objectId: id,
              label,
              hash
            });
          });
        }
        if (entries?.string?.object_color) {
          Event3dEmitter.emit('ObjectTextureChanged', {
            objectId: id,
            label: 'object_color',
            hash: entries.string.object_color
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
          console.log(
            'Add object',
            object,
            'Attach to camera',
            PosBusService.attachNextReceivedObjectToCamera
          );
          Event3dEmitter.emit(
            'AddObject',
            {
              ...object,
              asset_3d_id: object.asset_type
            },
            PosBusService.attachNextReceivedObjectToCamera
          );

          PosBusService.attachNextReceivedObjectToCamera = false;
        }
        break;
      }

      case MsgType.REMOVE_OBJECTS: {
        console.log('Handle posbus message remove_object', message.data);
        const {objects} = data;
        for (const objectId of objects) {
          Event3dEmitter.emit('RemoveObject', objectId);
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

      case MsgType.ATTRIBUTE_VALUE_CHANGED: {
        console.debug('[PosBus Msg] ATTRIBUTE_VALUE_CHANGED: ', data);
        switch (data.plugin_id) {
          case PluginIdEnum.CORE:
            this.handleCoreAttributeChange(data);
            break;

          default:
            // TODO: pass to plugins
            console.debug('[PosBus Msg]: ATTRIBUTE_VALUE_CHANGED: unhandled message');
            break;
        }
        break;
      }

      case MsgType.HIGH_FIVE: {
        console.log('Handle posbus message high_five', data);
        const {sender_id, receiver_id, message} = data;
        if (receiver_id !== PosBusService.userId) {
          console.log('High five not for me', receiver_id);
          return;
        }

        console.log('High five from', sender_id, message);
        PosBusEventEmitter.emit('high-five', sender_id, message);
        break;
      }

      case MsgType.ACTIVITY_UPDATE: {
        console.log('PosBus activity_update', data);
        const {activity_id, change_type} = data;
        Event3dEmitter.emit('ActivityUpdate', activity_id, change_type as ActivityUpdateEnum);
        break;
      }

      default:
        console.log('Unhandled posbus message', message.data);
    }
  }

  static handleCoreAttributeChange(msg: AttributeValueChanged) {
    switch (msg.attribute_name) {
      case AttributeNameEnum.VOICE_CHAT_USER: {
        const value = msg.value;
        if (value && value.joined) {
          Event3dEmitter.emit('UserJoinedVoiceChat', value.userId);
        } else if (value) {
          Event3dEmitter.emit('UserLeftVoiceChat', value.userId);
        }
        break;
      }
    }
    PosBusEventEmitter.emit('attribute-value-changed', msg);
  }

  static sendMyTransform(transform: TransformNoScaleInterface) {
    this.main.port?.postMessage([MsgType.MY_TRANSFORM, transform]);
  }

  static sendObjectTransform(objectId: string, transform: ObjectTransformInterface) {
    console.log('PosBus sendObjectTransform', objectId, transform);
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

  static sendHighFive(sender_id: string, receiver_id: string) {
    this.main.port?.postMessage([
      MsgType.HIGH_FIVE,
      {
        sender_id,
        receiver_id,
        message: 'High five!'
      }
    ]);
  }

  static addPendingState(
    transaction_id: string,
    odyssey_id: string,
    wallet: string,
    comment: string,
    amount: string,
    kind: number // kind = 0 - mom, kind = 1 - dad
  ) {
    this.main.port?.postMessage([
      MsgType.ADD_PENDING_STAKE,
      {
        transaction_id,
        odyssey_id,
        wallet,
        amount,
        comment,
        kind
      }
    ]);
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
}

export default PosBusService;
