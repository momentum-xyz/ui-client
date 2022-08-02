import React, {FC, useCallback, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {t} from 'i18next';

import {usePosBusEvent, useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {IconSvg, Text, Button, SpaceTopBar} from 'ui-kit';

import {Dashboard, TileForm} from './components';
import * as styled from './DashboardPage.styled';
import {RemoveTileDialog} from './components/templates/Dashboard/components/RemoveTileDialog';
import {VibeButton} from './components/templates/Dashboard/components/VibeButton';
import {InviteToSpaceMenu} from './components/templates/InviteToSpaceMenu';

const DashboardPage: FC = () => {
  const {collaborationStore, sessionStore, mainStore} = useStore();
  const {dashboardStore, space} = collaborationStore;
  const {tileDialog, tileRemoveDialog, tileList, onDragEnd, vibeStore, inviteToSpaceDialog} =
    dashboardStore;
  const {agoraStore, favoriteStore} = mainStore;

  const history = useHistory();

  const inviteRef = useRef<HTMLDivElement>(null);

  usePosBusEvent('user-vibed', (type, count) => {
    vibeStore.setCount(count);
  });

  useEffect(() => {
    if (space) {
      dashboardStore.fetchDashboard(space.id);
      favoriteStore.setSpaceId(space.id);
      vibeStore.check(space.id);
      vibeStore.count(space.id);
    }
    return () => {
      dashboardStore.resetModel();
    };
  }, [dashboardStore, favoriteStore, space, vibeStore]);

  const handleClose = () => {
    history.push(ROUTES.base);
  };

  const handleToggleVibe = useCallback(async () => {
    const success = await vibeStore.toggle(space?.id ?? '');
    if (success) {
      vibeStore.toggleVibe();
    }
  }, [space?.id, vibeStore]);

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
        <VibeButton
          onToggle={handleToggleVibe}
          canVibe={vibeStore.canVibe}
          vibeCount={vibeStore.vibeCount}
        />
        {(space.isAdmin || space.isMember) && (
          <Button label={t('dashboard.addTile')} variant="primary" onClick={tileDialog.open} />
        )}
        <styled.InviteButtonWrapper ref={inviteRef}>
          <Button
            label={t('dashboard.invitePeople')}
            icon="invite-user"
            variant="primary"
            onClick={inviteToSpaceDialog.open}
          />
        </styled.InviteButtonWrapper>
        {!sessionStore.isGuest && space.isStakeShown && (
          <Button label={t('dashboard.stake')} variant="primary" />
        )}
      </SpaceTopBar>

      {!dashboardStore.dashboardIsEdited && space.isOwner && (
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
      {inviteToSpaceDialog.isOpen && (
        <InviteToSpaceMenu
          onClose={inviteToSpaceDialog.close}
          leftOffSet={
            (inviteRef.current?.offsetLeft ?? 0) +
            (inviteRef.current?.offsetParent?.parentElement?.offsetLeft ?? 0)
          }
        />
      )}
    </styled.Container>
  );
};

export default observer(DashboardPage);
