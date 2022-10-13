import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '@momentum-xyz/ui-kit';

import * as styled from './VibeButton.styled';

interface PropsInterface {
  onToggle: () => void;
  canVibe: boolean;
  vibeCount: number;
}

const VibeButton: FC<PropsInterface> = ({onToggle, canVibe, vibeCount}) => {
  const {t} = useTranslation();

  return (
    <styled.Container>
      <Button
        label={t('counts.vibes', {count: vibeCount})}
        variant={canVibe ? 'primary' : 'inverted'}
        icon="vibe"
        onClick={onToggle}
        preserveSpaces={true}
      />
    </styled.Container>
  );
};

export default observer(VibeButton);
