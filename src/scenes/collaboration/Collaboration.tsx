import React, {FC, useEffect, useRef, useState} from 'react';
import {generatePath, Switch, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';

import {ROUTES} from 'core/constants';
import {NavigationTabInterface} from 'core/interfaces';
import {Navigation, ToastContent, TOAST_GROUND_OPTIONS} from 'ui-kit';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {PosBusEventEnum, StageModeRequestEnum, StageModeStatusEnum} from 'core/enums';
import {createRoutesByConfig} from 'core/utils';
// TODO: Refactoring
import Modal, {ModalRef} from 'component/util/Modal';
import StageModeModalController from 'component/molucules/StageMode/StageModeModalController';
import NewDevicePopup from 'component/popup/new-device/NewDevicePopup';
import {useStageModePopupQueueContext} from 'context/StageMode/StageModePopupQueueContext';
import {useModerator} from 'context/Integration/hooks/useIntegration';
import {PrivateSpaceError} from 'core/errors';

import {COLLABORATION_ROUTES} from './CollaborationRoutes';

const Collaboration: FC = () => {
  const {collaborationStore, mainStore, sessionStore} = useStore();
  const {unityStore, agoraStore} = mainStore;

  const {addRequestPopup} = useStageModePopupQueueContext();

  const {spaceId} = useParams<{spaceId: string}>();
  const {t} = useTranslation();
  const history = useHistory();
  const [isModerator, , ,] = useModerator(spaceId);

  const switchDeviceModal = useRef<ModalRef>(null);
  const [newDevice, setNewDevice] = useState<MediaDeviceInfo>();

  useEffect(() => {
    unityStore.pause();

    return unityStore.resume;
  }, [unityStore]);

  useEffect(() => {
    (async () => {
      try {
        await collaborationStore.joinMeetingSpace(spaceId);
        await agoraStore.joinMeetingSpace(sessionStore.userId, spaceId);
      } catch (e) {
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
      }
    })();

    return () => {
      agoraStore.leaveMeetingSpace();
    };
  }, [agoraStore, collaborationStore, collaborationStore.space, sessionStore.userId, spaceId, t]);

  useEffect(() => {
    if (agoraStore.screenShare) {
      history.push(generatePath(ROUTES.collaboration.screenShare, {spaceId}));
    }
  }, [agoraStore.screenShare, history, spaceId]);

  usePosBusEvent('posbus-connected', () => {
    if (collaborationStore.space.id) {
      unityStore.triggerInteractionMessage(
        PosBusEventEnum.EnteredSpace,
        collaborationStore.space.id,
        0,
        ''
      );
    }
  });

  usePosBusEvent('stage-mode-request', (userId) => {
    if (isModerator) {
      addRequestPopup(userId, {
        user: userId,
        onAccept: async () => {
          try {
            await agoraStore.requestRespond(userId, StageModeRequestEnum.ACCEPT);
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
            await agoraStore.requestRespond(userId, StageModeRequestEnum.DECLINE);
            return true;
          } catch {
            return false;
          }
        }
      });
    }
  });

  usePosBusEvent('stage-mode-toggled', async (stageModeStatus) => {
    await agoraStore.joinMeetingSpace(sessionStore.userId);

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
      <ToastContent
        headerIconName="alert"
        title={t('titles.stage')}
        text={t('messages.stageModeActivated')}
        isCloseButton
      />;
    }
  });

  usePosBusEvent('stage-mode-user-joined', agoraStore.addStageModeUser);
  usePosBusEvent('stage-mode-user-left', agoraStore.removeStageModeUser);

  useEffect(() => {
    navigator.mediaDevices.ondevicechange = () => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setNewDevice(devices[1]);
        switchDeviceModal.current?.open();
      });
    };

    return () => {
      navigator.mediaDevices.ondevicechange = null;
    };
  }, []);

  const handleSwitchDeviceModalClose = () => {
    switchDeviceModal.current?.close();
    setNewDevice(undefined);
  };

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
      isActive: !!agoraStore.screenShare
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
      <Modal ref={switchDeviceModal}>
        <NewDevicePopup
          onClose={handleSwitchDeviceModalClose}
          deviceKindDescription={newDeviceKindDescription()}
          deviceLabel={newDevice?.label}
        />
      </Modal>
    </>
  );
};

export default observer(Collaboration);
