import {FC} from 'react';

import * as styled from './SoundPlayerTrack.styled';

export interface SoundPlayerTrackPropsInterface {
  playedPercent: number;
  onChange: (percent: number) => void;
}

const SoundPlayerTrack: FC<SoundPlayerTrackPropsInterface> = ({playedPercent, onChange}) => {
  return (
    <styled.Progress value={playedPercent} data-testid="SoundPlayerTrack-test">
      <input
        type="range"
        value={playedPercent}
        onChange={(el) => onChange(Number(el.target.value))}
        className="styled-slider slider-progress"
      />
    </styled.Progress>
  );
};

export default SoundPlayerTrack;
