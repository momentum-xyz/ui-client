import {FC} from 'react';

import {TrackStateInterface} from '../../interfaces';
import {IconButton, SoundPlayerTime, SoundPlayerTrack} from '../../atoms';

import * as styled from './SoundPlayer.styled';

export interface SoundPlayerPropsInterface {
  state: TrackStateInterface;
  onIsPlaying?: (isPlaying: boolean) => void;
  onChangePlayed?: (playedSec: number) => void;
}

const SoundPlayer: FC<SoundPlayerPropsInterface> = ({state, onIsPlaying, onChangePlayed}) => {
  return (
    <styled.Container data-testid="SoundPlayer-test">
      <IconButton
        isAccent
        size="xl2"
        name={state.isPlaying ? 'pause' : 'play_two'}
        onClick={() => onIsPlaying?.(!state.isPlaying)}
        isDisabled={state.isStopped}
      />

      <SoundPlayerTime playedSeconds={state.playedSec} duration={state.durationSec}>
        <SoundPlayerTrack
          percent={state.playedPercent}
          onChange={(percent) => {
            onChangePlayed?.((state.durationSec * percent) / 100);
          }}
        />
      </SoundPlayerTime>
    </styled.Container>
  );
};

export default SoundPlayer;
