import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Heading} from '@momentum/ui-kit';

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
          {/* TODO: Change to Text when added to ui-kit */}
          <Heading label={t('messages.noTeamMiroBoard')} type="h1" />
          {/* TODO: Change to Button from @momentum/ui-kit */}
          <styled.Button onClick={pickBoard}>{t('actions.chooseBoard')}</styled.Button>
        </styled.Actions>
      ) : (
        <styled.Actions>
          {/* TODO: Change to Text when added to ui-kit */}
          <Heading type="h1" label={t('messages.noMiroBoard')} />
        </styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(MiroChoice);
