import {useCallback} from 'react';
import {generatePath, useNavigate} from 'react-router-dom';

import {ROUTES} from 'core/constants';

export const useNavigation = () => {
  const navigate = useNavigate();

  const goToOdysseyHome = useCallback(
    (worldId: string) => {
      console.log(`Redirect to world ${worldId}`);
      navigate(generatePath(ROUTES.odyssey.base, {worldId}), {replace: true});
    },
    [navigate]
  );

  return {goToOdysseyHome};
};
