import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {generatePath, Switch, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';

import {ROUTES} from 'core/constants';
import {NavigationTabInterface} from 'core/interfaces';
import {Navigation, ToastContent} from 'ui-kit';
import {UnityService} from 'shared/services';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {PosBusEventEnum, StageModeStatusEnum} from 'core/enums';
import {bytesToUuid, createRoutesByConfig} from 'core/utils';
// TODO: Refactoring
import useCollaboration, {
  useJoinCollaborationSpaceByAssign
} from 'context/Collaboration/hooks/useCollaboration';
import {
  useStageModeJoin,
  useStageModeLeave,
  useStageModeStatusInfo
} from 'hooks/api/useStageModeService';
import Modal, {ModalRef} from 'component/util/Modal';
import {useAgoraStageMode} from 'hooks/communication/useAgoraStageMode';
import {useAgoraScreenShare} from 'hooks/communication/useAgoraScreenShare';
import {COLLABORATION_STAGE_MODE_ACTION_UPDATE} from 'context/Collaboration/CollaborationReducer';
import {ParticipantRole, ParticipantStatus} from 'context/Collaboration/CollaborationTypes';
import StageModeModalController from 'component/molucules/StageMode/StageModeModalController';
import NewDevicePopup from 'component/popup/new-device/NewDevicePopup';

import {COLLABORATION_ROUTES} from './CollaborationRoutes';

const Collaboration: FC = () => {
  const {collaborationStore, mainStore} = useStore();
  const {spaceStore} = collaborationStore;
  const {unityStore} = mainStore;

  const {spaceId} = useParams<{spaceId: string}>();
  const {t} = useTranslation();
  const history = useHistory();

  const {screenShare} = useAgoraScreenShare();
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const stageModeState = useStageModeStatusInfo(collaborationState.collaborationSpace?.id);
  const switchDeviceModal = useRef<ModalRef>(null);
  const [newDevice, setNewDevice] = useState<MediaDeviceInfo>();
  const agoraStageMode = useAgoraStageMode();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const stageModeJoin = useStageModeJoin(collaborationState.collaborationSpace?.id);
  const stageModeLeave = useStageModeLeave(collaborationState.collaborationSpace?.id);

  usePosBusEvent('posbus-connected', () => {
    if (collaborationStore.spaceStore.space.id) {
      unityStore.triggerInteractionMessage(
        PosBusEventEnum.EnteredSpace,
        collaborationStore.spaceStore.space.id,
        0,
        ''
      );
    }
  });

  const joinMeeting = useCallback(async () => {
    if (await spaceStore.canUserJoin(spaceId)) {
      await joinMeetingSpace(spaceId);
      collaborationStore.init(spaceId);
      return;
    }

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
  }, [collaborationStore, history, joinMeetingSpace, spaceId, spaceStore, t]);

  const joinStageMode = () => {
    collaborationDispatch({
      type: COLLABORATION_STAGE_MODE_ACTION_UPDATE,
      stageMode: true
    });
  };

  const leaveStageMode = () => {
    collaborationDispatch({
      type: COLLABORATION_STAGE_MODE_ACTION_UPDATE,
      stageMode: false
    });
  };

  useEffect(() => {
    unityStore.pause();
    joinMeeting().then();

    return () => {
      unityStore.resume();
    };
  }, [unityStore]);

  useEffect(() => {
    if (collaborationState.collaborationSpace) {
      if (collaborationState.stageMode) {
        console.info('[STAGEMODE] Stage Mode Enabled');
        stageModeJoin().then(({spaceIntegrationUsers}) => {
          console.info('[STAGEMODE] spaceIntegrationUsers', spaceIntegrationUsers);
          if (spaceIntegrationUsers) {
            const retrievedIntegrationUsers = spaceIntegrationUsers
              .filter(
                (integrationUser) =>
                  integrationUser.flag !== ParticipantStatus.STATUS_LEFT && integrationUser.userId
              )
              .map((integrationUser) => ({
                uid: bytesToUuid(integrationUser.userId.data),
                role: ParticipantRole.AUDIENCE_MEMBER,
                status: integrationUser.flag
              }));
            console.info('[stagemode] retrievedIntegrationUsers', retrievedIntegrationUsers);
            agoraStageMode.setStageModeUsers(retrievedIntegrationUsers);
          }
        });
      } else {
        console.info('[STAGEMODE] Stage Mode Disabled');
        stageModeLeave().then();
      }
    }
  }, [collaborationState.stageMode]);

  useEffect(() => {
    console.info(stageModeState);
    if (!stageModeState?.data) {
      return;
    }

    const shouldActivateStageMode =
      stageModeState?.data.stageModeStatus === StageModeStatusEnum.INITIATED;

    if (shouldActivateStageMode && !collaborationState.stageMode) {
      joinStageMode();
    }

    if (!shouldActivateStageMode && collaborationState.stageMode) {
      leaveStageMode();
    }
  }, [stageModeState]);

  useEffect(() => {
    UnityService.pauseSound();
    navigator.mediaDevices.ondevicechange = () => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setNewDevice(devices[1]);
        switchDeviceModal.current?.open();
      });
    };

    return () => {
      UnityService.continueSound();
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
      isActive: collaborationState.stageMode
    },
    {
      path: generatePath(ROUTES.collaboration.screenShare, {spaceId}),
      iconName: 'screenshare',
      isActive: !!screenShare
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
