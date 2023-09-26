import {FC, useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {Switch} from '@momentum-xyz/ui-kit';
import {Event3dEmitter, Universe3dEmitter} from '@momentum-xyz/core';

import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';

import {WorldBabylonScene, UniverseBabylonScene} from './scenes';
import * as styled from './Emulator.styled';

window.sessionStorage.setItem('babylon_debug', 'true');

const assetIDs: string[] = [
  'de99ac0e-0ba0-6446-9263-46d3f6c854e5',
  '8eb299aa-bed7-8de6-fbc2-54716723f2e0'
];

let i = 0;

/** DEFINE MOCKS HERE **/
const WorldEmulator: FC = () => {
  const randomNumber = () => {
    const min = -10;
    const max = 10;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  useEffect(() => {
    Event3dEmitter.emit(
      'SetWorld',
      {id: uuidv4(), name: 'name', avatar: 'avatar', owner: 'owner', avatar_3d_asset_id: uuidv4()},
      'id'
    );
    //'0d5b35b9-33c0-d917-c095-7ba3670755da');
    console.log(assetIDs.length);
    setInterval(() => {
      if (i < 10) {
        i = i + 1;
        const randomIndex = Math.floor(Math.random() * assetIDs.length);

        Event3dEmitter.emit('AddObject', {
          id: uuidv4(),
          name: 'Cool name' + randomNumber(),
          transform: {
            position: {x: randomNumber(), y: randomNumber(), z: randomNumber()},
            rotation: {x: 0, y: 0, z: 0},
            scale: {x: 1, y: 1, z: 1}
          },
          //teapot: de99ac0e-0ba0-6446-9263-46d3f6c854e5
          //charizard: 8eb299aa-bed7-8de6-fbc2-54716723f2e0
          //egg: 9626f409-7a47-6536-7b24-8ebffc5fffac       //ERR 400
          //phoenix: 4751d666-147c-dfc8-6d4b-ed4edb9cc940
          //hypno: 3093e1f9-fa4c-da4d-4df6-73fa22a60ad1     //ERR 400
          //phone: df60d077-608a-3992-bbac-8357466c8646
          //pillman: 0d5b35b9-33c0-d917-c095-7ba3670755da
          asset_format: '1',
          asset_3d_id: assetIDs[randomIndex]
        });
      }
    }, 1000);

    setInterval(() => {
      //360 town: a7169a999da8ec5935a14a0b2669fdfc
      Event3dEmitter.emit('ObjectTextureChanged', {
        objectId: 'e227af0c-cb47-41d2-a93c-565000abad3e',
        hash: 'a7169a999da8ec5935a14a0b2669fdfc',
        label: `name`
      });
    }, 3500);
  }, []);

  return (
    <WorldBabylonScene
      events={Event3dEmitter}
      renderURL="https://dev.odyssey.ninja/api/v3/render"
      onMove={(e) => console.log('onMove', e)}
      onObjectClick={(e) => console.log('onObjectClick', e)}
      onObjectTransform={(objectId, transform) =>
        console.log('onObjectTransform', objectId, transform)
      }
      onUserClick={(e) => console.log('onUserClick', e)}
      onClickOutside={() => console.log('onClickOutside')}
      onBumpReady={() => console.log('onBumpReady')}
      onReadyToHandleEvents={() => console.log('onReadyToHandleEvents')}
      onScreenshotReady={(file) => console.log(file)}
      onVideoReady={(file) => console.log(file)}
    />
  );
};

const UniverseEmulator = () => {
  useEffect(() => {
    Universe3dEmitter.emit(
      'WorldsAdded',
      Array.from({length: 10}, (_, i) => ({
        id: '0d5b35b9-33c0-d917-c095-7ba3670755da',
        name: 'Cool world ' + i,
        description: 'Cool description',
        image: 'https://picsum.photos/100',
        owner: '123' + i
      }))
    );

    Universe3dEmitter.emit(
      'UsersAdded',
      Array.from({length: 10}, (_, i) => ({
        id: '123',
        name: 'Cool user',
        avatar: 'https://picsum.photos/100',
        is_guest: false
      }))
    );
  }, []);

  return (
    <UniverseBabylonScene
      events={Universe3dEmitter}
      renderURL="https://dev.odyssey.ninja/api/v3/render"
      onWorldClick={(e) => console.log('onWorldClick', e)}
      onUserClick={(e) => console.log('onUserClick', e)}
      onClickOutside={() => console.log('onClickOutside')}
      onReadyToHandleEvents={() => console.log('onReadyToHandleEvents')}
    />
  );
};

// TODO Split into several files
const Emulator = () => {
  const [isUniverse, setIsUniverse] = useState(false);
  return (
    <div>
      <styled.ControlPanel>
        <Switch name="switcher" value={isUniverse} onChange={setIsUniverse} />
        <div>Is Universe</div>
      </styled.ControlPanel>
      {isUniverse ? <UniverseEmulator /> : <WorldEmulator />}
    </div>
  );
};

export default Emulator;
