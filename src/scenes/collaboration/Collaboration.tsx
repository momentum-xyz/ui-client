import React, {FC, useCallback, useEffect, useState} from 'react';
import {generatePath, Switch, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';

import {ROUTES} from 'core/constants';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {PosBusEventEnum, StageModeRequestEnum, StageModeStatusEnum} from 'core/enums';
import {createRoutesByConfig} from 'core/utils';
import {
  Navigation,
  ToastContent,
  TOAST_GROUND_OPTIONS,
  NewDeviceDialog,
  CountdownDialog
} from 'ui-kit';

import {
  AcceptedToJoinStageDialog,
  DeclinedToJoinStageDialog,
  InvitedOnStageDialog,
  PrepareOnStageDialog
} from './pages/StageModePage/components';
import {COLLABORATION_ROUTES, buildNavigationTabs} from './Collaboration.routes';
import * as styled from './Collaboration.styled';

const Collaboration: FC = () => {
  const {collaborationStore, mainStore, sessionStore} = useStore();
  const {unityStore, agoraStore} = mainStore;
  const {agoraScreenShareStore, agoraStageModeStore, userDevicesStore} = agoraStore;
  const {
    newDeviceDialog,
    stageModeStore,
    acceptedToJoinStageDialog,
    declinedToJoinStageDialog,
    invitedOnStageDialog,
    prepareOnStageDialog,
    countdownDialog,
    textChatStore
  } = collaborationStore;

  const {spaceId} = useParams<{spaceId: string}>();
  const {t} = useTranslation();
  const history = useHistory();

  const [newDevice, setNewDevice] = useState<MediaDeviceInfo>();
  const [accepted, setAccepted] = useState<boolean>();

  useEffect(() => {
    textChatStore.countUnreadMessages();
  }, [textChatStore.messageSent, textChatStore.textChatDialog.isOpen]);

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

  const isHandlingInviteOrRequest = () => {
    return (
      acceptedToJoinStageDialog.isOpen ||
      invitedOnStageDialog.isOpen ||
      prepareOnStageDialog.isOpen ||
      countdownDialog.isOpen ||
      agoraStageModeStore.isOnStage
    );
  };

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

    if (!accepted) {
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
    } else if (accepted) {
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
  }, [agoraStageModeStore, countdownDialog, accepted, t, userDevicesStore.createLocalTracks]);

  const handleCountdownCanceled = () => {
    countdownDialog.close();
    prepareOnStageDialog.close();
  };

  const handleInviteDeclined = useCallback(async () => {
    await agoraStageModeStore.invitationRespond(StageModeRequestEnum.DECLINE);
    invitedOnStageDialog.close();
  }, [agoraStageModeStore, invitedOnStageDialog]);

  usePosBusEvent('stage-mode-invite', () => {
    if (!isHandlingInviteOrRequest()) {
      invitedOnStageDialog.open();
      setAccepted(false);
    }
  });

  usePosBusEvent('stage-mode-accepted', (userId) => {
    if (userId === sessionStore.userId) {
      if (!isHandlingInviteOrRequest()) {
        acceptedToJoinStageDialog.open();
        setAccepted(true);
      }
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    if (userId === sessionStore.userId) {
      declinedToJoinStageDialog.open();
    }
  });

  usePosBusEvent('posbus-connected', () => {
    if (collaborationStore.space) {
      unityStore.triggerInteractionMessage(
        PosBusEventEnum.EnteredSpace,
        collaborationStore.space.id,
        0,
        ''
      );
    }
  });

  usePosBusEvent('stage-mode-request', (userId) => {
    if (collaborationStore.isModerator) {
      stageModeStore.addRequestPopup(userId, {
        user: userId,
        onAccept: async () => {
          try {
            await agoraStageModeStore.requestRespond(userId, StageModeRequestEnum.ACCEPT);
            return true;
          } catch {
            toast.error(
              <ToastContent
                isDanger
                headerIconName="alert"
                title={t('titles.alert')}
                text={t('messages.userRequestDeny')}
                isCloseButton
              />
            );
            return false;
          }
        },
        onDecline: async () => {
          try {
            await agoraStageModeStore.requestRespond(userId, StageModeRequestEnum.DECLINE);
            return true;
          } catch {
            return false;
          }
        }
      });
    }
  });

  usePosBusEvent('stage-mode-toggled', async (stageModeStatus) => {
    const showStageIsFull = await agoraStore.toggledStageMode(
      sessionStore.userId,
      collaborationStore.isModerator
    );

    if (showStageIsFull) {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.stageIsFull')}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }

    const isStageMode = stageModeStatus === StageModeStatusEnum.INITIATED;

    if (isStageMode) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.stage')}
          text={t('messages.stageModeActivated')}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
      history.push(generatePath(ROUTES.collaboration.stageMode, {spaceId}));
    } else {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.stage')}
          text={t('messages.stageModeDeActivated')}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }
  });

  usePosBusEvent('stage-mode-user-joined', agoraStageModeStore.addStageModeUser);
  usePosBusEvent('stage-mode-user-left', agoraStageModeStore.removeStageModeUser);
  usePosBusEvent('stage-mode-kick', agoraStageModeStore.moveToAudience);

  useEffect(() => {
    navigator.mediaDevices.ondevicechange = () => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setNewDevice(devices[1]);
        newDeviceDialog.open();
      });
    };

    return () => {
      navigator.mediaDevices.ondevicechange = null;
    };
  }, [newDeviceDialog]);

  const newDeviceKindDescription = () => {
    switch (newDevice?.kind) {
      case 'videoinput':
        return 'video input';
      case 'audioinput':
        return 'audio input';
      case 'audiooutput':
        return 'audio output';
      default:
        return '';
    }
  };

  return (
    <styled.Container>
      <Navigation
        tabs={buildNavigationTabs(
          spaceId,
          agoraStore.isStageMode,
          !!agoraScreenShareStore.videoTrack
        )}
      />

      <Switch>{createRoutesByConfig(COLLABORATION_ROUTES)}</Switch>

      {newDeviceDialog.isOpen && (
        <NewDeviceDialog
          onClose={newDeviceDialog.close}
          deviceKindDescription={newDeviceKindDescription()}
          deviceLabel={newDevice?.label}
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
    </styled.Container>
  );
};

export default observer(Collaboration);
