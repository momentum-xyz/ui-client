import React, {FC, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {UserStatusEnum} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';

import {FlightPilot, PassengerAlert} from './components';
import * as styled from './FlyWithMePage.styled';

const FlyWithMePage: FC = () => {
  const {unityStore, sessionStore, flightStore, agoraStore_OLD} = useStore();
  const {unityInstanceStore} = unityStore;
  const {flyWithMeStore} = flightStore;
  const {pilot} = flyWithMeStore;

  const {spaceId, pilotId} = useParams<{spaceId: string; pilotId: string}>();
  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (!agoraStore_OLD.hasJoined) {
      history.push(ROUTES.base);
    }
  }, [agoraStore_OLD, history]);

  const isPilot = useMemo(() => {
    return sessionStore.userId === pilotId;
  }, [pilotId, sessionStore.userId]);

  useEffect(() => {
    flyWithMeStore.init(pilotId);
    unityInstanceStore.hideMinimap();

    return () => {
      unityInstanceStore.showMinimap();
      unityInstanceStore.disengageFlyWithMe();
      flyWithMeStore.resetModel();

      if (isPilot) {
        flyWithMeStore.stop(spaceId);
      }
    };
  }, [pilotId, unityInstanceStore, flyWithMeStore, isPilot, spaceId]);

  useEffect(() => {
    const previousStatus = sessionStore.user?.status || UserStatusEnum.ONLINE;
    //sessionStore.changeStatus(UserStatusEnum.DO_NOT_DISTURB);

    return () => {
      if (previousStatus !== UserStatusEnum.DO_NOT_DISTURB) {
        //sessionStore.changeStatus(previousStatus);
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
