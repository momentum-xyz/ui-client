import {FC, useCallback, useEffect, useRef} from 'react';

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

  const handleMouseDown = useCallback(() => {
    onIsSeeking?.(true);

    // The 'onMouseUp' doesn't work if it happens outside
    document.addEventListener(
      'mouseup',
      () => {
        onIsSeeking?.(false);
        onChange(Number(inputRef.current?.value || 0));
      },
      {once: true}
    );
  }, [onChange, onIsSeeking]);

  return (
    <styled.Progress data-testid="SoundPlayerTrack-test">
      <input
        type="range"
        ref={inputRef}
        value={percent}
        onMouseDown={handleMouseDown}
        onChange={(el) => onChange(Number(el.target.value))}
        className="styled-slider slider-progress"
      />
    </styled.Progress>
  );
};

export default SoundPlayerTrack;
