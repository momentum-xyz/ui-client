import {useSpaceGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useSpace = () => {
  const {isSpaceAdmin, spaceId, renderTopBarActions, api} = useSpaceGlobalProps();

  return {
    spaceId,
    isAdmin: isSpaceAdmin,
    renderTopBarActions,
    api
  };
};
