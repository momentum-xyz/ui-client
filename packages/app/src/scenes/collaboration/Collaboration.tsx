import React, {FC, useCallback, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Navigation} from '@momentum/ui-kit';

import {ROUTES} from 'core/constants';
import {PrivateSpaceError} from 'core/errors';
import {createSwitchByConfig} from 'core/utils';
import {useStore, useDeviceChange} from 'shared/hooks';
import {StageModeRequestEnum} from 'core/enums';
import {ToastContent, TOAST_GROUND_OPTIONS, NewDeviceDialog, CountdownDialog} from 'ui-kit';

import {
  AcceptedToJoinStageDialog,
  DeclinedToJoinStageDialog,
  InvitedOnStageDialog,
  PrepareOnStageDialog
} from './pages/StageModePage/components';
import {EmojiAnimationDock} from './components';
import {COLLABORATION_ROUTES, buildNavigationTabs} from './Collaboration.routes';
import * as styled from './Collaboration.styled';

const Collaboration: FC = () => {
  const rootStore = useStore();
  const {collaborationStore, mainStore, sessionStore} = rootStore;
  const {agoraStore} = mainStore;
  const {agoraScreenShareStore, agoraStageModeStore, userDevicesStore} = agoraStore;
  const {
    newDeviceDialog,
    acceptedToJoinStageDialog,
    declinedToJoinStageDialog,
    invitedOnStageDialog,
    prepareOnStageDialog,
    countdownDialog,
    streamChatStore,
    liveStreamStore,
    stageModeStore
  } = collaborationStore;

  const {spaceId} = useParams<{spaceId: string}>();
  const {t} = useTranslation();
  const history = useHistory();

  const reJoinMeeting = useCallback(async () => {
    if (agoraStore.hasJoined && agoraStore.spaceId === spaceId) {
      return;
    }

    if (agoraStore.hasJoined && agoraStore.spaceId !== spaceId) {
      await rootStore.leaveMeetingSpace();
    }

    rootStore
      .joinMeetingSpace(spaceId, false)
      .then(() => {
        if (!streamChatStore.isLoggedOn) {
          streamChatStore.init(sessionStore.userId, spaceId, sessionStore.profile ?? undefined);
        }
      })
      .catch((e) => {
        if (e instanceof PrivateSpaceError) {
          history.push(ROUTES.base);
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
      });
  }, [agoraStore, history, rootStore, sessionStore, spaceId, t, streamChatStore]);

  useEffect(() => {
    reJoinMeeting().then();
  }, [reJoinMeeting, spaceId]);

  useEffect(() => {
    collaborationStore.initBroadcast(spaceId);
  }, [collaborationStore, spaceId]);

  const handleCountdownEnded = useCallback(async () => {
    if (agoraStageModeStore.isStageFull) {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.stageModeFull')}
          showCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
      countdownDialog.close();
      return;
    }

    if (!stageModeStore.acceptedRequestToJoinStage) {
      try {
        await agoraStageModeStore.invitationRespond(StageModeRequestEnum.ACCEPT);
        await agoraStageModeStore.enterStage(userDevicesStore.createLocalTracks);
      } catch {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.joinStageRefused')}
            showCloseButton
          />
        );
      } finally {
        countdownDialog.close();
      }
    } else if (stageModeStore.acceptedRequestToJoinStage) {
      try {
        await agoraStageModeStore.enterStage(userDevicesStore.createLocalTracks);
        countdownDialog.close();
      } catch {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.joinStageRefused')}
            showCloseButton
          />
        );
      }
    }

    stageModeStore.setAcceptedRequestToJoinStage(undefined);
  }, [agoraStageModeStore, countdownDialog, stageModeStore, t, userDevicesStore.createLocalTracks]);

  const handleCountdownCanceled = () => {
    countdownDialog.close();
    prepareOnStageDialog.close();
  };

  const handleInviteDeclined = useCallback(async () => {
    await agoraStageModeStore.invitationRespond(StageModeRequestEnum.DECLINE);
    invitedOnStageDialog.close();
  }, [agoraStageModeStore, invitedOnStageDialog]);

  const {device} = useDeviceChange(newDeviceDialog.open);

  return (
    <styled.Container>
      <Navigation
        tabs={buildNavigationTabs(
          spaceId,
          agoraStore.isStageMode,
          !!agoraScreenShareStore.videoTrack,
          liveStreamStore.isStreaming
        )}
      />

      {createSwitchByConfig(COLLABORATION_ROUTES)}

      {newDeviceDialog.isOpen && (
        <NewDeviceDialog
          onClose={newDeviceDialog.close}
          deviceKindDescription={device && t(`labels.${device.kind}`).toLowerCase()}
          deviceLabel={device?.label}
          currentAudioDeviceId={userDevicesStore.currentAudioInput?.deviceId}
          currentVideoDeviceId={userDevicesStore.currentVideoInput?.deviceId}
          audioDevices={userDevicesStore.audioInputOptions}
          videoDevices={userDevicesStore.videoInputsOption}
          onAudioDeviceSelect={userDevicesStore.selectAudioInput}
          onVideoDeviceSelect={userDevicesStore.selectVideoInput}
        />
      )}
      {acceptedToJoinStageDialog.isOpen && (
        <AcceptedToJoinStageDialog
          onReady={prepareOnStageDialog.open}
          onDecline={acceptedToJoinStageDialog.close}
          onClose={acceptedToJoinStageDialog.close}
        />
      )}
      {countdownDialog.isOpen && (
        <CountdownDialog
          title={t('titles.goingOnStage')}
          onSave={handleCountdownEnded}
          onClose={handleCountdownCanceled}
        />
      )}
      {declinedToJoinStageDialog.isOpen && (
        <DeclinedToJoinStageDialog onClose={declinedToJoinStageDialog.close} />
      )}
      {invitedOnStageDialog.isOpen && (
        <InvitedOnStageDialog
          onClose={invitedOnStageDialog.close}
          onGetReady={prepareOnStageDialog.open}
          onDecline={handleInviteDeclined}
        />
      )}
      {prepareOnStageDialog.isOpen && (
        <PrepareOnStageDialog onClose={prepareOnStageDialog.close} onReady={countdownDialog.open} />
      )}

      <styled.BottomCenteredDock>
        <EmojiAnimationDock />
      </styled.BottomCenteredDock>
    </styled.Container>
  );
};

export default observer(Collaboration);
