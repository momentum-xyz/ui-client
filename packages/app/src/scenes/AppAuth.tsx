import {FC, ReactNode, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {PositionEnum} from '@momentum-xyz/ui-kit';
import {i18n} from '@momentum-xyz/core';

import {usePosBusEvent, useStore} from 'shared/hooks';
import {PosBusService, storage} from 'shared/services';
import {ROUTES} from 'core/constants';
import {StorageKeyEnum, WidgetEnum} from 'core/enums';
import {ToastContent} from 'ui-kit';

const AppAuth: FC<{children: ReactNode}> = ({children}) => {
  const {sessionStore, nftStore, universeStore, widgetManagerStore} = useStore();
  const {isSignUpInProgress} = sessionStore;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isSignUpInProgress) {
      navigate(ROUTES.explore);
      widgetManagerStore.open(WidgetEnum.LOGIN, PositionEnum.LEFT);
    }
  }, [isSignUpInProgress, navigate, widgetManagerStore]);

  useEffect(() => {
    if (
      sessionStore.isGuest &&
      !storage.get(StorageKeyEnum.HasSeenWelcome) &&
      location.pathname !== ROUTES.welcome
    ) {
      storage.setString(StorageKeyEnum.RedirectOnLogin, location.pathname);
      navigate(ROUTES.welcome);
    }
  }, [sessionStore.isGuest, navigate, location]);

  useEffect(() => {
    if (sessionStore.isProfileError) {
      sessionStore.signOutRedirect();
    }
  }, [sessionStore.isProfileError, sessionStore]);

  const worldNotFound = universeStore.world2dStore?.isWorldNotFound;
  useEffect(() => {
    if (worldNotFound) {
      toast.error(<ToastContent isDanger icon="alert" text={i18n.t('messages.worldNotCreated')} />);
      navigate(ROUTES.explore);
    }
    // somehow 'navigate' causes a change and re-execution of the useEffect, so skipping it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldNotFound]);

  useEffect(() => {
    if (sessionStore.token && sessionStore.user?.id) {
      console.log('[AppAuth]: PosBus init for ', sessionStore.user?.id);
      console.log('[AppAuth]: PosBus init for ', sessionStore.token);
      // temp disable passing worldId and teleport - breaks golang client sometimes
      // it's needed only for Guest -> User transition when inside world to refresh the active users list
      PosBusService.init(sessionStore.token, sessionStore.user.id); //, universeStore.worldId || null);
    }
  }, [sessionStore.token, sessionStore.user?.id]); //, universeStore.worldId]);

  usePosBusEvent('posbus-duplicated-sessions', () => {
    console.log('POSBUS-DUPLICATED-SESSIONS - leave world!');
    // PosBusService.leaveWorld(); - it's done in PosBusService - doesn't work here
    navigate({pathname: ROUTES.system.disconnected});
  });

  useEffect(() => {
    if (sessionStore.user && !sessionStore.user.isGuest) {
      nftStore.initMyWalletsAndStakes();
    }
  }, [nftStore, sessionStore.user, sessionStore.user?.isGuest]);

  useEffect(() => {
    if (sessionStore.token && sessionStore.user) {
      universeStore.init();
    }
  }, [sessionStore.token, sessionStore.user, universeStore]);

  return <>{sessionStore.isUserReady && children}</>;
};

export default observer(AppAuth);
