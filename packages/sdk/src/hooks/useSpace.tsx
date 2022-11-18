import {useSpaceGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useSpace = () => {
  const {isSpaceAdmin, spaceId, pluginApi} = useSpaceGlobalProps();

  return {
    spaceId,
    isAdmin: isSpaceAdmin,
    pluginApi
  };
};
