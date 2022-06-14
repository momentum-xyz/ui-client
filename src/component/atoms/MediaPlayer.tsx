import {
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack
} from 'agora-rtc-sdk-ng';
import React, {useEffect, useRef, useState} from 'react';

import {bytesToUuid} from 'core/utils';
import {appVariables} from 'api/constants';

import {useUser} from '../../hooks/api/useUser';
import {ReactComponent as MicOff} from '../../images/icons/microphone-off.svg';
import {ReactComponent as CameraOff} from '../../images/icons/camera-off.svg';
import User from '../../context/type/User';
import astronautIconSrc, {
  ReactComponent as AstronautIcon
} from '../../images/icons/professions-man-astronaut.svg';

export interface VideoPlayerProps {
  currentUser?: User;
  remoteUser?: IAgoraRTCRemoteUser | undefined;
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  soundLevel?: number;
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const stagevideocontainer = useRef<HTMLDivElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>();

  const [user] = useUser(
    (props.remoteUser?.uid as string | undefined) ??
      (props.currentUser?.id.data ? bytesToUuid(props.currentUser.id.data) : '')
  );

  useEffect(() => {
    const avatarHash = user?.profile.avatarHash;
    console.info('avatarhash', avatarHash);

    if (avatarHash) {
      setImgUrl(appVariables.RENDER_SERVICE_URL + `/get/${avatarHash}`);
    } else {
      setImgUrl(null);
    }
  }, [user]);

  useEffect(() => {
    if (!stagevideocontainer.current) {
      return;
    }

    props.videoTrack?.play(stagevideocontainer.current);
    return () => {
      props.videoTrack?.stop();
    };
  }, [stagevideocontainer, props.videoTrack]);

  useEffect(() => {
    if (props.audioTrack) {
      props.audioTrack?.play();
    }
    return () => {
      props.audioTrack?.stop();
    };
  }, [props.audioTrack]);

  return (
    <div
      className={`relative w-full aspect-ratio-video  ${
        props.soundLevel && props.soundLevel > 5
          ? ' border-2 border-prime-blue-100'
          : ' border-transparant'
      } `}
    >
      <div ref={stagevideocontainer} className="w-full aspect-ratio-video " />
      {props.isVideoMuted && (
        <div className="absolute w-full h-full left-0 top-0 flex items-center justify-center bg-dark-blue-100 text-green-light-100 pointer-events-none">
          {imgUrl ? (
            <img
              className="w-full h-full object-cover "
              src={imgUrl ?? astronautIconSrc}
              alt={user?.name}
            />
          ) : (
            <AstronautIcon className="w-15 h-15" />
          )}
        </div>
      )}
      <div className="absolute bottom-1 right-0 left-0 flex justify-center text-xs">
        <div className="bg-black-40 p-.5 rounded flex gap-1">
          {props.remoteUser && user ? (
            <span className="text-xs">{user?.name}</span>
          ) : (
            <span className="text-xs">you</span>
          )}
          {props.isVideoMuted && <CameraOff className="h-1.5" />}
          {props.isAudioMuted && <MicOff className="h-1.5" />}
        </div>
        {/*{(props.isVideoMuted || props.isAudioMuted) && (*/}
        {/*  <div className="bg-black-40 p-.5 flex gap-1">*/}
        {/*    {props.isVideoMuted && <CameraOff className="h-1.5" />}*/}
        {/*    {props.isAudioMuted && <MicOff className="h-1.5" />}*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </div>
  );
};

export default MediaPlayer;
