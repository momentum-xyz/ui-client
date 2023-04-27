import {Scene, TransformNode, Vector3} from '@babylonjs/core';
import {PositionInterface} from '@momentum-xyz/core';

export enum TransformTypesEnum {
  Position,
  Rotation,
  Scale
}

export function smoothUserNodeTransform(
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
    elapsedTime += scene.getEngine().getDeltaTime();

    Vector3.SmoothToRef(startVec, posToVec3(targetVec), elapsedTime, totalTime, slerpPos);

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
  const tolerance = 0.001;

  if (
    Math.abs(vec1.x - vec2.x) < tolerance &&
    Math.abs(vec1.y - vec2.y) < tolerance &&
    Math.abs(vec1.z - vec2.z) < tolerance
  ) {
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
