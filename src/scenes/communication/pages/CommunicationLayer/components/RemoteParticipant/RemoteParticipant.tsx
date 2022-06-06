import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import CONFIG from 'config/config';
import {useUser} from 'hooks/api/useUser';
import {ReactComponent as MicOff} from 'images/icons/microphone-off.svg';
import {ReactComponent as AstronautIcon} from 'images/icons/professions-man-astronaut.svg';
import {ReactComponent as AddIcon} from 'images/icons/add.svg';
import Avatar from 'component/atoms/Avatar';
import Modal, {ModalRef} from 'component/util/Modal';
import StageModeInviteToStagePopup from 'component/popup/stageMode/StageModeInviteToStagePopup';
import {useModerator} from 'context/Integration/hooks/useIntegration';
import {ParticipantModelInterface} from 'scenes/communication/stores/CommunicationLayerStore/models';
import {useStore} from 'shared/hooks';
import {AgoraParticipant} from 'hooks/communication/useAgoraVideo';
import UnityService from 'context/Unity/UnityService';
import useWebsocketEvent from 'context/Websocket/hooks/useWebsocketEvent';
import useCollaboration, {
  useLeaveCollaborationSpace
} from 'context/Collaboration/hooks/useCollaboration';
import {PosBusInteractionType} from 'context/Unity/UnityService';
import {TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';

import {ParticipantMenu} from '../ParticipantMenu';

//import {useAgoraStageMode} from '../../../hooks/communication/useAgoraStageMode';

export interface RemoteParticipantProps {
  participant: AgoraParticipant;
  participantModel?: ParticipantModelInterface;
  totalParticipants: number;
  canEnterStage: boolean;
}

const RemoteParticipant: React.FC<RemoteParticipantProps> = ({
  participant,
  participantModel,
  totalParticipants,
  canEnterStage
}) => {
  const {collaborationState} = useCollaboration();
  // const {canEnterStage} = useAgoraStageMode();
  const leaveCollaborationSpaceCall = useLeaveCollaborationSpace();
  const videoRef = useRef<HTMLDivElement>(null);
  const inviteOnStageModalRef = useRef<ModalRef>(null);
  const id = participant.uid as string;
  const [isModerator, , ,] = useModerator(collaborationState.collaborationSpace?.id ?? '');
  const [hovered, setIsHovered] = useState(false);

  const {
    communicationStore: {communicationLayerStore},
    collaborationStore: {spaceStore}
  } = useStore();

  const [user] = useUser(id);

  const soundlevel = participant.soundLevel || 0;

  const userName = user?.name || id;

  const noVideo = totalParticipants > CONFIG.video.PARTICIPANTS_VIDEO_LIMIT - 1;

  // @ts-ignore
  useEffect(() => {
    console.info(`Agora audio track changes for user ${userName}`, participant.audioTrack);

    if (participant.hasAudio && participant.audioTrack) {
      participant.audioTrack.play();

      return () => {
        if (participant.audioTrack) {
          participant.audioTrack.stop();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participant.audioTrack]);

  // @ts-ignore
  useEffect(() => {
    console.info(`Agora video track changes for user ${userName}`, participant.videoTrack);

    if (collaborationState.stageMode) {
      if (participant.videoTrack?.isPlaying) {
        participant.videoTrack?.stop();
      }
      return;
    }

    if (participant.hasVideo && participant.videoTrack && videoRef.current) {
      if (!noVideo) {
        participant.videoTrack.play(videoRef.current);
      }

      return () => {
        if (participant.videoTrack) {
          participant.videoTrack.stop();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participant.videoTrack, noVideo, collaborationState.stageMode]);

  useEffect(() => {
    const volume = collaborationState.deafen ? 0 : 100;
    participant.audioTrack?.setVolume(volume);
  }, [collaborationState.deafen, participant.audioTrack]);

  const handleStageModeUserClick = () => {
    inviteOnStageModalRef.current?.open();
    console.info(`clicked on ${userName} with ${id}`);
  };

  const handleUserClick = () => {
    if (communicationLayerStore.selectedParticipant === participant.uid) {
      communicationLayerStore.selectParticipant(undefined);
    } else {
      communicationLayerStore.selectParticipant(participant.uid);
    }
    console.info(`clicked on ${userName} with ${id}`);
  };

  const handleRemoveParticipant = () => {
    communicationLayerStore.removeParticipant(
      spaceStore.space.id,
      communicationLayerStore.selectedParticipant
    );
  };

  useWebsocketEvent('communication-user-kick', (spaceId) => {
    console.info('SPACEID ', spaceId);
    UnityService.triggerInteractionMsg?.(PosBusInteractionType.LeftSpace, spaceId, 0, '');
    leaveCollaborationSpaceCall(false).then(() => {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text="you are kicked out of the space"
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    });
  });

  return (
    <>
      <Modal ref={inviteOnStageModalRef}>
        <StageModeInviteToStagePopup
          user={user}
          onClose={() => {
            inviteOnStageModalRef.current?.close();
          }}
        />
      </Modal>
      <li
        className={` mb-.5 p-.5
        rounded-full 
        border-1
        ${soundlevel > 3 ? ' border-prime-blue-70' : ' border-transparant'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={userName}
        onClick={() => {
          if (communicationLayerStore.isNormalMode && isModerator) {
            handleUserClick();
          }
        }}
      >
        <div
          className={`h-8 w-8 rounded-full overflow-hidden relative border-2 
          ${soundlevel > 3 ? ' border-prime-blue-100' : ' border-transparant'}`}
          ref={videoRef}
        >
          <div className="h-full w-full absolute bg-dark-blue-100 text-green-light-100  flex flex-col justify-center items-center">
            {user?.profile.avatarHash ? (
              <Avatar avatarHash={user?.profile.avatarHash} />
            ) : (
              <AstronautIcon className="w-4 h-4" title={userName} />
            )}
            {collaborationState.stageMode && isModerator && hovered && (
              <div
                className="flex flex-col bg-dark-blue-50 rounded-full absolute h-full w-full items-center justify-center space-y-.5"
                onClick={
                  canEnterStage
                    ? () => {
                        if (collaborationState.stageMode && isModerator) {
                          console.log('I am a moderator');
                          handleStageModeUserClick();
                        }
                      }
                    : undefined
                }
              >
                {canEnterStage && <AddIcon title="" className="h-2 w-2" />}
                <p
                  className={`w-min text-center capitalize ${
                    !canEnterStage ? 'text-white-100' : ''
                  }`}
                >
                  {canEnterStage ? 'Invite' : 'Stage full'}
                </p>
              </div>
            )}
          </div>
        </div>
        {!participant.hasAudio && !collaborationState.stageMode && (
          <MicOff
            className="absolute inset-x-0 w-full bottom-.5 block  text-center h-1.5"
            style={{top: '70px'}}
          />
        )}
      </li>
      <p
        className="uppercase h-2 w-8 overflow-hidden text-center"
        style={{textOverflow: 'ellipsis', width: '92px'}}
      >
        {userName}
      </p>
      {communicationLayerStore.selectedParticipant === participant.uid && (
        <ParticipantMenu
          removeParticipant={handleRemoveParticipant}
          name={userName}
          uid={participant.uid}
        />
      )}
    </>
  );
};

export default observer(RemoteParticipant);
