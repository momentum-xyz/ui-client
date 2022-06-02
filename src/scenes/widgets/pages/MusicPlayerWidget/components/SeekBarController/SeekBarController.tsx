import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {formatDurationTime} from 'core/utils';

import * as styled from './SeekBarController.styled';

export interface PropsInterface {}

const SeekBarController: FC<PropsInterface> = () => {
  const {musicPlayerStore} = useStore().widgetStore;
  const {duration, seek, seekingChange, seekingStarted, seekingEnded, calculateDurationBarWidth} =
    musicPlayerStore;

  return (
    <styled.Container>
      <styled.Elapsed>{`${formatDurationTime(seek)}`}</styled.Elapsed>
      <styled.SeekBarContainer>
        <styled.BarThumbPosition width={calculateDurationBarWidth} />
        <styled.SeekBar
          type="range"
          min="0"
          max={duration ? duration.toFixed(2) : 0}
          step=".01"
          value={seek}
          onChange={seekingChange}
          onMouseDown={seekingStarted}
          onMouseUp={seekingEnded}
        />
      </styled.SeekBarContainer>
      <styled.Duration>{formatDurationTime(duration)}</styled.Duration>
    </styled.Container>
  );
};

export default observer(SeekBarController);
