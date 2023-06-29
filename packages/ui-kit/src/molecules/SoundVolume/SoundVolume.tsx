import {FC, memo} from 'react';

import {IconButton, SoundPlayerTrack} from '../../atoms';

import * as styled from './SoundVolume.styled';

export interface SoundVolumePropsInterface {
  volumePercent: number;
  onChangeVolume: (volumePercent: number) => void;
}

const VOLUME_STEP = 10;

const SoundVolume: FC<SoundVolumePropsInterface> = ({volumePercent, onChangeVolume}) => {
  const handleDownVolume = () => {
    onChangeVolume(volumePercent <= VOLUME_STEP ? 0 : volumePercent - VOLUME_STEP);
  };

  const handleUpVolume = () => {
    onChangeVolume(volumePercent >= 100 - VOLUME_STEP ? 100 : volumePercent + VOLUME_STEP);
  };

  return (
    <styled.Container data-testid="SoundVolume-test">
      <IconButton
        isAccent
        size="xl2"
        name="sound"
        onClick={handleDownVolume}
        isDisabled={volumePercent === 0}
      />

      <SoundPlayerTrack percent={volumePercent} onChange={onChangeVolume} />

      <IconButton
        isAccent
        size="xl2"
        name="sound_louder"
        onClick={handleUpVolume}
        isDisabled={volumePercent === 100}
      />
    </styled.Container>
  );
};

export default memo(SoundVolume);
