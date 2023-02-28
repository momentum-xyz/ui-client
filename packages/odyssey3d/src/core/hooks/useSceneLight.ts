import {useEffect, useRef} from 'react';
import * as BABYLON from '@babylonjs/core';

export const useSceneLight = (scene: BABYLON.Scene) => {
  const light = useRef<BABYLON.HemisphericLight>();

  useEffect(() => {
    // Creates a light, aiming 0,1,0
    light.current = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

    // Dim the light a small amount 0 - 1
    light.current.intensity = 0.7;
  }, [scene]);

  return {light: light.current};
};
