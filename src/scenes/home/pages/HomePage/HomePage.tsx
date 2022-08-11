import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {Button} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import {ExplorePanel, OnlineUsersPanel} from './components';
import * as styled from './HomePage.styled';

const HomePage: FC = () => {
  const {collaborationStore, meetingStore, mainStore} = useStore();
  const {leftMeetingSpaceId} = collaborationStore;
  const {unityStore} = mainStore;

  const {t} = useTranslation();
  const history = useHistory();

  const rejoinMeeting = useCallback(() => {
    unityStore.teleportToSpace(leftMeetingSpaceId || '');
    history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId: leftMeetingSpaceId}));
  }, [unityStore, leftMeetingSpaceId, history]);

  return (
    <styled.Container data-testid="HomePage-test">
      <styled.PanelWrapper>
        <ExplorePanel />
      </styled.PanelWrapper>

      <styled.PanelWrapper>
        {!!leftMeetingSpaceId && !meetingStore.isKicked && (
          <styled.Rejoin>
            <Button variant="primary" onClick={rejoinMeeting} label={t('actions.rejoinMeeting')} />
          </styled.Rejoin>
        )}

        <OnlineUsersPanel />
      </styled.PanelWrapper>
    </styled.Container>
  );
};

export default observer(HomePage);
