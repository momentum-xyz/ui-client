import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';

import * as styled from './JoinLeaveButtons.styled';

interface PropsInterface {
  isShown: boolean;
}

const JoinLeaveButtons: FC<PropsInterface> = ({isShown}) => {
  const {t} = useTranslation();
  const history = useHistory();

  return (
    <div data-testid="JoinLeaveButtons-test">
      <styled.ActionButton
        variant="primary-background"
        label={t('actions.return')}
        icon="collaboration"
        onClick={() => {
          history.push(ROUTES.collaboration);
        }}
      />
      <styled.ActionButton
        variant="danger-background"
        label={t('actions.leave')}
        icon="leave"
        onClick={() => {
          history.push(ROUTES.base);
        }}
      />
    </div>
  );
};

export default observer(JoinLeaveButtons);
