import {FC} from 'react';

import * as styled from './SoundPlayerTrack.styled';

export interface SoundPlayerTrackPropsInterface {
  percent: number;
  onChange: (percent: number) => void;
  onIsSeeking?: (isSeeking: boolean) => void;
}

const SoundPlayerTrack: FC<SoundPlayerTrackPropsInterface> = ({percent, onIsSeeking, onChange}) => {
  return (
    <styled.Progress value={percent} data-testid="SoundPlayerTrack-test">
      <input
        type="range"
        value={percent}
        onChange={(el) => onChange(Number(el.target.value))}
        onMouseDown={() => onIsSeeking?.(true)}
        onMouseUp={() => onIsSeeking?.(false)}
        className="styled-slider slider-progress"
      />
    </styled.Progress>
  );
};

export default SoundPlayerTrack;
