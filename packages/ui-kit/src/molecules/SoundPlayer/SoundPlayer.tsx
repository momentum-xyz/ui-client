import {FC, memo} from 'react';

import {IconButton, SoundPlayerTime, SoundPlayerTrack} from '../../atoms';

import * as styled from './SoundPlayer.styled';

export interface SoundPlayerPropsInterface {
  isPlaying: boolean;
  isStopped: boolean;
  durationSec?: number;
  playedSec?: number;
  onIsPlaying?: (isPlaying: boolean) => void;
  onChangePlayed?: (playedSec: number) => void;
}

const SoundPlayer: FC<SoundPlayerPropsInterface> = ({
  isPlaying,
  isStopped,
  durationSec = 0,
  playedSec = 0,
  onIsPlaying,
  onChangePlayed
}) => {
  const playedPercent = !isStopped ? (playedSec * 100) / durationSec : 0;

  return (
    <styled.Container data-testid="SoundPlayer-test">
      <IconButton
        isAccent
        size="xl2"
        name={isPlaying ? 'pause' : 'play_two'}
        onClick={() => onIsPlaying?.(!isPlaying)}
        isDisabled={isStopped}
      />

      <SoundPlayerTime playedSeconds={playedSec} duration={durationSec}>
        <SoundPlayerTrack
          percent={playedPercent}
          onChange={(percent) => {
            onChangePlayed?.((durationSec * percent) / 100);
          }}
        />
      </SoundPlayerTime>
    </styled.Container>
  );
};

export default memo(SoundPlayer);
