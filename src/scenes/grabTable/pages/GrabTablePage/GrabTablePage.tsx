import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {PrivateSpaceError} from 'core/errors';

const GrabTablePage: FC = () => {
  const rootStore = useStore();
  const {mainStore} = rootStore;
  const {agoraStore} = mainStore;

  const {spaceId} = useParams<{spaceId: string}>();
  const {t} = useTranslation();

  const reJoinMeeting = useCallback(async () => {
    if (agoraStore.hasJoined && agoraStore.spaceId === spaceId) {
      return;
    }

    if (agoraStore.hasJoined && agoraStore.spaceId !== spaceId) {
      await rootStore.leaveMeetingSpace();
    }

    rootStore.joinMeetingSpace(spaceId, true).catch((e) => {
      if (e instanceof PrivateSpaceError) {
        toast.error(
          <ToastContent
            isDanger
            isCloseButton
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('collaboration.spaceIsPrivate')}
          />
        );
      }
    });
  }, [agoraStore, rootStore, spaceId, t]);

  useEffect(() => {
    reJoinMeeting().then();
  }, [reJoinMeeting, spaceId]);

  return <></>;
};

export default observer(GrabTablePage);
