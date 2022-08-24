import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';

import {MeetingRoomPage, PosBusEventsPage} from './pages';
import * as styled from './Meeting.styled';

const Meeting: FC = () => {
  const rootStore = useStore();
  const {mainStore} = rootStore;
  const {agoraStore} = mainStore;
  const {agoraMeetingStore} = agoraStore;

  const history = useHistory();
  const {t} = useTranslation();

  const onLeaveMeeting = useCallback(
    async (isKicked = false) => {
      await rootStore.leaveMeetingSpace(isKicked);
      history.push(ROUTES.base);
    },
    [history, rootStore]
  );

  useEffect(() => {
    if (agoraMeetingStore.maxVideoStreamsReached) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.maximumParticipants')}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }
  }, [agoraMeetingStore.maxVideoStreamsReached, t]);

  return (
    <styled.Container>
      <MeetingRoomPage onLeave={onLeaveMeeting} />
      <PosBusEventsPage />
    </styled.Container>
  );
};

export default observer(Meeting);
