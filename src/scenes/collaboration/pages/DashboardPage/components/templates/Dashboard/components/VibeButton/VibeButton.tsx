import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {Button} from 'ui-kit';

import * as styled from './VibeButton.styled';

interface PropsInterface {
  onToggle: () => void;
  canVibe: boolean | null;
  vibeCount?: number;
}

const VibeButton: FC<PropsInterface> = ({onToggle, canVibe, vibeCount}) => {
  const {t} = useTranslation();

  return (
    <styled.Container>
      {/*@ts-ignore*/}
      <Button
        label={vibeCount === 1 ? t('dashboard.vibe') : t('dashboard.vibes')}
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
