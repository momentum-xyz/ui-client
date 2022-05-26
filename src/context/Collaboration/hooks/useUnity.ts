import {useEffect, useState} from 'react';

import UnityService from '../../Unity/UnityService';
import {uuidToBytes} from '../../../core/utils/uuid.utils';

export enum World {
  MOMENTUM = 'd83670c7-a120-47a4-892d-f9ec75604f74',
  MOMBIZA = '4567abb3-95e4-46fb-bde4-45ce7491b1ad'
}

export const useUnityCurrentWorldId = () => {
  const [worldId, setWorldId] = useState<Buffer>(
    uuidToBytes('d83670c7-a120-47a4-892d-f9ec75604f74')
  );

  useEffect(() => {
    const world: any = UnityService.getCurrentWorld?.();

    if (world) {
      console.info('this is the world: ', world);
      setWorldId(uuidToBytes(world));
    }
  }, []);

  return worldId;
};

export const useUnityUserPosition = () => {
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    const userPos = UnityService.getUserPosition?.();
    if (userPos) {
      setUserPosition(userPos);
    }
  }, []);

  return userPosition;
};
