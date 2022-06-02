import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {formatDurationTime} from 'core/utils';

import * as styled from './SeekBarController.styled';

const SeekBarController: FC = () => {
  const {musicPlayerStore} = useStore().widgetStore;
  const {musicPlayer} = musicPlayerStore;

  return (
    <styled.Container>
      <styled.Elapsed>{`${formatDurationTime(musicPlayer.seek)}`}</styled.Elapsed>
      <styled.SeekBarContainer>
        <styled.BarThumbPosition width={musicPlayer.calculateDurationBarWidth} />
        <styled.SeekBar
          type="range"
          min="0"
          max={musicPlayer.duration ? musicPlayer.duration.toFixed(2) : 0}
          step=".01"
          value={musicPlayer.seek}
          onChange={musicPlayer.seekingChange}
          onMouseDown={musicPlayer.seekingStarted}
          onMouseUp={musicPlayer.seekingEnded}
        />
      </styled.SeekBarContainer>
      <styled.Duration>{formatDurationTime(musicPlayer.duration)}</styled.Duration>
    </styled.Container>
  );
};

export default observer(SeekBarController);
