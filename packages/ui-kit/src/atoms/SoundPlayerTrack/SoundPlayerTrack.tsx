import {FC, useEffect, useRef} from 'react';

import * as styled from './SoundPlayerTrack.styled';

export interface SoundPlayerTrackPropsInterface {
  percent: number;
  onChange: (percent: number) => void;
  onIsSeeking?: (isSeeking: boolean) => void;
}

const SoundPlayerTrack: FC<SoundPlayerTrackPropsInterface> = ({percent, onIsSeeking, onChange}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.setProperty('--value', percent.toString());
    }
  }, [percent]);

  return (
    <styled.Progress data-testid="SoundPlayerTrack-test">
      <input
        ref={inputRef}
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
