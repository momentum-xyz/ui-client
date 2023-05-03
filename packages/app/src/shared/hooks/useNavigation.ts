import {useCallback} from 'react';
import {generatePath, useNavigate} from 'react-router-dom';

import {ROUTES} from 'core/constants';

import {useStore} from './useStore';

export const useNavigation = () => {
  const {universeStore} = useStore();
  const baseWorldId = universeStore.worldId;

  const navigate = useNavigate();

  const goToOdysseyHome = useCallback(
    (worldId = baseWorldId) => {
      console.log(`Redirect to world ${worldId}`);

      if (worldId === baseWorldId) {
        /* Navigate user inside World */
        navigate(generatePath(ROUTES.odyssey.base, {worldId}));
      } else if (!baseWorldId) {
        /* Navigate user from Universe to World */
        navigate(generatePath(ROUTES.odyssey.base, {worldId}));
      } else {
        /* Navigate user from World to World */
        document.location = generatePath(ROUTES.odyssey.base, {worldId});
      }
    },
    [navigate, baseWorldId]
  );

  return {goToOdysseyHome};
};
