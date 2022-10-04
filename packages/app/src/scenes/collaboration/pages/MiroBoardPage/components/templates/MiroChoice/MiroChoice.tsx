import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {Button, Text} from '@momentum/ui-kit';

import * as styled from './MiroChoice.styled';

interface PropsInterface {
  isAdmin: boolean;
  pickBoard: () => void;
}

const MiroChoice: FC<PropsInterface> = ({isAdmin, pickBoard}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <styled.Wrapper data-testid="MiroChoice-test">
      {isAdmin ? (
        <styled.Actions>
          <Text text={t('messages.noTeamMiroBoard')} theme={theme} size="s" />
          <Button
            theme={theme}
            variant="primary"
            label={t('actions.chooseBoard')}
            onClick={pickBoard}
          />
        </styled.Actions>
      ) : (
        <styled.Actions>
          <Text text={t('messages.noMiroBoard')} theme={theme} size="s" />
        </styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(MiroChoice);
