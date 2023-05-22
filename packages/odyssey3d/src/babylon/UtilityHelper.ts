import {TransformNode} from '@babylonjs/core';

import {ObjectHelper} from './ObjectHelper';

export function getAssetFileName(id: string): string {
  return id.replace(/-/g, '');
}

export function getNodeFromId(id: string): TransformNode | undefined {
  const myNode = ObjectHelper.objectsMap.get(id)?.objectInstance.rootNodes[0];
  if (myNode instanceof TransformNode) {
    return myNode;
  } else {
    return undefined;
  }
}
