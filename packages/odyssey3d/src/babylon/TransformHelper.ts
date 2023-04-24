import {Scene, TransformNode, Vector3} from '@babylonjs/core';
import {PositionInterface} from '@momentum-xyz/core';

export enum TransformTypesEnum {
  Position,
  Rotation,
  Scale
}

export function setNodeTransform(
  userNode: TransformNode,
  startVec: Vector3,
  targetVec: PositionInterface,
  transformType: TransformTypesEnum,
  scene: Scene
) {
  const slerpPos = Vector3.Zero();

  let elapsedTime = 0;
  const totalTime = 1000;

  scene.onBeforeRenderObservable.add(() => {
    // TODO: Add a check to not do this every frame if there are no position changes.
    elapsedTime += scene.getEngine().getDeltaTime();

    //const startingPos = userNode.position;
    Vector3.SmoothToRef(startVec, posToVec3(targetVec), elapsedTime, totalTime, slerpPos);
    userNode.position = slerpPos;

    switch (transformType) {
      case TransformTypesEnum.Position:
        userNode.position = slerpPos;
        break;
      case TransformTypesEnum.Rotation:
        userNode.rotation = slerpPos;
        break;
      case TransformTypesEnum.Scale:
        userNode.scaling = slerpPos;
        break;
    }
  });
}

export function vec3Equals(vec1: PositionInterface, vec2: PositionInterface) {
  if (vec1.x === vec2.x && vec1.y === vec2.y && vec1.z === vec2.z) {
    return true;
  } else {
    return false;
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
