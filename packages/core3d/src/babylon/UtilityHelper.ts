import {TransformNode, Vector3} from '@babylonjs/core';

import {ObjectHelper} from './ObjectHelper';

export function getAssetFileName(id: string): string {
  return id.replace(/-/g, '');
}

export function getNodeFromId(id: string): TransformNode | undefined {
  const obj = ObjectHelper.objectsMap.get(id);
  const myNode = obj?.getNode();
  if (myNode instanceof TransformNode) {
    return myNode;
  } else {
    return undefined;
  }
}

export function getBoundingInfo(node: TransformNode): {
  min: Vector3;
  max: Vector3;
  sizeVec: Vector3;
  size: number;
} {
  const boundingInfo = node.getHierarchyBoundingVectors();
  const sizeVec = boundingInfo.max.subtract(boundingInfo.min);

  return {
    ...boundingInfo,
    sizeVec,
    size: sizeVec.length()
  };
}
