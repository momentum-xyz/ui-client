import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';

import CONFIG from 'config/config';
import {useUser} from 'hooks/api/useUser';
import {ReactComponent as MicOff} from 'images/icons/microphone-off.svg';
import {ReactComponent as AstronautIcon} from 'images/icons/professions-man-astronaut.svg';
import {ReactComponent as AddIcon} from 'images/icons/add.svg';
import Avatar from 'component/atoms/Avatar';
import Modal, {ModalRef} from 'component/util/Modal';
import StageModeInviteToStagePopup from 'component/popup/stageMode/StageModeInviteToStagePopup';
import {useModerator} from 'context/Integration/hooks/useIntegration';
import {useStore} from 'shared/hooks';
import {AgoraRemoteUserType} from 'core/types';

import {ParticipantMenu} from '../ParticipantMenu';

export interface RemoteParticipantProps {
  participant: AgoraRemoteUserType;
  totalParticipants: number;
  canEnterStage: boolean;
}

const RemoteParticipant: React.FC<RemoteParticipantProps> = ({
  participant,
  totalParticipants,
  canEnterStage
}) => {
  const {agoraStore} = useStore().mainStore;
  const videoRef = useRef<HTMLDivElement>(null);
  const inviteOnStageModalRef = useRef<ModalRef>(null);
  const id = participant.uid as string;
  const [isModerator, , ,] = useModerator(agoraStore.spaceId ?? '');
  const [hovered, setIsHovered] = useState(false);

  const {
    communicationStore: {communicationLayerStore},
    collaborationStore: {space}
  } = useStore();

  const [user] = useUser(id);

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

    if (agoraStore.isStageMode) {
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
  }, [participant.videoTrack, noVideo, agoraStore.isStageMode, userName, participant.hasVideo]);

  const handleStageModeUserClick = () => {
    inviteOnStageModalRef.current?.open();
    console.info(`clicked on ${userName} with ${id}`);
  };

  const handleOpenMenu = () => {
    if (communicationLayerStore.selectedParticipant === participant.uid) {
      communicationLayerStore.selectParticipant(undefined);
    } else {
      communicationLayerStore.selectParticipant(participant.uid);
    }
  };

  const handleRemoveParticipant = () => {
    communicationLayerStore.removeParticipant(
      space.id,
      communicationLayerStore.selectedParticipant
    );
    communicationLayerStore.selectParticipant(undefined);
  };

  const handleMuteParticipant = () => {
    communicationLayerStore.muteParticipant(space.id, communicationLayerStore.selectedParticipant);
    communicationLayerStore.selectParticipant(undefined);
  };

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
        ${(participant.soundLevel ?? 0) > 3 ? ' border-prime-blue-70' : ' border-transparant'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={userName}
        onClick={
          !agoraStore.isStageMode && isModerator
            ? () => {
                handleOpenMenu();
              }
            : undefined
        }
      >
        <div
          className={`h-8 w-8 rounded-full overflow-hidden relative border-2 
          ${(participant.soundLevel ?? 0) > 3 ? ' border-prime-blue-100' : ' border-transparant'}`}
          ref={videoRef}
        >
          <div className="h-full w-full absolute bg-dark-blue-100 text-green-light-100  flex flex-col justify-center items-center">
            {user?.profile.avatarHash ? (
              <Avatar avatarHash={user?.profile.avatarHash} />
            ) : (
              <AstronautIcon className="w-4 h-4" title={userName} />
            )}
            {agoraStore.isStageMode && isModerator && hovered && (
              <div
                className="flex flex-col bg-dark-blue-50 rounded-full absolute h-full w-full items-center justify-center space-y-.5"
                onClick={
                  canEnterStage
                    ? () => {
                        if (agoraStore.isStageMode && isModerator) {
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
        {!participant.hasAudio && !agoraStore.isStageMode && (
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
          muteParticipant={handleMuteParticipant}
          removeParticipant={handleRemoveParticipant}
          name={userName}
          participant={participant}
          onClose={() => communicationLayerStore.selectParticipant(undefined)}
        />
      )}
    </>
  );
};

export default observer(RemoteParticipant);
