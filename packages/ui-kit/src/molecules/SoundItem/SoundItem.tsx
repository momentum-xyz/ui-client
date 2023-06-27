import {FC, memo} from 'react';
import cn from 'classnames';
import {MediaFileInterface} from '@momentum-xyz/core';

import {ButtonRound} from '../../atoms';

import * as styled from './SoundItem.styled';

export interface SoundItemPropsInterface {
  item: MediaFileInterface;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  onDelete?: () => void;
}

const SoundItem: FC<SoundItemPropsInterface> = ({item, isActive, onStart, onStop, onDelete}) => {
  return (
    <styled.Container data-testid="SoundItem-test">
      <styled.Inner className={cn(isActive && 'active')}>
        <styled.TitleContainer className={cn(isActive && 'active')}>
          <styled.Title>{item.name}</styled.Title>
        </styled.TitleContainer>

        <styled.Actions>
          {!!onDelete && !isActive && (
            <ButtonRound size="normal" icon="bin" variant="primary" onClick={onDelete} />
          )}

          <ButtonRound
            icon="music"
            size="normal"
            variant="primary"
            isActive={isActive}
            onClick={isActive ? onStop : onStart}
          />
        </styled.Actions>
      </styled.Inner>
    </styled.Container>
  );
};

export default memo(SoundItem);
