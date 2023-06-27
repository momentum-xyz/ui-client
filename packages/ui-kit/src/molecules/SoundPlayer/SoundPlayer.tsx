import {FC, memo, useState} from 'react';

import {IconButton, SoundPlayerTime, SoundPlayerTrack} from '../../atoms';

import * as styled from './SoundPlayer.styled';

export interface SoundPlayerPropsInterface {
  isPlaying: boolean;
  isStopped: boolean;
  onIsPlaying?: (isPlaying: boolean) => void;
}

const SoundPlayer: FC<SoundPlayerPropsInterface> = ({isPlaying, isStopped, onIsPlaying}) => {
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0
  });

  const playedSeconds = Math.round(progress.playedSeconds);
  const playedPercent = progress.played * 100;

  // TODO: Implementation
  console.log(setDuration);
  console.log(setProgress);

  return (
    <styled.Container data-testid="SoundPlayer-test">
      <IconButton
        isAccent
        size="xl2"
        name={isPlaying ? 'pause' : 'play_two'}
        onClick={() => onIsPlaying?.(!isPlaying)}
        isDisabled={isStopped}
      />

      <SoundPlayerTime playedSeconds={playedSeconds} duration={duration}>
        <SoundPlayerTrack
          percent={playedPercent}
          onChange={(percent) => {
            console.log(percent);
          }}
        />
      </SoundPlayerTime>
    </styled.Container>
  );
};

export default memo(SoundPlayer);
