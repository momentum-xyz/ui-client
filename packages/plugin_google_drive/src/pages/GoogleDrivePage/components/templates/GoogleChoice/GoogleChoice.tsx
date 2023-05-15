import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './GoogleChoice.styled';

interface PropsInterface {
  isAdmin: boolean;
  pickDocument: () => void;
}

const GoogleChoice: FC<PropsInterface> = ({isAdmin, pickDocument}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="GoogleChoice-test">
      {isAdmin ? (
        <styled.Actions>
          {t('plugin_gd.messages.noTeamDocument')}
          <Button
            variant="primary"
            label={t('plugin_gd.actions.chooseDocument')}
            onClick={pickDocument}
          />
        </styled.Actions>
      ) : (
        <styled.Actions>{t('plugin_gd.messages.noDocument')}</styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(GoogleChoice);
