import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

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
          <styled.Text>{t('messages.noTeamMiroBoard')}</styled.Text>
          <styled.Button onClick={pickBoard}>{t('actions.chooseBoard')}</styled.Button>
        </styled.Actions>
      ) : (
        <styled.Actions>
          <styled.Text>{t('messages.noMiroBoard')}</styled.Text>
        </styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(MiroChoice);
