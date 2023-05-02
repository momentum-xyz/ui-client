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
      navigate(
        generatePath(ROUTES.odyssey.base, {worldId})
        // {replace: true}
      );
    },
    [navigate, baseWorldId]
  );

  return {goToOdysseyHome};
};
