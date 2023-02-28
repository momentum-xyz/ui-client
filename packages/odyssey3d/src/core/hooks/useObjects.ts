import {useCallback, useEffect} from 'react';
import * as BABYLON from '@babylonjs/core';

import {Object3dInterface} from '../interfaces';

export const useObjects = (scene: BABYLON.Scene, initialObjects: Object3dInterface[]) => {
  // TODO: Init/add event consumer for changes

  const spawnObject = useCallback(
    (object: Object3dInterface) => {
      switch (object.asset_3d_id) {
        // Type -> Sphere
        case '7e20a110-149b-4c6e-b1ab-a25cbdc066e6': {
          const options = {diameter: object.transform.scale, segments: 32};
          const sphere = BABYLON.MeshBuilder.CreateSphere(object.name, options, scene);

          sphere.position.x = object.transform.position.x;
          sphere.position.y = object.transform.position.y;
          sphere.position.z = object.transform.position.z;
          break;
        }
        default: {
          console.warn(`${object.asset_3d_id} is unknown asset_3d_id`);
        }
      }
    },
    [scene]
  );

  useEffect(() => {
    initialObjects.forEach((initialObject) => {
      spawnObject(initialObject);
    });
  }, [initialObjects, scene, spawnObject]);
};
