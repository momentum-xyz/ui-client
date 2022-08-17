import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';

import * as styled from './JoinLeaveButtons.styled';

interface PropsInterface {
  isJoinButtonShown?: boolean;
  isLeaveButtonShown?: boolean;
}

const JoinLeaveButtons: FC<PropsInterface> = (props) => {
  const {isJoinButtonShown, isLeaveButtonShown} = props;

  const {t} = useTranslation();
  const history = useHistory();

  if (!isJoinButtonShown && !isLeaveButtonShown) {
    return <></>;
  }

  return (
    <styled.Container data-testid="JoinLeaveButtons-test">
      {isJoinButtonShown && (
        <styled.ActionButton
          variant="primary-background"
          label={t('actions.return')}
          icon="collaboration"
          onClick={() => {
            history.push(ROUTES.collaboration);
          }}
        />
      )}

      {isLeaveButtonShown && (
        <styled.ActionButton
          variant="danger-background"
          label={t('actions.leave')}
          icon="leave"
          onClick={() => {
            history.push(ROUTES.base);
          }}
        />
      )}
    </styled.Container>
  );
};

export default observer(JoinLeaveButtons);
