import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Button} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import {ExplorePanel, OnlineUsersPanel} from './components';
import * as styled from './HomePage.styled';

const HomePage: FC = () => {
  const {meetingStore, mainStore} = useStore();
  const {unityStore} = mainStore;

  const {t} = useTranslation();
  const history = useHistory();

  const rejoinMeeting = useCallback(
    (spaceId) => {
      unityStore.teleportToSpace(spaceId);
      history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId}));
    },
    [unityStore, history]
  );

  return (
    <styled.Container data-testid="HomePage-test">
      <styled.PanelWrapper>
        <ExplorePanel />
      </styled.PanelWrapper>

      <styled.PanelWrapper>
        {meetingStore.canRejoin && (
          <styled.Rejoin>
            <Button
              variant="primary"
              label={t('actions.rejoinMeeting')}
              onClick={() => rejoinMeeting(meetingStore.lastSpaceId)}
            />
          </styled.Rejoin>
        )}

        <OnlineUsersPanel />
      </styled.PanelWrapper>
    </styled.Container>
  );
};

export default observer(HomePage);
