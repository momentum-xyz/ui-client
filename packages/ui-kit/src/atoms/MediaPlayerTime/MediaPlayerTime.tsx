import {FC, ReactNode} from 'react';

import * as styled from './MediaPlayerTime.styled';

export interface MediaPlayerTimeInterface {
  playedSeconds: number;
  duration: number;
  children: ReactNode;
}

const MediaPlayerTime: FC<MediaPlayerTimeInterface> = ({playedSeconds, duration, children}) => {
  const formatSeconds = (seconds: number) => {
    return <>00:{seconds < 10 ? <>{`0${seconds}`}</> : <>{seconds}</>}</>;
  };

  return (
    <styled.Grid data-testid="MediaPlayerTime-test">
      <styled.Played>{formatSeconds(playedSeconds)}</styled.Played>
      {children}
      <styled.Duration>{formatSeconds(duration)}</styled.Duration>
    </styled.Grid>
  );
};

export default MediaPlayerTime;
