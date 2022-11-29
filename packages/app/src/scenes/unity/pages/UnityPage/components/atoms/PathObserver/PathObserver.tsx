import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useLocation} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {isTargetRoute} from 'core/utils';
import {RouteConfigInterface} from 'core/interfaces';

interface PropsInterface {
  isTeleportReady: boolean;
  resumeUnity: () => void;
  pauseUnity: () => void;
}

const UNITY_WAITING_MS = 200;

const SKIPPED_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.magic,
    main: () => <></>
  }
];

const UNITY_ACTIVE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.grabTable,
    main: () => <></>
  },
  {
    path: ROUTES.flyWithMe.pilot,
    main: () => <></>
  },
  {
    path: ROUTES.flyWithMe.passenger,
    main: () => <></>
  },
  {
    path: ROUTES.worldBuilder.builder,
    main: () => <></>
  },
  {
    path: ROUTES.object.root,
    main: () => <></>,
    exact: false
  }
];

const PathObserver: FC<PropsInterface> = ({isTeleportReady, resumeUnity, pauseUnity}) => {
  const location = useLocation();

  const changeUnityState = useCallback(
    (pathname: string) => {
      if (isTargetRoute(pathname, UNITY_ACTIVE_ROUTES)) {
        resumeUnity();
      } else if (!isTargetRoute(pathname, SKIPPED_ROUTES)) {
        if (pathname === ROUTES.base) {
          resumeUnity();
        } else {
          pauseUnity();
        }
      }
    },
    [pauseUnity, resumeUnity]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      changeUnityState(location.pathname);
    }, UNITY_WAITING_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [changeUnityState, location.pathname, isTeleportReady]);

  return <></>;
};

export default observer(PathObserver);
