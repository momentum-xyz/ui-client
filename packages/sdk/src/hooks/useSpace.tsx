import {useSpaceGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useSpace = () => {
  const {isSpaceAdmin, spaceId, renderTopBarActions, pluginApi, setSubtitle} =
    useSpaceGlobalProps();

  return {
    spaceId,
    isAdmin: isSpaceAdmin,
    renderTopBarActions,
    pluginApi,
    setSubtitle
  };
};
