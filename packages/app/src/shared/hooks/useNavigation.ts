import {useCallback} from 'react';
import {generatePath, useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';

import {useStore} from './useStore';

export const useNavigation = () => {
  const {sessionStore, unityStore} = useStore();
  const {isUnityAvailable, unityInstanceStore} = unityStore;

  const history = useHistory();

  const goToOdysseyHome = useCallback(
    (worldId: string) => {
      if (isUnityAvailable) {
        console.log(`Teleport inside unity to ${worldId}`);
        history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
        unityInstanceStore.loadWorldById(worldId, sessionStore.token);
      } else {
        console.log(`Redirect to unity to ${worldId}`);
        history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
      }
    },
    [history, isUnityAvailable, sessionStore.token, unityInstanceStore]
  );

  return {goToOdysseyHome};
};
