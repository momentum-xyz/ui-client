import {FC, useEffect, useRef} from 'react';

import * as styled from './MediaPlayerTrack.styled';

export interface MediaPlayerTrackInterface {
  playedPercent: number;
}

const MediaPlayerTrack: FC<MediaPlayerTrackInterface> = ({playedPercent}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.setProperty('--value', playedPercent.toString());
    }
  }, [playedPercent]);

  return (
    <styled.Progress data-testid="MediaPlayerTrack-test">
      <input
        ref={inputRef}
        type="range"
        value={playedPercent}
        className="styled-slider slider-progress"
      />
    </styled.Progress>
  );
};

export default MediaPlayerTrack;
