import {FC, ReactNode} from 'react';
import {format} from 'date-fns-tz';

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
  const getFormattedString = (seconds: number) => {
    const date = new Date(Math.round(seconds) * 1000);
    return format(date, 'mm:ss');
  };

  return (
    <styled.Grid data-testid="SoundPlayerTime-test">
      <styled.Played>{getFormattedString(playedSeconds)}</styled.Played>
      {children}
      <styled.Duration>{getFormattedString(duration)}</styled.Duration>
    </styled.Grid>
  );
};

export default SoundPlayerTime;
