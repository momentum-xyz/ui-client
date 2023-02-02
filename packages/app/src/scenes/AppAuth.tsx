import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {CheckJobStatusEnum} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';

const PROFILE_JOB_CHECKER_MS = 5 * 1000;

const AppAuth: FC = ({children}) => {
  const {sessionStore, nftStore} = useStore();

  const history = useHistory();
  const {t} = useTranslation();
  const {pathname} = useLocation<{pathname: string}>();

  if (pathname === ROUTES.signIn && !sessionStore.isGuest) {
    history.push(ROUTES.explore);
  }

  if (pathname === ROUTES.explore && sessionStore.isGuest) {
    history.push(ROUTES.signIn);
  }

  // FIXME: It should be removed. Profile changes should come from a new PosBus
  useEffect(() => {
    let jobInterval: NodeJS.Timer | undefined;
    console.log('!!!!!!!!!!!!!!!! PROFILE !!!!!!!!!!!!!!!!');
    console.log(sessionStore.profileJobId);

    if (sessionStore.profileJobId) {
      jobInterval = setInterval(() => {
        sessionStore.fetchProfileJobStatus().then((status) => {
          if (status === CheckJobStatusEnum.StatusDone) {
            sessionStore.clearJobId();

            // TODO: Update data

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
  }, [sessionStore.profileJobId, sessionStore, t]);

  useEffect(() => {
    if (sessionStore.wallet && !nftStore.isLoading) {
      nftStore.activateWallet(sessionStore.wallet);
    }
  }, [nftStore, nftStore.isLoading, sessionStore.wallet]);

  return <>{sessionStore.isUserReady && children}</>;
};

export default observer(AppAuth);
