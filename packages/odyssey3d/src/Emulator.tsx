import {FC, useEffect} from 'react';
import {Event3dEmitter, Object3dInterface} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';

import {BabylonScene} from './scenes';

const object_3d_mocks: Object3dInterface[] = [
  {
    id: 'e227af0c-cb47-41d2-a93c-565000abad3e',
    name: 'Sphere 1',
    transform: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: 2},
    asset_3d_id: '7e20a110-149b-4c6e-b1ab-a25cbdc066e6'
  },
  {
    id: 'e337af0c-cb47-41d2-a93c-565000abad3e',
    name: 'Sphere 2',
    transform: {position: {x: 0, y: 3, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: 0.5},
    asset_3d_id: '7e20a110-149b-4c6e-b1ab-a25cbdc066e6'
  }
];

/** DEFINE MOCKS HERE **/
const Emulator: FC = () => {
  const randomNumber = () => {
    const min = -10;
    const max = 10;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  useEffect(() => {
    setInterval(() => {
      Event3dEmitter.emit('ObjectCreated', {
        id: uuidv4(),
        name: 'Sphere X',
        transform: {
          position: {x: randomNumber(), y: randomNumber(), z: randomNumber()},
          rotation: {x: 0, y: 0, z: 0},
          scale: Math.random() * 2
        },
        asset_3d_id: '7e20a110-149b-4c6e-b1ab-a25cbdc066e6'
      });
    }, 1000);

    setInterval(() => {
      Event3dEmitter.emit('ObjectTextureChanged', {
        id: '4f81d1d3-3196-4018-aaad-f3c29c3b0a59',
        objectId: 'e227af0c-cb47-41d2-a93c-565000abad3e',
        textureColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
      });
    }, 1500);
  }, []);

  return <BabylonScene objects={object_3d_mocks} />;
};

export default Emulator;
