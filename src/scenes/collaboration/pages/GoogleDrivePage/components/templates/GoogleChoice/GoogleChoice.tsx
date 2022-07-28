import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';

import {Button, Text} from 'ui-kit';

import * as styled from './GoogleChoice.styled';

interface PropsInterface {
  isAdmin: boolean;
  pickBoard: () => void;
}

const GoogleChoice: FC<PropsInterface> = ({isAdmin, pickBoard}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <styled.Wrapper>
      {isAdmin ? (
        <styled.Actions>
          <Text text={t('messages.noTeamDocument')} theme={theme} size="s" />
          <Button
            theme={theme}
            variant="primary"
            label={t('actions.chooseDocument')}
            onClick={pickBoard}
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
