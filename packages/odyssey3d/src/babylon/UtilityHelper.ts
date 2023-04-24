import {Scene, TransformNode, Vector3} from '@babylonjs/core';
import {PositionInterface} from '@momentum-xyz/core';

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

export function moveNode(userNode: TransformNode, targetPos: PositionInterface, scene: Scene) {
  const slerpPos = Vector3.Zero();

  let elapsedTime = 0;
  const totalTime = 1000;

  scene.onBeforeRenderObservable.add(() => {
    // TODO: Add a check to not do this every frame if there are no position changes.
    elapsedTime += scene.getEngine().getDeltaTime();

    const startingPos = userNode.position;
    Vector3.SmoothToRef(startingPos, posToVec3(targetPos), elapsedTime, totalTime, slerpPos);
    userNode.position = slerpPos;
  });
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
