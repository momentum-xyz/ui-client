import React, {FC, useCallback, useEffect} from 'react';
import {generatePath, Switch, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';

import {ROUTES} from 'core/constants';
import {PrivateSpaceError} from 'core/errors';
import {createRoutesByConfig} from 'core/utils';
import {useStore, useDeviceChange} from 'shared/hooks';
import {StageModeRequestEnum} from 'core/enums';
import {
  Navigation,
  ToastContent,
  TOAST_GROUND_OPTIONS,
  NewDeviceDialog,
  CountdownDialog
} from 'ui-kit';
import {EmojiAnimationDockWidget} from 'scenes/widgets/pages';

import {
  AcceptedToJoinStageDialog,
  DeclinedToJoinStageDialog,
  InvitedOnStageDialog,
  PrepareOnStageDialog
} from './pages/StageModePage/components';
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
    textChatStore,
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

    rootStore.joinMeetingSpace(spaceId, false).catch((e) => {
      if (e instanceof PrivateSpaceError) {
        history.push(ROUTES.base);
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
  }, [agoraStore, history, rootStore, spaceId, t]);

  useEffect(() => {
    reJoinMeeting().then();
  }, [reJoinMeeting, spaceId]);

  useEffect(() => {
    collaborationStore.initBroadcast(spaceId);
  }, [collaborationStore, spaceId]);

  useEffect(() => {
    textChatStore.countUnreadMessages();
  }, [textChatStore.messageSent, textChatStore.textChatDialog.isOpen, textChatStore]);

  useEffect(() => {
    if (agoraStore.appId && !textChatStore.isLoggedOn) {
      textChatStore.init(agoraStore.appId, sessionStore.userId, spaceId);
    }
  }, [agoraStore.appId, sessionStore.userId, spaceId, textChatStore]);

  useEffect(() => {
    if (agoraScreenShareStore.videoTrack) {
      history.push(generatePath(ROUTES.collaboration.screenShare, {spaceId}));
    }
  }, [agoraScreenShareStore.videoTrack, history, spaceId]);

  const handleDecline = () => {
    acceptedToJoinStageDialog.close();
  };

  const handleCountdownEnded = useCallback(async () => {
    if (!agoraStageModeStore.canEnterStage) {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.stageModeFull')}
          isCloseButton
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
            isCloseButton
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
            isCloseButton
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

      <Switch>{createRoutesByConfig(COLLABORATION_ROUTES)}</Switch>

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
          onDecline={handleDecline}
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
        <EmojiAnimationDockWidget />
      </styled.BottomCenteredDock>
    </styled.Container>
  );
};

export default observer(Collaboration);
