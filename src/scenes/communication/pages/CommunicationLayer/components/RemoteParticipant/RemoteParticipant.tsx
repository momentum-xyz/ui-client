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
import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface} from 'stores/MainStore/models/AgoraStore/models';

import {ParticipantMenu} from '../ParticipantMenu';

export interface RemoteParticipantProps {
  participant: AgoraRemoteUserInterface;
  canEnterStage: boolean;
  totalParticipants: number;
}

const RemoteParticipant: React.FC<RemoteParticipantProps> = ({
  participant,
  canEnterStage,
  totalParticipants
}) => {
  const {collaborationStore, communicationStore, mainStore} = useStore();
  const {agoraStore} = mainStore;
  const {communicationLayerStore} = communicationStore;
  const {space} = collaborationStore;
  const videoRef = useRef<HTMLDivElement>(null);
  const inviteOnStageModalRef = useRef<ModalRef>(null);
  const id = participant.uid as string;
  const [hovered, setIsHovered] = useState(false);

  const [user] = useUser(id);

  const userName = user?.name || id;

  const maximumParticipantsReached = totalParticipants > CONFIG.video.PARTICIPANTS_VIDEO_LIMIT - 1;

  useEffect(() => {
    if (
      !participant.cameraOff &&
      videoRef.current &&
      !maximumParticipantsReached &&
      participant.videoTrack &&
      !participant.videoTrack.isPlaying
    ) {
      participant.videoTrack.play(videoRef.current);
    }

    if (
      (maximumParticipantsReached || participant.cameraOff) &&
      participant.videoTrack?.isPlaying
    ) {
      participant.videoTrack?.stop();
    }

    return () => {
      participant.videoTrack?.stop();
    };
  }, [maximumParticipantsReached, participant.cameraOff, participant.videoTrack]);

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
      space?.id,
      communicationLayerStore.selectedParticipant
    );
    communicationLayerStore.selectParticipant(undefined);
  };

  const handleMuteParticipant = () => {
    communicationLayerStore.muteParticipant(space?.id, communicationLayerStore.selectedParticipant);
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
          !agoraStore.isStageMode && collaborationStore.isModerator
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
            {agoraStore.isStageMode && collaborationStore.isModerator && hovered && (
              <div
                className="flex flex-col bg-dark-blue-50 rounded-full absolute h-full w-full items-center justify-center space-y-.5"
                onClick={
                  canEnterStage
                    ? () => {
                        if (agoraStore.isStageMode && collaborationStore.isModerator) {
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
        {participant.isMuted && !agoraStore.isStageMode && (
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
