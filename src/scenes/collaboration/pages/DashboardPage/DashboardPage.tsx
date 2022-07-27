import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {IconSvg, Text, TopBar, Button} from 'ui-kit';

import {TopBarActions} from './components/templates/TopBarActions';
import Dashboard from './components/templates/Dashboard/Dashboard';
import * as styled from './DashboardPage.styled';

const DashboardPage: FC = () => {
  const {collaborationStore, sessionStore, mainStore} = useStore();
  const {agoraStore, favoriteStore, unityStore} = mainStore;
  const {dashboard, space} = collaborationStore;
  const {tileList, onDragEnd} = dashboard;

  const history = useHistory();

  useEffect(() => {
    if (space) {
      dashboard.fetchDashboard(space.id);
      favoriteStore.setSpaceId(space.id);
    }
    return () => {
      dashboard.resetModel();
    };
  }, [dashboard, favoriteStore, space]);

  const leaveCollaborationSpace = async () => {
    if (space) {
      unityStore.leaveSpace(space.id);
      await agoraStore.leaveMeetingSpace();
      collaborationStore.leaveMeetingSpace();

      history.push(ROUTES.base);
    }
  };

  if (!space) {
    return null;
  }

  return (
    <styled.Container>
      <TopBar
        title={space?.name ?? ''}
        subtitle={t('dashboard.subtitle')}
        onClose={leaveCollaborationSpace}
        actions={
          <TopBarActions favoriteStore={favoriteStore} spaceId={space.id} isAdmin={space.isAdmin} />
        }
      >
        <Button label={t('dashboard.vibe')} variant="primary" />
        {(space.isAdmin || space.isMember) && (
          <Button label={t('dashboard.addTile')} variant="primary" />
        )}
        <Button label={t('dashboard.invitePeople')} icon="invite-user" variant="primary" />
        {!sessionStore.isGuest && space.isStakeShown && (
          <Button label={t('dashboard.stake')} variant="primary" />
        )}
      </TopBar>
      {!dashboard.dashboardIsEdited && space.isOwner && (
        <styled.AlertContainer>
          <IconSvg name="alert" size="large" isWhite />
          <styled.AlertContent>
            <Text
              text={t('titles.updateSpace')}
              size="s"
              weight="bold"
              align="left"
              transform="uppercase"
            />
            <Text text={t('messages.updateSpace')} size="s" align="left" />
          </styled.AlertContent>
        </styled.AlertContainer>
      )}
      <Dashboard
        tilesList={tileList.tileMatrix}
        onDragEnd={onDragEnd}
        canDrag={space.isAdmin || space.isMember}
      />
    </styled.Container>
  );
};

export default observer(DashboardPage);
