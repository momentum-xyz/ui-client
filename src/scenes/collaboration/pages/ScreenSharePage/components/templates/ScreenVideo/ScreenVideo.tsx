import React, {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {IRemoteVideoTrack} from 'agora-rtc-sdk-ng';

import * as styled from './ScreenVideo.styled';

interface PropsInterface {
  videoTrack?: IRemoteVideoTrack;
}

const ScreenVideo: FC<PropsInterface> = ({videoTrack}) => {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current && videoTrack) {
      videoTrack.play(videoRef.current, {fit: 'contain'});
    }
  }, [videoTrack]);

  return (
    <styled.Wrapper data-testid="ScreenVideo-test">
      <styled.VideoContainer ref={videoRef} />
    </styled.Wrapper>
  );
};

export default observer(ScreenVideo);
