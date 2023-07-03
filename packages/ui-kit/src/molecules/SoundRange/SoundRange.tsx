import {FC, memo} from 'react';

import {IconNameType} from '../../types';
import {IconButton, SoundPlayerTrack} from '../../atoms';

import * as styled from './SoundRange.styled';

export interface SoundRangePropsInterface {
  percent: number;
  leftIcon?: IconNameType;
  rightIcon?: IconNameType;
  onChange: (percent: number) => void;
}

const RANGE_STEP = 10;

const SoundRange: FC<SoundRangePropsInterface> = ({
  percent,
  leftIcon = 'sound',
  rightIcon = 'sound_louder',
  onChange
}) => {
  const handleDown = () => {
    onChange(percent <= RANGE_STEP ? 0 : percent - RANGE_STEP);
  };

  const handleUp = () => {
    onChange(percent >= 100 - RANGE_STEP ? 100 : percent + RANGE_STEP);
  };

  return (
    <styled.Container data-testid="SoundRange-test">
      <IconButton
        isAccent
        size="xl2"
        name={leftIcon}
        onClick={handleDown}
        isDisabled={percent === 0}
      />

      <SoundPlayerTrack percent={percent} onChange={onChange} />

      <IconButton
        isAccent
        size="xl2"
        name={rightIcon}
        onClick={handleUp}
        isDisabled={percent === 100}
      />
    </styled.Container>
  );
};

export default memo(SoundRange);
