import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {IconSvg, Text, Button, SpaceTopBar} from 'ui-kit';

import {Dashboard, TileForm} from './components';
import * as styled from './DashboardPage.styled';
import {RemoveTileDialog} from './components/templates/Dashboard/components/RemoveTileDialog';

const DashboardPage: FC = () => {
  const {collaborationStore, sessionStore, mainStore} = useStore();
  const {dashboardStore, space} = collaborationStore;
  const {dashboard, tileDialog, tileRemoveDialog} = dashboardStore;
  const {agoraStore, favoriteStore} = mainStore;
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

  const handleClose = () => {
    history.push(ROUTES.base);
  };

  if (!space) {
    return null;
  }

  return (
    <styled.Container>
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={t('dashboard.subtitle')}
        onClose={handleClose}
        isSpaceFavorite={favoriteStore.isFavorite(space?.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        spaceId={space.id}
        isAdmin={space.isAdmin}
        isChatOpen={agoraStore.isChatOpen}
        toggleChat={agoraStore.toggleChat}
      >
        <Button label={t('dashboard.vibe')} variant="primary" />
        {(space.isAdmin || space.isMember) && (
          <Button label={t('dashboard.addTile')} variant="primary" onClick={tileDialog.open} />
        )}
        <Button label={t('dashboard.invitePeople')} icon="invite-user" variant="primary" />
        {!sessionStore.isGuest && space.isStakeShown && (
          <Button label={t('dashboard.stake')} variant="primary" />
        )}
      </SpaceTopBar>
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
      {tileDialog.isOpen && <TileForm />}
      {tileRemoveDialog.isOpen && <RemoveTileDialog />}
    </styled.Container>
  );
};

export default observer(DashboardPage);
