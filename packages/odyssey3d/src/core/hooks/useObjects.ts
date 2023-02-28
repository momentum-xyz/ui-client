import {useEffect} from 'react';
import * as BABYLON from '@babylonjs/core';

export const useObjects = (scene: BABYLON.Scene) => {
  useEffect(() => {
    // Built-in 'sphere' shape.
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2, segments: 32}, scene);
    // Move sphere upward 1/2 its height
    sphere.position.y = 1;

    // Built-in 'ground' shape.
    BABYLON.MeshBuilder.CreateGround('ground', {width: 6, height: 6}, scene);
  }, [scene]);
};
