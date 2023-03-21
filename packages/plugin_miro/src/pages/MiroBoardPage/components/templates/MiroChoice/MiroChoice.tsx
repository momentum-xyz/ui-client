import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button, Text} from '@momentum-xyz/ui-kit';

import * as styled from './MiroChoice.styled';

interface PropsInterface {
  isAdmin: boolean;
  pickBoard: () => void;
}

const MiroChoice: FC<PropsInterface> = ({isAdmin, pickBoard}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="MiroChoice-test">
      {isAdmin ? (
        <styled.Actions>
          <Text text={t('plugin_miro.messages.noTeamMiroBoard')} size="s" />
          <Button
            label={t('plugin_miro.actions.chooseBoard')}
            onClick={pickBoard}
            transform="uppercase"
            variant="primary"
          />
        </styled.Actions>
      ) : (
        <styled.Actions>
          <Text text={t('plugin_miro.messages.noMiroBoard')} size="s" />
        </styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(MiroChoice);
