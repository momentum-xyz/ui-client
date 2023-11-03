import {useEffect, useMemo, useRef} from 'react';

import {useObjectGlobalProps} from '../contexts/ObjectGlobalPropsContext';
import {Transform, UseWorldPropsInterface, UseWorldReturnInterface} from '../interfaces';

import {useObject} from './useObject';

export const useWorld = (props: UseWorldPropsInterface): UseWorldReturnInterface => {
  const refProps = useRef<UseWorldPropsInterface>(props);
  refProps.current = props;

  const {pluginApi} = useObjectGlobalProps();
  const {objectId} = useObject();
  useEffect(() => {
    console.log('[useWorld]: useEffect', {pluginApi});
    const {
      onJoinedWorld,
      onLeftWorld,
      onObjectAdded,
      onObjectMove,
      onObjectData,
      onObjectRemoved,
      onMyPosition,
      onUserAdded,
      onUserMove,
      onUserRemoved
    } = refProps.current;

    return pluginApi?.on({
      'set-world': (worldInfo) => {
        console.log('[useWorld]: set-world', {worldInfo});
        if (worldInfo) {
          onJoinedWorld?.(worldInfo);
        } else {
          onLeftWorld?.();
        }
      },
      'users-added': (users) => {
        console.log('[useWorld]: users-added', {users});
        users.forEach((user) => onUserAdded?.(user));
      },
      'users-removed': (userIds) => {
        console.log('[useWorld]: users-removed', {userIds});
        userIds.forEach((userId) => onUserRemoved?.(userId));
      },
      'users-transform-list': (transforms) => {
        console.log('[useWorld]: users-transform-list', {transforms});
        transforms.forEach((transform) => onUserMove?.(transform));
      },
      'object-transform': (objectId, transform) => {
        console.log('[useWorld]: object-transform', {objectId, transform});
        onObjectMove?.(objectId, transform);
      },
      'object-data': (objectId, data) => {
        console.log('[useWorld]: object-data', {objectId, data});
        onObjectData?.(objectId, data);
      },
      'my-transform': (transform) => {
        console.log('[useWorld]: my-transform', {transform});
        onMyPosition?.(transform);
      },
      'add-object': (object) => {
        console.log('[useWorld]: add-object', {object});
        onObjectAdded?.(object);
      },
      'remove-object': (objectId) => {
        console.log('[useWorld]: remove-object', {objectId});
        onObjectRemoved?.(objectId);
      }
    });
  }, [refProps, pluginApi]);

  const returnObject: UseWorldReturnInterface = useMemo(() => {
    return {
      worldId: objectId || null,
      requestObjectLock(objectId: string) {
        console.log('[useWorld]: call requestObjectLock', {objectId});
        return pluginApi.requestObjectLock(objectId);
      },
      requestObjectUnlock(objectId: string) {
        console.log('[useWorld]: call requestObjectUnlock', {objectId});
        return pluginApi.requestObjectUnlock(objectId);
      },
      transformObject(objectId: string, object_transform: Transform) {
        console.log('[useWorld]: call transformObject', {objectId, object_transform});
        return pluginApi.transformObject(objectId, object_transform);
      },
      setObjectAttribute(data: any) {
        console.log('[useWorld]: call setObjectAttribute', {data});
        return pluginApi.setObjectAttribute(data);
      },
      removeObjectAttribute(data: any) {
        console.log('[useWorld]: call removeObjectAttribute', {data});
        return pluginApi.removeObjectAttribute(data);
      },
      getObjectAttribute(data: any) {
        console.log('[useWorld]: call getObjectAttribute', {data});
        return pluginApi.getObjectAttribute(data);
      },
      setObjectColor(objectId: string, color: string | null) {
        console.log('[useWorld]: call setObjectColor', {objectId, color});
        return pluginApi.setObjectColor(objectId, color);
      },
      setObjectName(objectId: string, name: string) {
        console.log('[useWorld]: call setObjectName', {objectId, name});
        return pluginApi.setObjectName(objectId, name);
      },
      getObjectInfo(objectId: string) {
        console.log('[useWorld]: call getObjectInfo', {objectId});
        return pluginApi.getObjectInfo(objectId);
      },
      spawnObject(data: {
        name: string;
        asset_2d_id?: string | null;
        asset_3d_id: string | null;
        object_type_id?: string;
        transform?: Transform;
      }) {
        console.log('[useWorld]: call spawnObject', {data});
        return pluginApi.spawnObject(data);
      },
      removeObject(objectId: string) {
        console.log('[useWorld]: call removeObject', {objectId});
        return pluginApi.removeObject(objectId);
      },
      getSupportedAssets3d(category: 'basic' | 'custom') {
        console.log('[useWorld]: call getSupportedAssets3d', {category});
        return pluginApi.getSupportedAssets3d(category);
      },
      uploadImage(data: {file: File}): Promise<{hash: string}> {
        console.log('[useWorld]: call uploadImage', {data});
        return pluginApi.uploadImage(data);
      },
      uploadAsset3d(data: {
        name: string;
        asset: File;
        isPrivate?: boolean;
        previewHash?: string;
        onUploadProgress?: (progressEvent: any) => void;
      }): Promise<{id: string}> {
        console.log('[useWorld]: call uploadAsset3d', {data});
        return pluginApi.uploadAsset3d(data);
      }
    };
  }, [objectId, pluginApi]);

  return returnObject;
};
