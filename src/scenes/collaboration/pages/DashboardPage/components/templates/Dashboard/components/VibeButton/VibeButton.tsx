import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';

import {useStore} from 'shared/hooks';
import {Button} from 'ui-kit';

import * as styled from './VibeButton.styled';

const VibeButton: FC = () => {
  const {collaborationStore} = useStore();
  const {dashboardStore} = collaborationStore;
  const {vibeStore} = dashboardStore;

  return (
    <styled.Container>
      {/*@ts-ignore*/}
      <Button
        label={vibeStore.vibeCount === 1 ? 'vibe' : 'vibes'}
        variant={vibeStore.isVibe ? 'inverted' : 'primary'}
        icon="vibe"
        onClick={vibeStore.toggleVibe}
      >
        <styled.Counter>{vibeStore.vibeCount}</styled.Counter>
      </Button>
    </styled.Container>
  );
};

export default observer(VibeButton);
