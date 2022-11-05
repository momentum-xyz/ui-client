import {useSpaceGlobalProps} from '../contexts';

export const useSpace = () => {
  const {isSpaceAdmin, spaceId} = useSpaceGlobalProps();

  return {
    spaceId,
    isAdmin: isSpaceAdmin
  };
};
