import {FC, ReactNode} from 'react';

import * as styled from './SoundPlayerTime.styled';

export interface SoundPlayerTimePropsInterface {
  playedSeconds: number;
  duration: number;
  children: ReactNode;
}

const SoundPlayerTime: FC<SoundPlayerTimePropsInterface> = ({
  playedSeconds,
  duration,
  children
}) => {
  const formatSeconds = (seconds: number) => {
    return <>00:{seconds < 10 ? <>{`0${seconds}`}</> : <>{seconds}</>}</>;
  };

  return (
    <styled.Grid data-testid="SoundPlayerTime-test">
      <styled.Played>{formatSeconds(playedSeconds)}</styled.Played>
      {children}
      <styled.Duration>{formatSeconds(duration)}</styled.Duration>
    </styled.Grid>
  );
};

export default SoundPlayerTime;
