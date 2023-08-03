import {AbstractMesh, Scene, TransformNode, Vector3} from '@babylonjs/core';
import {PositionInterface} from '@momentum-xyz/core';

import {PlayerHelper} from './PlayerHelper';

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

  const observable = scene.onBeforeRenderObservable.add(() => {
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

    // consider doing totalTime * 1.1 or something similar to further smoothen movement at the end
    if (elapsedTime > totalTime) {
      scene.onBeforeRenderObservable.remove(observable);
    }
  });
}

export function smoothCameraTransform(
  startVec: Vector3,
  targetVec: Vector3,
  transformType: TransformTypesEnum,
  totalTime: number,
  scene: Scene,
  lerp = 0
) {
  return new Promise<void>((resolve) => {
    const slerpPos = Vector3.Zero();
    let lerpedTarget = Vector3.Zero();
    let elapsedTime = 0;

    if (lerp) {
      lerpedTarget = Vector3.Lerp(startVec, targetVec, lerp);
    } else {
      lerpedTarget = targetVec;
    }

    const observable = scene.onBeforeRenderObservable.add(() => {
      elapsedTime += scene.getEngine().getDeltaTime();

      Vector3.SmoothToRef(startVec, lerpedTarget, elapsedTime, totalTime, slerpPos);

      switch (transformType) {
        case TransformTypesEnum.Position:
          PlayerHelper.camera.position = slerpPos;
          break;
        case TransformTypesEnum.Rotation:
          PlayerHelper.camera.target = slerpPos;
          break;
      }

      if (elapsedTime > totalTime) {
        // Chase finished

        scene.onBeforeRenderObservable.remove(observable);
        resolve();
      }
    });
  });
}

export function smoothCameraUniverse(
  startVec: Vector3,
  target: AbstractMesh,
  transformType: TransformTypesEnum,
  totalTime: number,
  scene: Scene,
  lerp = false,
  lockTarget = false
) {
  const slerpPos = Vector3.Zero();
  let lerpedTarget = Vector3.Zero();
  let elapsedTime = 0;

  if (lerp) {
    lerpedTarget = Vector3.Lerp(startVec, target.absolutePosition, 0.85);
  } else {
    lerpedTarget = target.absolutePosition;
  }

  const observable = scene.onBeforeRenderObservable.add(() => {
    elapsedTime += scene.getEngine().getDeltaTime();

    Vector3.SmoothToRef(startVec, lerpedTarget, elapsedTime, totalTime, slerpPos);

    switch (transformType) {
      case TransformTypesEnum.Position:
        PlayerHelper.camera.position = slerpPos;
        break;
      case TransformTypesEnum.Rotation:
        PlayerHelper.camera.target = slerpPos;
        break;
    }

    if (elapsedTime > totalTime) {
      scene.onBeforeRenderObservable.remove(observable);

      if (lockTarget) {
        PlayerHelper.camera.lockedTarget = target;
      }
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
