import {useCallback} from 'react';
import {generatePath, useNavigate} from 'react-router-dom';

import {ROUTES} from 'core/constants';

import {useStore} from './useStore';

export const useNavigation = () => {
  const {sessionStore, unityStore} = useStore();
  const {isUnityAvailable, unityInstanceStore} = unityStore;

  const navigate = useNavigate();

  const goToOdysseyHome = useCallback(
    (worldId: string) => {
      if (isUnityAvailable) {
        console.log(`Teleport inside unity to ${worldId}`);
        navigate(generatePath(ROUTES.odyssey.base, {worldId}), {replace: true});
        unityInstanceStore.loadWorldById(worldId, sessionStore.token);
      } else {
        console.log(`Redirect to unity to ${worldId}`);
        navigate(generatePath(ROUTES.odyssey.base, {worldId}), {replace: true});
      }
    },
    [navigate, isUnityAvailable, sessionStore.token, unityInstanceStore]
  );

  return {goToOdysseyHome};
};
