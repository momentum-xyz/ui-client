import React, {FC, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {UserStatusEnum} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';

import {FlightPilot, PassengerAlert} from './components';
import * as styled from './FlyWithMePage.styled';

const FlyWithMePage: FC = () => {
  const {mainStore, sessionStore, flightStore} = useStore();
  const {agoraStore, unityStore} = mainStore;
  const {flyWithMeStore} = flightStore;
  const {pilot} = flyWithMeStore;

  const {spaceId, pilotId} = useParams<{spaceId: string; pilotId: string}>();
  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (!agoraStore.hasJoined) {
      history.push(ROUTES.base);
    }
  }, [agoraStore, history]);

  const isPilot = useMemo(() => {
    return sessionStore.userId === pilotId;
  }, [pilotId, sessionStore.userId]);

  useEffect(() => {
    flyWithMeStore.init(pilotId);
    unityStore.hideMinimap();

    return () => {
      unityStore.showMinimap();
      unityStore.disengageFlyWithMe();
      flyWithMeStore.resetModel();

      if (isPilot) {
        flyWithMeStore.stop(spaceId);
      }
    };
  }, [pilotId, unityStore, flyWithMeStore, isPilot, spaceId]);

  useEffect(() => {
    const previousStatus = sessionStore.profile?.status || UserStatusEnum.ONLINE;
    sessionStore.changeStatus(UserStatusEnum.DO_NOT_DISTURB);

    return () => {
      if (previousStatus !== UserStatusEnum.DO_NOT_DISTURB) {
        sessionStore.changeStatus(previousStatus);
      }
    };
  }, [sessionStore]);

  useEffect(() => {
    if (!isPilot) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('messages.flyWithMeActivated')}
          text={t('messages.flyWithMeEnjoy')}
          showCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }
  }, [isPilot, t]);

  return (
    <styled.Container>
      {pilot && (
        <styled.Inner>
          <FlightPilot
            pilotName={pilot.name}
            pilotStatus={pilot.status}
            pilotAvatarSrc={pilot.avatarSrc}
            onCloseOrDisengage={() => {
              history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId}));
            }}
          />
          {!isPilot && <PassengerAlert />}
        </styled.Inner>
      )}
    </styled.Container>
  );
};

export default observer(FlyWithMePage);
