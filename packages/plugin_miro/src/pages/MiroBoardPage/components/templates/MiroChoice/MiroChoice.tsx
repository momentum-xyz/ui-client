import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Button, Text} from '@momentum/ui-kit';

import * as styled from './MiroChoice.styled';

interface PropsInterface {
  isAdmin: boolean;
  pickBoard: () => void;
}

const MiroChoice: FC<PropsInterface> = ({isAdmin, pickBoard}) => {
  const {t} = useTranslation();

  return (
    <styled.Wrapper data-testid="MiroChoice-test">
      {isAdmin ? (
        <styled.Actions>
          <Text text={t('messages.noTeamMiroBoard')} size="s" />
          <Button
            label={t('actions.chooseBoard')}
            onClick={pickBoard}
            transform="uppercase"
            variant="primary"
          />
        </styled.Actions>
      ) : (
        <styled.Actions>
          <Text text={t('messages.noMiroBoard')} size="s" />
        </styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(MiroChoice);
