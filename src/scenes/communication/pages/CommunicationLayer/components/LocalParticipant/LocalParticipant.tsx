import React, {useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {PosBusEventEnum} from 'core/enums';
import {UnityService} from 'shared/services';
import {useAgoraClient} from 'hooks/communication/useAgoraClient';
import {ILocalUser} from 'hooks/communication/useAgoraVideo';
import {ReactComponent as AstronautIcon} from 'images/icons/professions-man-astronaut.svg';
import {ReactComponent as MicOff} from 'images/icons/microphone-off.svg';
import useCollaboration, {
  useLeaveCollaborationSpace
} from 'context/Collaboration/hooks/useCollaboration';
import Avatar from 'component/atoms/Avatar';
import {useUser} from 'hooks/api/useUser';
import {TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {useStore, usePosBusEvent} from 'shared/hooks';

export interface LocalParticipantProps {
  localUser?: ILocalUser;
  stageLocalUserId?: string;
}

const LocalParticipant: React.FC<LocalParticipantProps> = ({localUser, stageLocalUserId}) => {
  const {collaborationState} = useCollaboration();
  const videoRef = useRef<HTMLDivElement>(null);
  const client = useAgoraClient();
  const leaveCollaborationSpaceCall = useLeaveCollaborationSpace();
  const [hasCameraState, setHasCameraState] = useState(false);
  const [avatarHash, setAvatarHash] = useState('');
  const {
    communicationStore: {communicationLayerStore}
  } = useStore();

  const id = localUser?.uid ?? stageLocalUserId;

  const [user] = useUser(id as string);

  useEffect(() => {
    if (user?.profile.avatarHash) {
      setAvatarHash(user.profile.avatarHash);
    }
  }, [user]);

  useEffect(() => {
    const cameraTrack = client.localTracks.find((track) => track.trackMediaType === 'video');

    if (collaborationState.stageMode) {
      if (cameraTrack?.isPlaying) {
        cameraTrack.stop();
      }
      return;
    }

    if (cameraTrack) {
      setHasCameraState(true);
    } else {
      setHasCameraState(false);
    }

    if (cameraTrack && videoRef.current && !cameraTrack.isPlaying) {
      cameraTrack.play(videoRef.current);
    }
  }, [client.localTracks, collaborationState.stageMode, collaborationState.cameraOff]);

  usePosBusEvent('meeting-kick', (spaceId) => {
    communicationLayerStore.setKicked(true);
    UnityService.triggerInteractionMsg?.(PosBusEventEnum.LeftSpace, spaceId, 0, '');
    leaveCollaborationSpaceCall(false).then(() => {
      toast.info(
        <ToastContent
          headerIconName="logout"
          title={t('titles.kickedFromMeeting')}
          text={t('messages.kickedFromMeeting')}
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    });
  });

  return (
    <>
      <li
        className={` mb-.5 p-.5
      relative
      rounded-full 
      border-1
      ${
        (localUser?.soundLevel || 0) > 3 && !collaborationState.muted
          ? ' border-prime-blue-70'
          : ' border-transparant'
      }`}
        id="thisisyou"
      >
        {!collaborationState.cameraOff && hasCameraState && !collaborationState.stageMode ? (
          <div
            className={`h-8 w-8 rounded-full bg-dark-blue-100 overflow-hidden relative border-2  
        ${
          (localUser?.soundLevel ?? 0) > 3 && !collaborationState.muted
            ? ' border-prime-blue-100'
            : ' border-transparant'
        }`}
            ref={videoRef}
            key="cameraOn"
          >
            <div className="h-full w-full absolute bg-dark-blue-100 text-green-light-100  flex justify-center items-center">
              <AstronautIcon className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <div
            key="cameraOff"
            className={`h-8 w-8 rounded-full bg-dark-blue-100 overflow-hidden relative border-2  
          ${
            (localUser?.soundLevel ?? 0) > 3 && !collaborationState.muted
              ? ' border-prime-blue-100'
              : ' border-transparant'
          }`}
          >
            <div className="h-full w-full absolute bg-dark-blue-100 text-green-light-100  flex justify-center items-center">
              {avatarHash ? (
                <Avatar avatarHash={avatarHash} />
              ) : (
                <AstronautIcon className="w-4 h-4" />
              )}
            </div>
          </div>
        )}
        {collaborationState.muted && !collaborationState.stageMode && (
          <MicOff className="absolute inset-x-0 w-full bottom-.5 block  text-center h-1.5" />
        )}
      </li>
      <p
        className="uppercase h-2 w-8 overflow-hidden text-center"
        style={{textOverflow: 'ellipsis', width: '92px'}}
      >
        You
      </p>
    </>
  );
};

export default LocalParticipant;
