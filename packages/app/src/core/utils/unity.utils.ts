import {UnityPositionInterface} from 'core/interfaces';

export const getUnityPosition = (posString: string): UnityPositionInterface => {
  const [x, y, z] = posString.split(':').map(Number);
  return {x, y, z};
};
