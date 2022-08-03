import React, {FC, useEffect, useState} from 'react';
import {generatePath, Switch, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';

import {ROUTES} from 'core/constants';
import {NavigationTabInterface} from 'core/interfaces';
import {Navigation, ToastContent, TOAST_GROUND_OPTIONS, NewDeviceDialog} from 'ui-kit';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {PosBusEventEnum, StageModeRequestEnum, StageModeStatusEnum} from 'core/enums';
import {createRoutesByConfig} from 'core/utils';
import StageModeModalController from 'component/molucules/StageMode/StageModeModalController';
import {PrivateSpaceError} from 'core/errors';

import {COLLABORATION_ROUTES} from './CollaborationRoutes';

const Collaboration: FC = () => {
  const rootStore = useStore();
  const {collaborationStore, mainStore, sessionStore} = rootStore;
  const {unityStore, agoraStore} = mainStore;
  const {agoraScreenShareStore, agoraStageModeStore, userDevicesStore} = agoraStore;
  const {newDeviceDialog, stageModeStore} = collaborationStore;

  const {spaceId} = useParams<{spaceId: string}>();
  const {t} = useTranslation();
  const history = useHistory();

  const [newDevice, setNewDevice] = useState<MediaDeviceInfo>();

  useEffect(() => {
    rootStore.joinMeetingSpace(spaceId).catch((e) => {
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

    return () => {
      rootStore.leaveMeetingSpace();
    };
  }, [rootStore, sessionStore.userId, spaceId, t]);

  useEffect(() => {
    if (agoraScreenShareStore.videoTrack) {
      history.push(generatePath(ROUTES.collaboration.screenShare, {spaceId}));
    }
  }, [agoraScreenShareStore.videoTrack, history, spaceId]);

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

  const tabs: NavigationTabInterface[] = [
    {
      path: generatePath(ROUTES.collaboration.dashboard, {spaceId}),
      iconName: 'tiles'
    },
    {
      path: generatePath(ROUTES.collaboration.calendar, {spaceId}),
      iconName: 'calendar'
    },
    {
      path: generatePath(ROUTES.collaboration.stageMode, {spaceId}),
      iconName: 'stage',
      isActive: agoraStore.isStageMode
    },
    {
      path: generatePath(ROUTES.collaboration.screenShare, {spaceId}),
      iconName: 'screenshare',
      isActive: !!agoraScreenShareStore.videoTrack
    },
    {
      path: generatePath(ROUTES.collaboration.miro, {spaceId}),
      iconName: 'miro'
    },
    {
      path: generatePath(ROUTES.collaboration.googleDrive, {spaceId}),
      iconName: 'drive'
    }
  ];

  return (
    <>
      <Navigation tabs={tabs} />
      <StageModeModalController />
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
    </>
  );
};

export default observer(Collaboration);
