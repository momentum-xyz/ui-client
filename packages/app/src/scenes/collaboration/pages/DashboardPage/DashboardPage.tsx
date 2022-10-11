import React, {FC, useCallback, useEffect, useRef} from 'react';
import {generatePath} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router';
import {useTranslation} from 'react-i18next';
import {IconSvg, Text, Button} from '@momentum/ui-kit';

import {ROUTES} from 'core/constants';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {SpaceTopBar} from 'ui-kit';

import {Dashboard, InviteToSpaceMenu, RemoveTileDialog, TileForm, VibeButton} from './components';
import * as styled from './DashboardPage.styled';

const DashboardPage: FC = () => {
  const {collaborationStore, sessionStore, mainStore, leaveMeetingSpace, flightStore} = useStore();
  const {dashboardStore, space, streamChatStore} = collaborationStore;
  const {tileDialog, tileRemoveDialog, tileList, vibeStore, inviteToSpaceDialog} = dashboardStore;
  const {agoraStore, favoriteStore} = mainStore;

  const inviteRef = useRef<HTMLButtonElement>(null);
  const {t} = useTranslation();
  const history = useHistory();

  usePosBusEvent('user-vibed', (type, count) => {
    console.info('[POSBUS EVENT] user-vibed', type, count);
    vibeStore.setCount(count);
  });

  useEffect(() => {
    if (space) {
      dashboardStore.fetchDashboard(space.id);
      vibeStore.check(space.id);
      vibeStore.count(space.id);
    }
    return () => {
      dashboardStore.resetModel();
    };
  }, [dashboardStore, favoriteStore, space, vibeStore]);

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
    <styled.Container data-testid="DashboardPage-test">
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={t('dashboard.subtitle')}
        isSpaceFavorite={favoriteStore.isFavorite(space?.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        spaceId={space.id}
        isAdmin={space.isAdmin}
        isChatOpen={streamChatStore.textChatDialog.isOpen}
        toggleChat={streamChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
      >
        <VibeButton
          onToggle={handleToggleVibe}
          canVibe={vibeStore.canVibe}
          vibeCount={vibeStore.vibeCount}
        />
        {(space.isAdmin || space.isMember) && (
          <Button label={t('dashboard.addTile')} variant="primary" onClick={tileDialog.open} />
        )}
        {(space.isAdmin || space.isMember) && (
          <Button
            ref={inviteRef}
            label={t('dashboard.invitePeople')}
            icon="invite-user"
            variant="primary"
            onClick={inviteToSpaceDialog.open}
          />
        )}
        {!sessionStore.isGuest && space.isStakeShown && (
          <Button label={t('dashboard.stake')} variant="primary" />
        )}
        {space.isAdmin && (
          <Button
            variant="primary"
            icon="fly-with-me"
            label={t('labels.flyWithMe')}
            disabled={agoraStore.isStageMode || flightStore.isFlightWithMe}
            onClick={() => history.push(generatePath(ROUTES.flyWithMe, {spaceId: space.id}))}
          />
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
        onDragEnd={dashboardStore.onDragEnd}
        canDrag={space.isAdmin || space.isMember}
        textChatIsOpen={streamChatStore.textChatDialog.isOpen}
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
