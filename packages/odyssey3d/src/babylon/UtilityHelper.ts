import {TransformNode, Vector3} from '@babylonjs/core';

import {ObjectHelper} from './ObjectHelper';

export function getAssetFileName(id: string): string {
  return id.replace(/-/g, '');
}

export function getNodeFromId(id: string): TransformNode | undefined {
  const myNode = ObjectHelper.objectsMap.get(id)?.objectInstance.rootNodes[0];
  if (myNode) {
    return myNode;
  } else {
    return undefined;
  }
}

export function vec3ToPos(vec: Vector3) {
  const {x, y, z} = vec;
  return {
    x,
    y,
    z
  };
}

export const posToVec3 = (pos: {x: number; y: number; z: number}) => {
  return new Vector3(pos.x, pos.y, pos.z);
};
