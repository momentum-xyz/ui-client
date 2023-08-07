import {FC, ReactNode, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useLocation, useNavigate} from 'react-router-dom';
import {PositionEnum} from '@momentum-xyz/ui-kit';

import {usePosBusEvent, useStore} from 'shared/hooks';
import {PosBusService, storage} from 'shared/services';
import {ROUTES} from 'core/constants';
import {StorageKeyEnum, WidgetEnum} from 'core/enums';

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
    if (location.pathname === ROUTES.buyNft) {
      sessionStore.setBuyNftFlow(true);
      if (sessionStore.isGuest) {
        widgetManagerStore.open(WidgetEnum.LOGIN, PositionEnum.LEFT);
      } else {
        widgetManagerStore.open(WidgetEnum.BUY_NFT, PositionEnum.LEFT);
      }
    } else if (
      sessionStore.isGuest &&
      !storage.get(StorageKeyEnum.HasSeenWelcome) &&
      location.pathname !== ROUTES.welcome
    ) {
      storage.setString(StorageKeyEnum.RedirectOnLogin, location.pathname);
      navigate(ROUTES.welcome);
    }
  }, [sessionStore.isGuest, navigate, location, widgetManagerStore, sessionStore]);

  useEffect(() => {
    if (sessionStore.isProfileError) {
      sessionStore.signOutRedirect();
    }
  }, [sessionStore.isProfileError, sessionStore]);

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
