import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';

import {Button} from 'ui-kit';

import * as styled from './VibeButton.styled';

interface PropsInterface {
  onToggle: () => void;
  canVibe: boolean | null;
  vibeCount?: number;
}

const VibeButton: FC<PropsInterface> = ({onToggle, canVibe, vibeCount}) => {
  return (
    <styled.Container>
      {/*@ts-ignore*/}
      <Button
        label={vibeCount === 1 ? 'vibe' : 'vibes'}
        variant={canVibe ? 'primary' : 'inverted'}
        icon="vibe"
        onClick={onToggle}
      >
        <styled.Counter>{vibeCount}</styled.Counter>
      </Button>
    </styled.Container>
  );
};

export default observer(VibeButton);
