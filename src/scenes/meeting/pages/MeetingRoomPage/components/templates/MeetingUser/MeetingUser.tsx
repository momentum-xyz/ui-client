import React, {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {ReactComponent as MicOff} from 'images/icons/microphone-off.svg';
import {ReactComponent as AstronautIcon} from 'images/icons/professions-man-astronaut.svg';
import {ReactComponent as AddIcon} from 'images/icons/add.svg';
import Avatar from 'component/atoms/Avatar';
import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface} from 'core/models';
import {appVariables} from 'api/constants';

import {ParticipantMenu} from './components';

export interface PropsInterface {
  participant: AgoraRemoteUserInterface;
  canEnterStage: boolean;
  totalParticipants: number;
}

const MeetingUser: FC<PropsInterface> = (props) => {
  const {participant, canEnterStage, totalParticipants} = props;

  const [hovered, setIsHovered] = useState(false);

  const {collaborationStore, meetingStore, mainStore} = useStore();
  const {agoraStore} = mainStore;
  const {meetingRoomStore} = meetingStore;
  const {space} = collaborationStore;
  const videoRef = useRef<HTMLDivElement>(null);
  const id = participant.uid;

  const maximumParticipantsReached = totalParticipants > appVariables.PARTICIPANTS_VIDEO_LIMIT - 1;

  useEffect(() => {
    participant.fetchUser();
  }, [participant]);

  useEffect(() => {
    if (
      !participant?.cameraOff &&
      videoRef.current &&
      !maximumParticipantsReached &&
      participant?.videoTrack &&
      !participant.videoTrack.isPlaying
    ) {
      participant.videoTrack.play(videoRef.current);
    }

    if (
      (maximumParticipantsReached || participant?.cameraOff) &&
      participant?.videoTrack?.isPlaying
    ) {
      participant?.videoTrack?.stop();
    }

    return () => {
      participant?.videoTrack?.stop();
    };
  }, [maximumParticipantsReached, participant]);

  const handleStageModeUserClick = () => {
    collaborationStore.inviteOnStageDialog.open();
    console.info(`clicked on ${participant.name} with ${id}`);
  };

  const handleOpenMenu = () => {
    if (meetingStore.selectedParticipant === participant.uid) {
      meetingStore.selectParticipant(undefined);
    } else {
      meetingStore.selectParticipant(participant.uid);
    }
  };

  const handleRemoveParticipant = () => {
    meetingRoomStore.removeParticipant(space?.id, meetingStore.selectedParticipant);
    meetingStore.selectParticipant(undefined);
  };

  const handleMuteParticipant = () => {
    meetingRoomStore.muteParticipant(space?.id, meetingStore.selectedParticipant);
    meetingStore.selectParticipant(undefined);
  };

  return (
    <>
      <li
        className={` mb-.5 p-.5
        rounded-full 
        border-1
        ${(participant?.soundLevel ?? 0) > 3 ? ' border-prime-blue-70' : ' border-transparant'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={participant?.name}
        onClick={
          collaborationStore.isModerator
            ? () => {
                handleOpenMenu();
              }
            : undefined
        }
      >
        <div
          className={`h-8 w-8 rounded-full overflow-hidden relative border-2 
          ${(participant?.soundLevel ?? 0) > 3 ? ' border-prime-blue-100' : ' border-transparant'}`}
          ref={videoRef}
        >
          <div className="h-full w-full absolute bg-dark-blue-100 text-green-light-100  flex flex-col justify-center items-center">
            {participant?.profile?.avatarHash ? (
              <Avatar avatarHash={participant?.profile?.avatarHash} />
            ) : (
              <AstronautIcon className="w-4 h-4" title={participant?.name} />
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
        {participant?.isMuted && !agoraStore.isStageMode && (
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
        {participant?.name}
      </p>
      {participant && meetingStore.selectedParticipant === participant?.uid && (
        <ParticipantMenu
          muteParticipant={handleMuteParticipant}
          removeParticipant={handleRemoveParticipant}
          participant={participant}
          onClose={() => meetingStore.selectParticipant(undefined)}
        />
      )}
    </>
  );
};

export default observer(MeetingUser);
