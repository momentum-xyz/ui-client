import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {formatDurationTime} from 'core/utils';

import * as styled from './SeekBarController.styled';

export interface PropsInterface {}

const SeekBarController: FC<PropsInterface> = () => {
  const {musicPlayerStore} = useStore().widgetStore;
  const {
    duration,
    seek,
    handleSeekingChange,
    handleMouseDownSeek,
    handleMouseUpSeek,
    calculateDurationBarWidth,
    playlistStore
  } = musicPlayerStore;

  useEffect(() => {
    console.info(playlistStore.currentTrackHash);
  }, [playlistStore.currentTrackHash]);

  const elapsed = seek;
  return (
    <styled.Container>
      <styled.Elapsed>{`${formatDurationTime(elapsed)}`}</styled.Elapsed>
      <styled.SeekBarContainer width={100 + '%'}>
        <styled.BarThumbPosition width={calculateDurationBarWidth} />
        <styled.SeekBar
          type="range"
          min="0"
          max={duration ? duration.toFixed(2) : 0}
          step=".01"
          value={seek}
          onChange={handleSeekingChange}
          onMouseDown={handleMouseDownSeek}
          onMouseUp={handleMouseUpSeek}
        />
      </styled.SeekBarContainer>
      <styled.Duration>{formatDurationTime(duration)}</styled.Duration>
    </styled.Container>
  );
};

export default observer(SeekBarController);
