import {useSpaceGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useSpace = () => {
  const {isSpaceAdmin, spaceId, renderTopBarActions, pluginStateAPI} = useSpaceGlobalProps();

  return {
    spaceId,
    isAdmin: isSpaceAdmin,
    renderTopBarActions,
    pluginStateAPI
  };
};
