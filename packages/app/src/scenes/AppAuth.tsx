import {FC, ReactNode, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {PositionEnum} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {PosBusService, storage} from 'shared/services';
import {ROUTES} from 'core/constants';
import {StorageKeyEnum, WidgetEnum} from 'core/enums';

const AppAuth: FC<{children: ReactNode}> = ({children}) => {
  const {sessionStore, nftStore, universeStore, widgetManagerStore} = useStore();
  const {isSignUpInProgress} = sessionStore;

  const navigate = useNavigate();

  useEffect(() => {
    if (isSignUpInProgress) {
      navigate(ROUTES.explore);
      widgetManagerStore.open(WidgetEnum.LOGIN, PositionEnum.LEFT);
    }
  }, [isSignUpInProgress, navigate, widgetManagerStore]);

  useEffect(() => {
    if (sessionStore.isGuest && !storage.get(StorageKeyEnum.HasSeenWelcome)) {
      navigate(ROUTES.welcome);
    }
  }, [sessionStore.isGuest, navigate]);

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
