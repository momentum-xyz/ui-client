import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Switch, useHistory, useRouteMatch} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import useCollaboration from 'context/Collaboration/hooks/useCollaboration';
import {
  useStageModeJoin,
  useStageModeLeave,
  useStageModeStatusInfo
} from 'hooks/api/useStageModeService';
import Modal, {ModalRef} from 'component/util/Modal';
import {useAgoraStageMode} from 'hooks/communication/useAgoraStageMode';
import {useStore} from 'shared/hooks';
import {COLLABORATION_STAGE_MODE_ACTION_UPDATE} from 'context/Collaboration/CollaborationReducer';
import {ParticipantRole, ParticipantStatus} from 'context/Collaboration/CollaborationTypes';
import {bytesToUuid, createRoutesByConfig} from 'core/utils';
import {StageModeStatus} from 'context/type/StageMode';
import UnityService from 'context/Unity/UnityService';
import StageModeModalController from 'component/molucules/StageMode/StageModeModalController';
import NewDevicePopup from 'component/popup/new-device/NewDevicePopup';
import {ROUTES} from 'core/constants';

import {PRIVATE_ROUTES} from './CollaborationRoutes';

interface Props {}

const Collaboration: React.FC<Props> = () => {
  const {path} = useRouteMatch();
  const history = useHistory();
  const {collaborationState, collaborationDispatch, currentUserId} = useCollaboration();
  const stageModeState = useStageModeStatusInfo(collaborationState.collaborationSpace?.id);
  const switchDeviceModal = useRef<ModalRef>(null);
  const [newDevice, setNewDevice] = useState<MediaDeviceInfo>();
  const agoraStageMode = useAgoraStageMode();
  const stageModeJoin = useStageModeJoin(collaborationState.collaborationSpace?.id);
  const stageModeLeave = useStageModeLeave(collaborationState.collaborationSpace?.id);

  const {collaborationStore} = useStore();

  const routes = useMemo(() => {
    return PRIVATE_ROUTES(path, collaborationState.collaborationSpace?.id ?? '');
  }, []);

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
    if (!collaborationState.collaborationSpace) {
      history.push(ROUTES.base);
    }

    if (collaborationState.collaborationSpace?.id) {
      collaborationStore.init(collaborationState.collaborationSpace.id);
    }
  }, [collaborationState.collaborationSpace]);

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
                  integrationUser.flag !== ParticipantStatus.STATUS_LEFT &&
                  integrationUser.userId &&
                  bytesToUuid(integrationUser.userId.data) !== currentUserId
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
      stageModeState?.data.stageModeStatus === StageModeStatus.INITIATED;

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

  // @ts-ignore
  const newDeviceKindDescription = () => {
    switch (newDevice?.kind) {
      case 'videoinput':
        return 'video input';
      case 'audioinput':
        return 'audio input';
      case 'audiooutput':
        return 'audio output';
    }
  };

  return (
    <>
      <StageModeModalController />
      <Switch>{createRoutesByConfig(routes)}</Switch>
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
