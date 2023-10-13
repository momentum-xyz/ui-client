import {useEffect, useMemo, useRef} from 'react';
// import {Event3dEmitter} from '@momentum-xyz/core';

import {useObjectGlobalProps} from '../contexts/ObjectGlobalPropsContext';
// import {AttributeNameEnum} from '../enums';
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
        throw new Error('setObjectAttribute not implemented');
      },
      removeObjectAttribute(data: any) {
        console.log('[useWorld]: call removeObjectAttribute', {data});
        throw new Error('removeObjectAttribute not implemented');
      },
      getObjectAttribute(data: any) {
        console.log('[useWorld]: call getObjectAttribute', {data});
        throw new Error('getObjectAttribute not implemented');
      },
      setObjectColor(objectId: string, color: string | null) {
        console.log('[useWorld]: call setObjectColor', {objectId, color});
        throw new Error('setObjectColor not implemented');
      },
      setObjectName(objectId: string, name: string) {
        console.log('[useWorld]: call setObjectName', {objectId, name});
        throw new Error('setObjectName not implemented');
      },
      getObjectInfo(objectId: string) {
        console.log('[useWorld]: call getObjectInfo', {objectId});
        throw new Error('getObjectInfo not implemented');
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
      }
    };
  }, [objectId, pluginApi]);

  return returnObject;
};
