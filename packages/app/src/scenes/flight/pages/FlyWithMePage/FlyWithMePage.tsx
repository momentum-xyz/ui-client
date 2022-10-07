import React, {FC, useCallback, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {TOAST_NOT_AUTO_CLOSE_OPTIONS, ToastContent} from 'ui-kit';

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

  const closeOrDisengage = useCallback(() => {
    unityStore.showMinimap();
    unityStore.disengageFlyWithMe();
    flyWithMeStore.resetModel();

    if (isPilot) {
      flyWithMeStore.stop(spaceId);
    } else {
      history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId}));
    }
  }, [flyWithMeStore, history, isPilot, spaceId, unityStore]);

  useEffect(() => {
    flyWithMeStore.init(pilotId);
    unityStore.hideMinimap();

    return () => {
      closeOrDisengage();
    };
  }, [pilotId, unityStore, flyWithMeStore, closeOrDisengage]);

  useEffect(() => {
    if (!isPilot) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('messages.flyWithActivated')}
          text={t('messages.flyWithBlocked')}
          approveInfo={{title: 'Got it'}}
        />,
        TOAST_NOT_AUTO_CLOSE_OPTIONS
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
            onCloseOrDisengage={closeOrDisengage}
          />
          {!isPilot && <PassengerAlert />}
        </styled.Inner>
      )}
    </styled.Container>
  );
};

export default observer(FlyWithMePage);
