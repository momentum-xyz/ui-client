import {FC, ReactNode, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {PosBusService} from 'shared/services';
//import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';

//const PROFILE_JOB_CHECKER_MS = 3 * 1000;

const AppAuth: FC<{children: ReactNode}> = ({children}) => {
  const {sessionStore, nftStore, universeStore} = useStore();

  //const {t} = useI18n();

  // FIXME: It should be removed. Profile changes should come from a new PosBus
  /*useEffect(() => {
    let jobInterval: NodeJS.Timer | undefined;

    if (sessionStore.profileJobId) {
      jobInterval = setInterval(() => {
        sessionStore.fetchProfileJobStatus().then((status) => {
          if (status === CheckJobStatusEnum.StatusDone) {
            sessionStore.clearJobId();
            sessionStore.loadUserProfile();
            nftStore.fetchNfts();

            toast.info(
              <ToastContent
                headerIconName="people"
                title={t('titles.alert')}
                text={t('editProfileWidget.saveSuccess')}
                showCloseButton
              />,
              TOAST_GROUND_OPTIONS
            );
          } else if (status === CheckJobStatusEnum.StatusFailed) {
            sessionStore.clearJobId();

            toast.error(
              <ToastContent
                isDanger
                headerIconName="people"
                title={t('titles.alert')}
                text={t('editProfileWidget.saveFailure')}
                showCloseButton
              />
            );
          }
        });
      }, PROFILE_JOB_CHECKER_MS);
    }

    return () => {
      clearInterval(jobInterval);
    };
  }, [sessionStore.profileJobId, sessionStore, nftStore, t]);*/

  useEffect(() => {
    if (sessionStore.wallet && !nftStore.isLoading) {
      nftStore.activateWallet(sessionStore.wallet);
    }
  }, [nftStore, nftStore.isLoading, sessionStore.wallet]);

  useEffect(() => {
    if (sessionStore.token && sessionStore.user) {
      PosBusService.init(sessionStore.token, sessionStore.user.id);
    }
  }, [sessionStore.token, sessionStore.user]);

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
