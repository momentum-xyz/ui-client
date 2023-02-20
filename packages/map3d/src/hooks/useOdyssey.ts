import {useCallback, useRef} from 'react';
import * as THREE from 'three';
import {Map3dUserInterface} from '@momentum-xyz/core';

import {PlanetMesh} from '../classes';
import astronaut from '../static/images/astronaut.png';
import odysseyOrb from '../static/images/odyssey.orb.pattern.jpg';

export const useOdyssey = (
  getImageUrl: (urlOrHash: string | undefined | null) => string | null
) => {
  const odysseySphereGeometry = useRef(new THREE.SphereGeometry(1, 32, 32));
  const odysseyAvatarGeometry = useRef(new THREE.CircleGeometry(0.7, 26));
  const defaultOdysseyTexture = useRef(new THREE.TextureLoader().load(astronaut));

  //Setup texture reflection for the glass effect of the Odyssey
  const environmentReflectionImage = new THREE.TextureLoader().load(odysseyOrb);
  environmentReflectionImage.mapping = THREE.EquirectangularRefractionMapping;

  const odysseyMaterial = useRef(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      envMap: environmentReflectionImage,
      transmission: 1,
      opacity: 0.3,
      side: THREE.BackSide,
      ior: 1.5,
      metalness: 0.3,
      roughness: 0,
      specularIntensity: 1,
      transparent: false
    })
  );

  /**
   * Create an odyssey
   */
  const createOdyssey = useCallback(
    (item: Map3dUserInterface) => {
      const imageUrl = getImageUrl(item.image) || astronaut;

      const texture = new THREE.TextureLoader().load(imageUrl, undefined, undefined, () => {
        // Using default image of odyssey if an image was not loaded
        texture.image = defaultOdysseyTexture.current.image;
        texture.needsUpdate = true;
      });

      const odysseyAvatarMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: texture
      });

      // Flip textures horizontally so text is readable.
      texture.wrapS = THREE.RepeatWrapping;

      // Construct avatar Mesh.
      const avatarMesh = new THREE.Mesh(odysseyAvatarGeometry.current, odysseyAvatarMaterial);

      // Create custom material for name ring.
      const nameRingMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        side: THREE.DoubleSide
      });

      const odyssey = new PlanetMesh(
        odysseySphereGeometry.current,
        odysseyMaterial.current,
        item.uuid,
        item.owner,
        item.name,
        texture,
        nameRingMaterial
      );

      odyssey.add(avatarMesh);

      return odyssey;
    },
    [getImageUrl]
  );

  return {createOdyssey};
};
