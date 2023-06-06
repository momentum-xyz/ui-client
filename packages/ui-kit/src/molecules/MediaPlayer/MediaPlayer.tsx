import {FC, memo, useState} from 'react';
import ReactPlayer from 'react-player';
import {OnProgressProps} from 'react-player/base';

import {IconButton, MediaPlayerTrack} from '../../atoms';

import * as styled from './MediaPlayer.styled';

export interface MediaPlayerInterface {
  sourceUrl: string;
  height?: number;
}

const MediaPlayer: FC<MediaPlayerInterface> = ({sourceUrl, height = 160}) => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({
    played: 0,
    loaded: 0,
    playedSeconds: 0,
    loadedSeconds: 0
  });

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state: OnProgressProps) => {
    setProgress(state);
  };

  const handleDuration = (duration: number) => {
    if (duration !== Infinity && duration >= 0) {
      setDuration(Math.round(duration));
    }
  };

  const handleEnded = () => {
    setPlaying(false);
  };

  const playedSeconds = Math.round(progress.playedSeconds);
  const playedPercent = progress.played * 100;

  return (
    <styled.Container data-testid="MediaPlayer-test">
      <ReactPlayer
        url={sourceUrl}
        playing={playing}
        onEnded={handleEnded}
        onProgress={handleProgress}
        onDuration={handleDuration}
        progressInterval={200}
        height={height}
        width="100%"
      />

      <styled.PlayPause>
        <IconButton
          isWhite
          size="xxl"
          name={playing ? 'pause' : 'play_two'}
          onClick={handlePlayPause}
        />
      </styled.PlayPause>

      <styled.ProgressContainer>
        <styled.Grid>
          <styled.Played>
            00:{playedSeconds < 10 ? <>{`0${playedSeconds}`}</> : <>{playedSeconds}</>}
          </styled.Played>
          <MediaPlayerTrack playedPercent={playedPercent} />
          <styled.Duration>
            00:{duration < 10 ? <>{`0${duration}`}</> : <>{duration}</>}
          </styled.Duration>
        </styled.Grid>
      </styled.ProgressContainer>
    </styled.Container>
  );
};

export default memo(MediaPlayer);
