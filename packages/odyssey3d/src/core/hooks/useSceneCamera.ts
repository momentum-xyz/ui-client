import {useEffect, useRef} from 'react';
import * as BABYLON from '@babylonjs/core';

export const useSceneCamera = (canvas: HTMLCanvasElement, scene: BABYLON.Scene) => {
  const camera = useRef<BABYLON.FreeCamera>();

  useEffect(() => {
    // Creates and positions a free camera
    camera.current = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    // Targets the camera to scene origin
    camera.current.setTarget(BABYLON.Vector3.Zero());
    // Attaches the camera to the canvas
    camera.current.attachControl(canvas, true);
  }, [canvas, scene]);

  return {camera: camera.current};
};
