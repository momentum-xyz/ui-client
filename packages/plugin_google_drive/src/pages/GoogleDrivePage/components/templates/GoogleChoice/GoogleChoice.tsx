import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {Button, Text} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './GoogleChoice.styled';

interface PropsInterface {
  isAdmin: boolean;
  pickDocument: () => void;
}

const GoogleChoice: FC<PropsInterface> = ({isAdmin, pickDocument}) => {
  const {t} = useI18n();
  const theme = useTheme();

  return (
    <styled.Wrapper data-testid="GoogleChoice-test">
      {isAdmin ? (
        <styled.Actions>
          <Text text={t('plugin_gd.messages.noTeamDocument')} theme={theme} size="s" />
          <Button
            theme={theme}
            variant="primary"
            label={t('plugin_gd.actions.chooseDocument')}
            onClick={pickDocument}
          />
        </styled.Actions>
      ) : (
        <styled.Actions>
          <Text text={t('plugin_gd.messages.noDocument')} theme={theme} size="s" />
        </styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(GoogleChoice);
