import {FC} from 'react';

import * as styled from './MediaPlayerTrack.styled';

export interface MediaPlayerTrackInterface {
  playedPercent: number;
}

const MediaPlayerTrack: FC<MediaPlayerTrackInterface> = ({playedPercent}) => {
  return (
    <styled.Progress value={playedPercent} data-testid="MediaPlayerTrack-test">
      <input type="range" value={playedPercent} className="styled-slider slider-progress" />
    </styled.Progress>
  );
};

export default MediaPlayerTrack;
