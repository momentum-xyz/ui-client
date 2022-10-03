import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {Button, Text} from '@momentum/ui-kit';

import * as styled from './GoogleChoice.styled';

interface PropsInterface {
  isAdmin: boolean;
  pickDocument: () => void;
}

const GoogleChoice: FC<PropsInterface> = ({isAdmin, pickDocument}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <styled.Wrapper data-testid="GoogleChoice-test">
      {isAdmin ? (
        <styled.Actions>
          <Text text={t('messages.noTeamDocument')} theme={theme} size="s" />
          <Button
            theme={theme}
            variant="primary"
            label={t('actions.chooseDocument')}
            onClick={pickDocument}
          />
        </styled.Actions>
      ) : (
        <styled.Actions>
          <Text text={t('messages.noDocument')} theme={theme} size="s" />
        </styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(GoogleChoice);
