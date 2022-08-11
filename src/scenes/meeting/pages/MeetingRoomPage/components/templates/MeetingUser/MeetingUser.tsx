import React, {FC, useEffect, useMemo, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';

import {IconSvg, Text} from 'ui-kit';
import {ReactComponent as MicOff} from 'images/icons/microphone-off.svg';
import {ReactComponent as AstronautIcon} from 'images/icons/professions-man-astronaut.svg';
import Avatar from 'component/atoms/Avatar';
import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface} from 'core/models';

import {ParticipantMenu} from './components';
import * as styled from './MeetingUser.styled';

export interface PropsInterface {
  spaceId: string;
  participant: AgoraRemoteUserInterface;
  isModerator: boolean;
  maxVideoStreams: boolean;
}

const MeetingUser: FC<PropsInterface> = (props) => {
  const {spaceId, participant, isModerator, maxVideoStreams} = props;

  const videoRef = useRef<HTMLDivElement>(null);

  const {meetingStore} = useStore();
  const {meetingRoomStore} = meetingStore;

  useEffect(() => {
    participant.fetchUser();
  }, [participant]);

  useEffect(() => {
    if (
      !participant?.cameraOff &&
      videoRef.current &&
      !maxVideoStreams &&
      participant?.videoTrack &&
      !participant.videoTrack.isPlaying
    ) {
      participant.videoTrack.play(videoRef.current);
    }

    if ((maxVideoStreams || participant?.cameraOff) && participant?.videoTrack?.isPlaying) {
      participant?.videoTrack?.stop();
    }

    return () => {
      participant?.videoTrack?.stop();
    };
  }, [maxVideoStreams, participant]);

  const handleOpenMenu = () => {
    if (meetingStore.selectedParticipant === participant.uid) {
      meetingStore.selectParticipant(undefined);
    } else {
      meetingStore.selectParticipant(participant.uid);
    }
  };

  const handleRemoveParticipant = () => {
    meetingRoomStore.removeParticipant(spaceId, meetingStore.selectedParticipant);
    meetingStore.selectParticipant(undefined);
  };

  const handleMuteParticipant = () => {
    meetingRoomStore.muteParticipant(spaceId, meetingStore.selectedParticipant);
    meetingStore.selectParticipant(undefined);
  };

  const isTalking: boolean = useMemo(() => {
    return (participant.soundLevel || 0) > 3;
  }, [participant.soundLevel]);

  return (
    <>
      <styled.UserListItem data-testid="LocalUser-test" className={cn(isTalking && 'colored')}>
        <styled.Inner className={cn(isTalking && 'colored')}>
          <styled.Video ref={videoRef} />
          {participant.avatarSrc && <styled.Avatar src={participant.avatarSrc} />}
          {!participant.avatarSrc && (
            <styled.Placeholder>
              <IconSvg size="large" name="profile" />
            </styled.Placeholder>
          )}
        </styled.Inner>

        {participant?.isMuted && (
          <styled.MicrophoneOff>
            <IconSvg size="small" name="microphoneOff" isWhite />
          </styled.MicrophoneOff>
        )}

        <styled.Username>
          <Text text={participant.name} transform="uppercase" size="xxs" />
        </styled.Username>
      </styled.UserListItem>

      <li
        className={` mb-.5 p-.5
        rounded-full 
        border-1
        ${(participant?.soundLevel ?? 0) > 3 ? ' border-prime-blue-70' : ' border-transparant'}`}
        title={participant?.name}
        onClick={
          isModerator
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
          </div>
        </div>
        {participant?.isMuted && (
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
