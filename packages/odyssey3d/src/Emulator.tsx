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
let i = 0;

/** DEFINE MOCKS HERE **/
const Emulator: FC = () => {
  const randomNumber = () => {
    const min = -10;
    const max = 10;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  useEffect(() => {
    Event3dEmitter.emit('SetWorld', '0d5b35b9-33c0-d917-c095-7ba3670755da');

    setInterval(() => {
      if (i < 3) {
        i = i + 1;
        Event3dEmitter.emit('ObjectCreated', {
          id: uuidv4(),
          name: 'Cool name' + randomNumber(),
          transform: {
            position: {x: randomNumber(), y: randomNumber(), z: randomNumber()},
            rotation: {x: 0, y: 0, z: 0},
            scale: Math.random() * 2
          },
          //teapot: de99ac0e-0ba0-6446-9263-46d3f6c854e5
          //charizard: 8eb299aa-bed7-8de6-fbc2-54716723f2e0
          //egg: 9626f409-7a47-6536-7b24-8ebffc5fffac
          //phoenix: 4751d666-147c-dfc8-6d4b-ed4edb9cc940
          //hypno: 3093e1f9-fa4c-da4d-4df6-73fa22a60ad1     //ERR 400
          //phone: df60d077-608a-3992-bbac-8357466c8646
          //pillman: 0d5b35b9-33c0-d917-c095-7ba3670755da

          asset_3d_id: '8eb299aa-bed7-8de6-fbc2-54716723f2e0'
        });
      }
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
