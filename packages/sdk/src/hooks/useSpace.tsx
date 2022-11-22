import {useSpaceGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useSpace = () => {
  const {isSpaceAdmin, spaceId, spaceName, pluginApi, onClose} = useSpaceGlobalProps();

  return {
    spaceId,
    spaceName,
    isAdmin: isSpaceAdmin,
    pluginApi,
    onClose
  };
};
