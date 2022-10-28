import React, {FC, useCallback, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router';
import {useTranslation} from 'react-i18next';
import {IconSvg, Text, Button} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {SpacePage, SpaceTopBar} from 'ui-kit';

import {Dashboard, InviteToSpaceMenu, RemoveTileDialog, TileForm, VibeButton} from './components';
import * as styled from './DashboardPage.styled';

const DashboardPage: FC = () => {
  const {collaborationStore, sessionStore, mainStore, leaveMeetingSpace, flightStore} = useStore();
  const {dashboardStore, spaceStore, streamChatStore} = collaborationStore;
  const {tileDialog, tileRemoveDialog, tileList, vibeStore, inviteToSpaceDialog} = dashboardStore;
  const {flyWithMeStore} = flightStore;
  const {agoraStore, favoriteStore} = mainStore;

  const inviteRef = useRef<HTMLButtonElement>(null);
  const {t} = useTranslation();
  const history = useHistory();

  usePosBusEvent('user-vibed', (type, count) => {
    console.info('[POSBUS EVENT] user-vibed', type, count);
    vibeStore.setCount(count);
  });

  useEffect(() => {
    if (spaceStore) {
      dashboardStore.fetchDashboard(spaceStore.id);
      vibeStore.check(spaceStore.id);
      vibeStore.count(spaceStore.id);
    }
    return () => {
      dashboardStore.resetModel();
    };
  }, [dashboardStore, favoriteStore, spaceStore, vibeStore]);

  const handleToggleVibe = useCallback(async () => {
    const success = await vibeStore.toggle(spaceStore?.id ?? '');
    if (success) {
      vibeStore.toggleVibe();
    }
  }, [spaceStore?.id, vibeStore]);

  if (!spaceStore) {
    return null;
  }

  return (
    <SpacePage dataTestId="DashboardPage-test">
      <SpaceTopBar
        title={spaceStore.name ?? ''}
        subtitle={t('dashboard.subtitle')}
        isSpaceFavorite={favoriteStore.isFavorite(spaceStore?.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        spaceId={spaceStore.id}
        isAdmin={spaceStore.isAdmin}
        isChatOpen={streamChatStore.isOpen}
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
        {(spaceStore.isAdmin || spaceStore.isMember) && (
          <Button label={t('dashboard.addTile')} variant="primary" onClick={tileDialog.open} />
        )}
        {(spaceStore.isAdmin || spaceStore.isMember) && (
          <Button
            ref={inviteRef}
            label={t('dashboard.invitePeople')}
            icon="invite-user"
            variant="primary"
            onClick={inviteToSpaceDialog.open}
          />
        )}
        {!sessionStore.isGuest && spaceStore.isStakeShown && (
          <Button label={t('dashboard.stake')} variant="primary" />
        )}
        {spaceStore.isAdmin && (
          <Button
            variant="primary"
            icon="fly-with-me"
            label={t('labels.flyWithMe')}
            disabled={!agoraStore.hasJoined || agoraStore.isStageMode || flightStore.isFlightWithMe}
            onClick={() => flyWithMeStore.start(spaceStore.id)}
          />
        )}
      </SpaceTopBar>

      {!dashboardStore.dashboardIsEdited && spaceStore.isOwner && (
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
        canDrag={spaceStore.isAdmin || spaceStore.isMember}
        textChatIsOpen={streamChatStore.isOpen}
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
    </SpacePage>
  );
};

export default observer(DashboardPage);
