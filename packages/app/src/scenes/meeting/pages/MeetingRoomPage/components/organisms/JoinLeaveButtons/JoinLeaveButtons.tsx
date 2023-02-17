import React, {FC} from 'react';
import {generatePath, useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';

import * as styled from './JoinLeaveButtons.styled';

interface PropsInterface {
  spaceId: string;
  isJoinButtonShown?: boolean;
  onLeave: () => void;
}

const JoinLeaveButtons: FC<PropsInterface> = (props) => {
  const {spaceId, isJoinButtonShown, onLeave} = props;

  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
    <styled.Container data-testid="JoinLeaveButtons-test">
      {isJoinButtonShown && (
        <styled.ActionButton
          variant="primary-background"
          label={t('actions.return')}
          icon="collaboration"
          onClick={() => {
            navigate({pathname: generatePath(ROUTES.collaboration.dashboard, {spaceId})});
          }}
        />
      )}

      <styled.ActionButton
        variant="danger-background"
        label={t('actions.leave')}
        icon="leave"
        onClick={onLeave}
      />
    </styled.Container>
  );
};

export default observer(JoinLeaveButtons);
