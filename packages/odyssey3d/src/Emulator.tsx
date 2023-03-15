import {FC, useEffect, useState} from 'react';
import {Object3dInterface} from '@momentum-xyz/core';
import {Client, loadClientWorker} from '@momentum-xyz/posbus-client';

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
  //const backendUrl = 'http://localhost:8080';
  //const worldId = 'ed8273d0-57f6-4a99-832d-57866b975ff9';
  const backendUrl = 'https://dev2.odyssey.ninja';
  const worldId = 'b17a9850-b57b-44a4-b56f-1d2b9a02e34a';
  const [pbClient, setPbClient] = useState<Client>();
  const [authToken, setAuthToken] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [pbPort, setPbPort] = useState<MessagePort>();

  useEffect(() => {
    // TODO: nicer way to import these? some webpack and/or package.json export magic?
    const workerUrl = new URL(
      '../node_modules/@momentum-xyz/posbus-client/dist/worker.mjs',
      import.meta.url
    );
    const wasmUrl = new URL(
      '../node_modules/@momentum-xyz/posbus-client/dist/pbc.wasm',
      import.meta.url
    );

    loadClientWorker(workerUrl, wasmUrl)
      .then((client) => {
        setPbClient(client);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [setPbClient]);

  useEffect(() => {
    fetch(`${backendUrl}/api/v4/auth/guest-token`, {method: 'POST'})
      .then((r) => r.json())
      .then((r) => {
        setAuthToken(r.token);
        setUserId(r.id);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [setAuthToken, setUserId]);

  useEffect(() => {
    if (authToken && userId) {
      pbClient
        ?.connect(`${backendUrl}/posbus`, authToken, userId)
        .then((port) => {
          setPbPort(port);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [pbClient, authToken, userId, setPbPort]);

  /*
    useEffect(() => {
        if(pbPort) {
            pbPort.onmessage = (msg) => {
                const [msgType, data] = msg.data;
                console.log(msgType, data);
                Event3dEmitter.emit(msgType, data);
            }
        }
    }, [pbPort]);
     */

  useEffect(() => {
    if (pbPort) {
      pbClient?.teleport(worldId);
    }
  }, [pbClient, pbPort]);

  /*
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
   */

  return pbPort ? (
    <BabylonScene controllerPort={pbPort} objects={object_3d_mocks} />
  ) : (
    <div>Loading</div>
  );
};

export default Emulator;
