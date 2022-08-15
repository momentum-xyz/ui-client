import React, {FC, useCallback, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useLocation} from 'react-router-dom';

import {ROUTES} from 'core/constants';

interface PropsInterface {
  isTeleportReady: boolean;
  resumeUnity: () => void;
  pauseUnity: () => void;
}

const UNITY_WAITING_MS = 200;

const PathObserver: FC<PropsInterface> = ({isTeleportReady, resumeUnity, pauseUnity}) => {
  const unityIsReady = useRef<boolean>(false);

  const location = useLocation();

  const changeUnityState = useCallback(
    (pathname: string) => {
      if (pathname === ROUTES.base) {
        resumeUnity();
      } else {
        pauseUnity();
      }
    },
    [pauseUnity, resumeUnity]
  );

  useEffect(() => {
    changeUnityState(location.pathname);
  }, [changeUnityState, location.pathname]);

  useEffect(() => {
    if (isTeleportReady && !unityIsReady.current) {
      unityIsReady.current = true;
      setTimeout(() => {
        changeUnityState(location.pathname);
      }, UNITY_WAITING_MS);
    }
  }, [changeUnityState, isTeleportReady, location.pathname]);

  return <></>;
};

export default observer(PathObserver);
