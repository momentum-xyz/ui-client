import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';

import {MeetingRoomPage, PosBusEventsPage} from './pages';
import * as styled from './Meeting.styled';

const Meeting: FC = () => {
  const rootStore = useStore();
  const {collaborationStore, agoraStore_OLD} = rootStore;
  const {agoraMeetingStore} = agoraStore_OLD;
  const {spaceStore} = collaborationStore;

  const navigate = useNavigate();
  const {t} = useTranslation();

  const onLeaveMeeting = useCallback(
    async (isKicked = false) => {
      //await rootStore.leaveMeetingSpace(isKicked);
      navigate(ROUTES.base);
    },
    [navigate, rootStore]
  );

  useEffect(() => {
    if (agoraMeetingStore.maxVideoStreamsReached) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.maximumParticipants')}
          showCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }
  }, [agoraMeetingStore.maxVideoStreamsReached, t]);

  return (
    <styled.Container>
      <MeetingRoomPage onLeave={onLeaveMeeting} />
      {spaceStore && !spaceStore.isTable && <PosBusEventsPage />}
    </styled.Container>
  );
};

export default observer(Meeting);
