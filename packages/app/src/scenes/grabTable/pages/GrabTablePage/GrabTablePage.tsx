import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useParams} from 'react-router-dom';

import {useStore} from 'shared/hooks';

const GrabTablePage: FC = () => {
  const rootStore = useStore();
  const {mainStore} = rootStore;
  const {agoraStore_OLD} = mainStore;

  const {spaceId} = useParams<{spaceId: string}>();

  const reJoinMeeting = useCallback(async () => {
    if (agoraStore_OLD.hasJoined && agoraStore_OLD.spaceId === spaceId) {
      return;
    }

    if (agoraStore_OLD.hasJoined && agoraStore_OLD.spaceId !== spaceId) {
      //await rootStore.leaveMeetingSpace();
    }

    /*rootStore.joinMeetingSpace(spaceId, true).catch((e) => {
      if (e instanceof PrivateSpaceError) {
        toast.error(
          <ToastContent
            isDanger
            showCloseButton
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('collaboration.spaceIsPrivate')}
          />
        );
      }
    });*/
  }, [agoraStore_OLD, rootStore, spaceId]);

  useEffect(() => {
    reJoinMeeting().then();
  }, [reJoinMeeting, spaceId]);

  return <></>;
};

export default observer(GrabTablePage);
