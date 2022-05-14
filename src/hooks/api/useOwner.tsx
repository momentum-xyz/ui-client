import {SpaceResponse} from '../../context/type/Space';

import {useGetSpace} from './useSpaceService';

export const useOwner = (
  id: string
): [SpaceResponse | undefined, boolean, Error | null, () => void] => {
  const space = useGetSpace(id);

  if (space) {
    return space;
  }
  return [undefined, false, null, () => {}];
};
