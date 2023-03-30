import {TransformNode} from '@babylonjs/core';

import {ObjectHelper} from './ObjectHelper';

export class UtilityHelper {
  static getNodeFromId(id: string): TransformNode | undefined {
    const myNode = ObjectHelper.objectsMap.get(id)?.objectInstance.rootNodes[0];
    if (myNode) {
      return myNode;
    } else {
      return undefined;
    }
  }

  static getAssetFileName(id: string): string {
    return id.replace(/-/g, '');
  }
}
