import React, {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';

import * as styled from './BuildOdyssey.styled';

interface PropsInterface {
  name: string;
  disabled?: boolean;
  onBuild: () => void;
}

const BuildOdyssey: FC<PropsInterface> = (props) => {
  const {name, disabled, onBuild} = props;

  const {t} = useI18n();

  return (
    <Box>
      <styled.Div>
        <Text size="s" text={t('messages.hello_nickname', {nickname: name})} align="left" />
        <Text size="s" text={t('messages.startCreating')} align="left" />
        <Button
          size="medium"
          label={t('actions.buildOdyssey')}
          disabled={disabled}
          onClick={onBuild}
        />
      </styled.Div>
    </Box>
  );
};

export default BuildOdyssey;
