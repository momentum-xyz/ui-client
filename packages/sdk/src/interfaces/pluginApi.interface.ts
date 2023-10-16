import {
  Asset3d,
  ObjectData,
  ObjectDefinition,
  ObjectInfo,
  SetWorld,
  Transform,
  TransformNoScale,
  UserData,
  UserTransform
} from './useWorldHook.interface';

type UnsubscribeCallbackType = () => void;

export type PluginApiEventHandlersType = {
  'set-world': (worldInfo: SetWorld | null) => void;
  'users-added': (users: UserData[]) => void;
  'users-removed': (userIds: string[]) => void;
  'users-transform-list': (transforms: UserTransform[]) => void;
  'object-transform': (objectId: string, transform: Transform) => void;
  'object-data': (objectId: string, data: ObjectData) => void;
  'my-transform': (transform: TransformNoScale) => void;
  'add-object': (object: ObjectDefinition) => void;
  'remove-object': (objectId: string) => void;
};

export interface PluginApiInterface<C = unknown> {
  getStateItem: <T>(key: string) => Promise<T>;
  setStateItem: <T>(key: string, value: T) => Promise<T>;
  deleteStateItem: (key: string) => Promise<null>;
  getConfig: () => Promise<C>;

  useStateItemChange: <T = unknown>(key: string, callback: (value: T) => void) => void;
  useStateItemRemove: (key: string, callback: () => void) => void;

  on: (handlers: Partial<PluginApiEventHandlersType>) => UnsubscribeCallbackType;

  requestObjectLock: (objectId: string) => Promise<void>;
  requestObjectUnlock: (objectId: string) => void;

  spawnObject({
    name,
    asset_2d_id,
    asset_3d_id,
    transform,
    object_type_id
  }: {
    name: string;
    asset_2d_id?: string | null;
    asset_3d_id: string | null;
    object_type_id?: string;
    transform?: Transform;
  }): Promise<any>;
  transformObject: (objectId: string, transform: Transform) => void;
  getObjectInfo(objectId: string): Promise<ObjectInfo>;
  removeObject(objectId: string): Promise<any>;
  getSupportedAssets3d(category: 'basic' | 'custom'): Promise<Asset3d[]>;

  setObjectAttribute(data: {
    name: string;
    value: any;
    objectId: string;
    // pluginId?: string
  }): Promise<any>;
  removeObjectAttribute(data: {
    name: string;
    objectId: string;
    // pluginId?: string
  }): Promise<any>;
  getObjectAttribute(data: {
    name: string;
    objectId: string;
    // pluginId?: string
  }): Promise<any>;
  setObjectColor(objectId: string, color: string | null): Promise<any>;
  setObjectName(objectId: string, name: string): Promise<any>;
}
