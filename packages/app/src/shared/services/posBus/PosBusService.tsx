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

  public static init(token: string, userId: string /*, worldId?: string | null*/) {
    console.log('PosBusService init', token, userId);
    this.userId = userId;
    if (this.main.client) {
      this.main.client.disconnect();
      this.connect(this.main.client, token, userId).catch((err) => {
        console.error(err);
      });
      // temp disable it here - breaks golang client sometimes
      // .then(() => {
      //   if (worldId) {
      //     this.teleportToWorld(worldId);
      //   }
      // });
    } else {
      const workerUrl = new URL('@momentum-xyz/posbus-client/worker.mjs', import.meta.url);
      const wasmUrl = new URL('@momentum-xyz/posbus-client/pbc.wasm', import.meta.url);
      loadClientWorker(workerUrl, wasmUrl)
        .then((client) => {
          console.log('PosBus client loaded', client);
          this.main.client = client;
          return this.connect(client, token, userId);
        })
        // .then(() => {
        //   if (worldId) {
        //     this.teleportToWorld(worldId);
        //   }
        // })
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
      console.log('PosBus teleportToWorld', worldId);
      this.main.client.teleport(worldId);
    } else {
      console.error('Cannot teleport: PosBus not connected');
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
        } else if (value === 1) {
          PosBusEventEmitter.emit('posbus-duplicated-sessions');
          console.log('PosBus duplicated sessions. Leave world!');
          PosBusService.leaveWorld();
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

        if (entries?.string?.object_effect) {
          Event3dEmitter.emit('ObjectEffectChanged', id, entries.string.object_effect);
        }

        if (entries?.audio?.spatial) {
          Event3dEmitter.emit('ObjectSoundChanged', id, {
            volume: entries.audio.spatial.volume || 0,
            distance: entries.audio.spatial.distance || 0,
            tracks: entries.audio.spatial.tracks
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
        // console.log('Temp ignore posbus message lock_object_response', message.data);
        console.log('Handle posbus message lock_object_response', message.data);
        const {id, result, lock_owner} = data;
        PosBusEventEmitter.emit('lock-object-response', id, result === 1, lock_owner);
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
      case AttributeNameEnum.SOUNDTRACK: {
        const value = msg.value;
        if (value?.tracks) {
          Event3dEmitter.emit('SoundtrackChanged', value.tracks);
        }
        break;
      }
      case AttributeNameEnum.SPATIAL_AUDIO: {
        const value = msg.value;
        if (value?.tracks) {
          Event3dEmitter.emit('SpatialSoundChanged', msg.target_id, {
            tracks: value.tracks,
            volume: value.volume || 0,
            distance: value.distance || 0
          });
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

  static async requestObjectLock(objectId: string) {
    console.log('PosBus requestObjectLock', objectId);
    return new Promise<void>((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new Error('PosBus not connected'));
      }
      this.main.port?.postMessage([
        MsgType.LOCK_OBJECT,
        {
          id: objectId
        }
      ]);
      const onResp = (id: string, result: boolean) => {
        if (id === objectId) {
          if (result) {
            resolve();
          } else {
            reject(new Error('Object is locked'));
          }
          PosBusEventEmitter.off('lock-object-response', onResp);
        }
      };
      PosBusEventEmitter.on('lock-object-response', onResp);
    });
  }
  static requestObjectUnlock(objectId: string) {
    if (this.isConnected()) {
      console.log('PosBus requestObjectUnlock', objectId);
      this.main.port?.postMessage([
        MsgType.UNLOCK_OBJECT,
        {
          id: objectId
        }
      ]);
    }
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
    transaction_hash: string,
    object_id: string,
    wallet: string,
    comment: string,
    amount: string,
    kind: number // kind = 0 - mom, kind = 1 - dad
  ) {
    this.main.port?.postMessage([
      MsgType.USER_STAKED_TO_ODYSSEY,
      {
        transaction_hash,
        object_id,
        wallet,
        comment,
        amount,
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
