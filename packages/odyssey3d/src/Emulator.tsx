import {FC} from 'react';

import {BabylonScene} from './scenes';
import {Object3dInterface} from './core/interfaces';

/** DEFINE MOCKS HERE **/
const Emulator: FC = () => {
  const object_3d_mocks: Object3dInterface[] = [
    {
      id: '1',
      name: 'Sphere 1',
      transform: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: 2},
      asset_3d_id: '7e20a110-149b-4c6e-b1ab-a25cbdc066e6'
    },
    {
      id: '2',
      name: 'Sphere 2',
      transform: {position: {x: 0, y: 3, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: 0.5},
      asset_3d_id: '7e20a110-149b-4c6e-b1ab-a25cbdc066e6'
    }
  ];

  return <BabylonScene objects={object_3d_mocks} />;
};

export default Emulator;
