import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button} from '@momentum-xyz/ui-kit';

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
          {t('plugin_miro.messages.noTeamMiroBoard')}
          <Button
            label={t('plugin_miro.actions.chooseBoard')}
            onClick={pickBoard}
            // transform="uppercase"
            variant="primary"
          />
        </styled.Actions>
      ) : (
        <styled.Actions>{t('plugin_miro.messages.noMiroBoard')}</styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(MiroChoice);
