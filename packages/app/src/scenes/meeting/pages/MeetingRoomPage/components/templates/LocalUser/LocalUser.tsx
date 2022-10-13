import React, {FC, useEffect, useMemo, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {ICameraVideoTrack} from 'agora-rtc-sdk-ng';
import cn from 'classnames';
import {IconSvg, Text} from '@momentum-xyz/ui-kit';

import {ReactComponent as Astronaut} from 'static/images/astronaut.svg';

import * as styled from './LocalUser.styled';

interface PropsInterface {
  isShown: boolean;
  isStageMode: boolean;
  avatarSrc?: string;
  videoTrack?: ICameraVideoTrack;
  microphoneOff: boolean;
  cameraOff: boolean;
  soundLevel: number;
}

const LocalUser: FC<PropsInterface> = ({
  isShown,
  isStageMode,
  avatarSrc,
  videoTrack,
  microphoneOff,
  cameraOff,
  soundLevel
}) => {
  const videoRef = useRef<HTMLDivElement>(null);

  const {t} = useTranslation();

  useEffect(() => {
    if (isStageMode && videoTrack?.isPlaying) {
      videoTrack?.stop();
    }
  }, [isStageMode, videoTrack]);

  useEffect(() => {
    if (!videoTrack?.enabled) {
      videoTrack?.stop();
    } else if (videoRef.current) {
      videoTrack?.play(videoRef.current);
    }
  }, [isStageMode, cameraOff, videoTrack]);

  const isTalking = useMemo(() => {
    return soundLevel > 3 && !microphoneOff;
  }, [microphoneOff, soundLevel]);

  if (!isShown) {
    return <></>;
  }

  return (
    <styled.UserListItem data-testid="LocalUser-test" className={cn(isTalking && 'colored')}>
      <styled.Inner className={cn(isTalking && 'colored')}>
        {!cameraOff && <styled.Video ref={videoRef} />}
        {cameraOff && avatarSrc && <styled.Avatar src={avatarSrc} />}
        {cameraOff && !avatarSrc && (
          <styled.Placeholder>
            <Astronaut />
          </styled.Placeholder>
        )}
      </styled.Inner>

      {microphoneOff && (
        <styled.MicrophoneOff>
          <IconSvg size="small" name="microphoneOff" isWhite />
        </styled.MicrophoneOff>
      )}

      <styled.Username>
        <Text text={t('labels.you')} transform="uppercase" size="xxs" />
      </styled.Username>
    </styled.UserListItem>
  );
};

export default observer(LocalUser);
