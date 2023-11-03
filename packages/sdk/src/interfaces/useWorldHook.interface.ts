/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
export const CORE_PLUGIN_ID = 'f0f0f0f0-0f0f-4ff0-af0f-f0f0f0f0f0f0';
export const CUSTOM_OBJECT_TYPE_ID = '4ed3a5bb-53f8-4511-941b-07902982c31c';

export interface TransformNoScale {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Transform extends TransformNoScale {
  scale: {
    x: number;
    y: number;
    z: number;
  };
}
export interface ObjectDefinition {
  id: string;
  parent_id: string;
  asset_type: string;
  asset_format: string;
  name: string;
  transform: Transform;
  // is_editable: boolean;
  // tethered_to_parent: boolean;
  // show_on_minimap: boolean;
}

export interface ObjectInfo {
  owner_id: string;
  parent_id: string;
  object_type_id: string;
  asset_2d_id: string | null;
  asset_3d_id: string | null;
  transform: Transform;
}

export interface Asset3d {
  id: string;
  user_id: string;
  meta: {
    category: string;
    name: string;
    preview_hash?: string;
    type: number;
  };
  is_private: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SetWorld {
  id: string;
  name: string;
  avatar: string;
  owner: string;
  // avatar_3d_asset_id: string;
}

export interface UserData {
  id: string;
  name: string;
  avatar: string;
  transform: TransformNoScale;
  is_guest: boolean;
}

export interface UserTransform {
  id: string;
  transform: TransformNoScale;
}

export type SlotType = '' | 'texture' | 'string' | 'number';
export interface ObjectData {
  id: string;
  entries: {
    SlotType: {
      [key: string]: any;
    };
  };
}

export interface UseWorldPropsInterface {
  onJoinedWorld?: (worldInfo: SetWorld) => void;
  onLeftWorld?: () => void;

  onMyPosition?: (transform: TransformNoScale) => void;

  onUserAdded?: (user: UserData) => void;
  onUserMove?: (user: UserTransform) => void;
  onUserRemoved?: (userId: string) => void;

  onObjectAdded?(object: ObjectDefinition): void;
  onObjectMove?: (objectId: string, transform: Transform) => void;
  onObjectData?: (objectId: string, data: ObjectData) => void;
  onObjectRemoved?: (objectId: string) => void;
}

export interface UseWorldReturnInterface {
  worldId: string | null;

  // /**
  //  * Moves the user to a new position and orientation defined by the provided transform.
  //  *
  //  * @param {TransformNoScale} transform - The transformation parameters to move the user. This includes position, rotation, but not scale.
  //  */
  // moveUser(transform: TransformNoScale): void;

  /**
   * Requests a lock on an object required for tranform operation - otherwise it will be ignored.
   * If the lock is not aquired, the function will throw an error.
   *
   * @param {string} objectId - The ID of the object that is being locked.
   */
  requestObjectLock(objectId: string): Promise<void>;

  /**
   * Releases a lock on an object.
   *
   * @param {string} objectId - The ID of the object that is being unlocked.
   */
  requestObjectUnlock(objectId: string): void;

  /**
   * Transforms an object by changing its position, rotation, and/or scale.
   *
   * @param {string} objectId - The ID of the object that is being transformed.
   * @param {Transform} object_transform - An object containing the parameters for the transformation. This includes new position, rotation, and scale.
   */
  transformObject(objectId: string, object_transform: Transform): void;

  // /**
  //  * Sends a high-five action to another user, along with an optional message.
  //  *
  //  * @param {string} userId - The ID of the user who will receive the high-five.
  //  * @param {string} [message] - Optional. A message to send along with the high-five.
  //  */
  // sendHighFive(userId: string, message?: string): void;

  /**
   * Sets an attribute of a specified object with a given value.
   *
   * @param {Object} params - An object that contains parameters for setting the attribute.
   * @param {string} params.name - The name of the attribute.
   * @param {any} params.value - The value to set the attribute to.
   * @param {string} params.objectId - The ID of the object to which the attribute will be set.
   * @param {string} params.pluginId - Optional. The ID of the plugin to which the attribute is related. Defaults to the core plugin ID.
   */
  setObjectAttribute({
    name,
    value,
    objectId,
    pluginId
  }: {
    name: string;
    value: any;
    objectId: string;
    pluginId?: string;
  }): Promise<any>;

  /**
   * Removes an attribute of a specified object.
   *
   * @param {Object} params - An object that contains parameters for removing the attribute.
   * @param {string} params.name - The name of the attribute.
   * @param {string} params.objectId - The ID of the object from which the attribute will be removed.
   * @param {string} params.pluginId - Optional. The ID of the plugin from which the attribute will be removed. Defaults to the core plugin ID.
   */
  removeObjectAttribute({
    name,
    objectId,
    pluginId = CORE_PLUGIN_ID
  }: {
    name: string;
    objectId: string;
    pluginId?: string;
  }): Promise<null>;

  /**
   * Fetches the value of a specified attribute of an object.
   *
   * @param {Object} params - An object that contains parameters for fetching the attribute.
   * @param {string} params.name - The name of the attribute.
   * @param {string} params.objectId - The ID of the object from which the attribute will be fetched.
   * @param {string} params.pluginId - Optional. The ID of the plugin from which the attribute will be fetched. Defaults to the core plugin ID.
   */
  getObjectAttribute({
    name,
    objectId,
    pluginId = CORE_PLUGIN_ID
  }: {
    name: string;
    objectId: string;
    pluginId?: string;
  }): Promise<any>;

  // /**
  //  * Subscribes to changes in an attribute of a specified object, and provides callbacks to handle change or error events.
  //  *
  //  * Note that changes detection doesn't work for every attribute. The attribute needs to have posbus_auto Option in attribute_type.
  //  *
  //  * @param {Object} params - An object that contains parameters for the subscription.
  //  * @param {string} params.name - The name of the attribute to subscribe to.
  //  * @param {string} params.objectId - The ID of the object whose attribute is being subscribed to.
  //  * @param {string} params.pluginId - Optional. The ID of the plugin for the attribute. Defaults to the core plugin ID.
  //  * @param {(value: any) => void} params.onChange - Optional. A callback function that is called when the attribute changes.
  //  * @param {(err: Error) => void} params.onError - Optional. A callback function that is called when an error occurs.
  //  * @returns {Function} - Returns a function that unsubscribes from the attribute when called.
  //  */
  // subscribeToObjectAttribute({
  //   name,
  //   objectId,
  //   pluginId = CORE_PLUGIN_ID,
  //   onChange,
  //   onError
  // }: {
  //   name: string;
  //   objectId: string;
  //   pluginId?: string;
  //   onChange?: (value: any) => void;
  //   onError?: (err: Error) => void;
  // }): () => void;

  /**
   * Sets the color of a specified object.
   * The color is specified as a hex string, e.g. '#ff0000' for red.
   * If the color is null, the color will be cleared.
   */
  setObjectColor(objectId: string, color: string | null): Promise<null>;

  /**
   * Sets the name of a specified object.
   * The name is specified as a string.
   *
   * @param {string} objectId - The ID of the object to set the name of.
   * @param {string} name - The name to set.
   */
  setObjectName(objectId: string, name: string): Promise<null>;

  /**
   * Fetches info of a specified object.
   *
   * @param {string} objectId - The ID of the object to fetch info from.
   */
  getObjectInfo(objectId: string): Promise<ObjectInfo>;

  /**
   * Creates a new object in the virtual world.
   *
   * @param {Object} params - An object that contains parameters for the new object.
   * @param {string} params.name - The name of the new object.
   * @param {string} params.object_type_id - Optional. The type of the new object. Defaults to the default object type.
   * @param {string} params.asset_3d_id - The 3D model that the new object will use.
   * @param {Transform} params.transform - Optional. The initial position and rotation of the new object.
   *                                              Current user position and rotation will be used if not specified.
   */
  spawnObject({
    name,
    asset_2d_id,
    asset_3d_id,
    object_type_id,
    transform
  }: {
    name: string;
    asset_2d_id?: string | null;
    asset_3d_id: string | null;
    object_type_id?: string;
    transform?: Transform;
  }): Promise<{id: string}>;

  /**
   * Removes an object from the virtual world.
   *
   * @param {string} objectId - The ID of the object to remove.
   * @returns {Promise<null>} - Returns a promise that resolves when the object is removed.
   *                            The promise will reject if the object is not found or user has no admin rights.
   *
   */
  removeObject(objectId: string): Promise<null>;

  /**
   * Fetches a list of supported 3D assets - Odyssey basic, Community ones and your account's private collection.
   *
   * @param {string} category - The category of assets to fetch. Can be 'basic' or 'custom'.
   *
   * @returns {Promise<any>} - Returns a promise that resolves to an array of supported assets.
   */
  getSupportedAssets3d(category: 'basic' | 'custom'): Promise<Asset3d[]>;

  /**
   * Uploads an image to node storage
   *
   * @param {Object} data - An object that contains parameters for the new image.
   * @param {File} data.file - The image file to upload.
   *
   * @returns {Promise<{hash: string}>} - Returns a promise that resolves to the hash of the uploaded image, also used as id
   */
  uploadImage(data: {file: File}): Promise<{hash: string}>;

  /**
   * Uploads a 3D asset, private or public.
   *
   * @param {Object} data - An object that contains parameters for the new asset.
   * @param {string} data.name - The name of the new asset.
   * @param {File} data.file - The 3D model file to upload.
   * @param {boolean} data.isPrivate - Optional. Whether the asset should be private. Defaults to false.
   * @param {string} data.previewHash - Optional. The hash of the preview image of the asset.
   *
   * @returns {Promise<{id: string}>} - Returns a promise that resolves to the ID of the uploaded asset.
   */
  uploadAsset3d(data: {
    name: string;
    asset: File;
    isPrivate?: boolean;
    previewHash?: string;
    onUploadProgress?: (progressEvent: any) => void;
  }): Promise<{id: string}>;
}
