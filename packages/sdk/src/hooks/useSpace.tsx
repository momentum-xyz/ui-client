import {useSpaceGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useSpace = () => {
  const {isSpaceAdmin, spaceId, pluginApi, onClose} = useSpaceGlobalProps();

  return {
    spaceId,
    isAdmin: isSpaceAdmin,
    pluginApi,
    onClose
  };
};
