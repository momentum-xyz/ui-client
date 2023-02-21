//import {useCallback, useRef} from 'react';
import * as THREE from 'three';
//import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Map3dUserInterface} from '@momentum-xyz/core';

//import {PlanetMesh} from '../classes';
//import highlight from '../static/images/highlight.glb';

export const useHighlights = (
  scene: THREE.Scene,
  pointer: THREE.Vector2,
  camera: THREE.PerspectiveCamera,
  user: Map3dUserInterface
) => {
  /*const activeOdyssey = useRef<PlanetMesh>();
  const highlightTarget = useRef<PlanetMesh>();

  const mat3DHighlight = useRef(
    new THREE.MeshBasicMaterial({color: 0x9eeeff, transparent: true, opacity: 0.8})
  );

  const load3DHighlight = useCallback(() => {
    const gltfLoader = new GLTFLoader();
    const highlightModel = new THREE.Group();

    const test = gltfLoader.load('./images/highlight.glb', (gltf) => {
      gltf.scene.traverse((child) => {
        child.material = mat3DHighlight;
      });
      const children = [...gltf.scene.children];

      for (const child of children) {
        highlightModel.add(child);
      }

      scene.add(highlightModel);
    });

    return highlightModel;
  }, []);

  /**
   * Show odyssey highlight after hover

  const doHighlightRayTrace = useCallback((referenceListOfOdysseys: PlanetMesh[]) => {
    // Create raycaster.
    const highlightRaycaster = new THREE.Raycaster();

    // Set start en direction for raycast.
    highlightRaycaster.setFromCamera(pointer, camera);

    // Execute Raycast and respond only to objects in the referelist list.
    const ray = highlightRaycaster.intersectObjects(referenceListOfOdysseys, false);

    if (ray.length > 0) {
      // Ignore the active Odyssey.
      if (ray[0].object === activeOdyssey.current) {
        return;
      }

      // if the ray hits the same Odyssey. Ignore it.
      if (ray[0].object === highlightTarget.current) {
        return;
      } else {
        rayDistance = ray[0].distance;

        // Set the new Odyssey as highlight target.
        highlightTarget.current = ray[0].object;

        if (!Highlight3DModel.visible) {
          Highlight3DModel.visible = true;
        }

        // Set 3D highlight model on the oddyssey
        Highlight3DModel.position.set(
          highlightTarget.position.x,
          highlightTarget.position.y,
          highlightTarget.position.z
        );

        // Set scale of highlight based on distance,.
        if (ray[0].distance < 45) {
          Highlight3DModel.scale.set(1.5, 1.5, 1.5);
        } else if (ray[0].distance < 100) {
          Highlight3DModel.scale.set(2, 2, 2);
        } else {
          Highlight3DModel.scale.set(2.5, 2.5, 2.5);
        }

        // if it is the center odyssey ( your own. Set bigger highlight);
        const pos3D = highlightTarget.position;
        if (
          highlightTarget.name == 'My Odyssey' ||
          (pos3D.x === 0 && pos3D.y === 0 && pos3D.z === 0)
        ) {
          Highlight3DModel.scale.set(3, 3, 3);
        }

        if (odysseyNameObject) {
          scene.remove(odysseyNameObject);
        }

        odysseyNameObject = generateOdysseyName(highlightTarget.name);
        handleNamePlacement(odysseyNameObject, camera);

        scene.add(odysseyNameObject);
      }
    }
  }, []);*/

  return {};
};
