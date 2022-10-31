import React, {useCallback, useEffect} from 'react';
import {toast} from 'react-toastify';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {generatePath, useHistory} from 'react-router-dom';
import {Toggle, Button, Text} from '@momentum-xyz/ui-kit';

import {Stage, ToastContent, TOAST_GROUND_OPTIONS, SpaceTopBar, SpacePage} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components';
import {useStore} from 'shared/hooks';
import {StageModeModerationEventEnum} from 'core/enums';
import {AgoraRemoteUserInterface} from 'core/models';
import {
  StageModePopupQueue,
  StageModeStats
} from 'scenes/collaboration/pages/StageModePage/components';
import {ROUTES} from 'core/constants';

import {RemoveParticipantFromStageDialog} from './components';
import * as styled from './StageModeModetator.styled';

interface PropsInterface {
  onLeaveMeeting: () => void;
}

const StageModeModerator: React.FC<PropsInterface> = ({onLeaveMeeting}) => {
  const {mainStore, collaborationStore, sessionStore, flightStore} = useStore();
  const {agoraStore, favoriteStore} = mainStore;
  const {agoraStageModeStore, userDevicesStore, agoraScreenShareStore} = agoraStore;
  const {spaceStore, removeParticipantFromStageDialog, streamChatStore, screenShareStore} =
    collaborationStore;

  const history = useHistory();

  const remoteUserClicked = useCallback(
    async (remoteUser: AgoraRemoteUserInterface, event = StageModeModerationEventEnum.REMOVE) => {
      if (event === StageModeModerationEventEnum.REMOVE) {
        collaborationStore.selectUserToRemoveAndOpenDialog(remoteUser);
      } else if (event === StageModeModerationEventEnum.MUTE) {
        await agoraStore.agoraStageModeStore.muteRemoteUser(remoteUser.uid as string);
      }
    },
    [agoraStore, collaborationStore]
  );

  const handleEnterStage = useCallback(async () => {
    if (agoraStageModeStore.isStageFull) {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.stageIsFull')}
          showCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );

      return;
    }

    await agoraStageModeStore.enterStage(userDevicesStore.createLocalTracks);
  }, [agoraStageModeStore, userDevicesStore.createLocalTracks]);

  const handleLeaveStage = useCallback(async () => {
    await Promise.all([userDevicesStore.mute(), userDevicesStore.turnOffCamera()]);

    await agoraStageModeStore.leaveStage(userDevicesStore.cleanupLocalTracks);

    if (sessionStore.userId === screenShareStore.screenOwnerId) {
      agoraScreenShareStore.stopScreenSharing();
    }
  }, [
    agoraScreenShareStore,
    agoraStageModeStore,
    screenShareStore.screenOwnerId,
    sessionStore.userId,
    userDevicesStore
  ]);

  useEffect(() => {
    if (!collaborationStore.isModerator && spaceStore?.id) {
      history.push(generatePath(ROUTES.collaboration.stageMode, {spaceId: spaceStore.id}));
    }
  }, [collaborationStore.isModerator, history, spaceStore?.id]);

  if (!spaceStore || !collaborationStore.isModerator) {
    return null;
  }

  return (
    <>
      <SpacePage dataTestId="StageModeModerator-test">
        <SpaceTopBar
          title={spaceStore.name ?? ''}
          subtitle={t('labels.stageMode')}
          isAdmin={spaceStore.isAdmin}
          spaceId={spaceStore.id}
          isSpaceFavorite={favoriteStore.isFavorite(spaceStore.id || '')}
          toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
          isChatOpen={streamChatStore.isOpen}
          toggleChat={streamChatStore.textChatDialog.toggle}
          numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
          editSpaceHidden
          onLeave={onLeaveMeeting}
        >
          <styled.ActionsContainer>
            <styled.ToggleContainer>
              <Toggle
                checked={agoraStore.isStageMode}
                disabled={agoraStore.isTogglingStageMode || flightStore.isFlightWithMe}
                onChange={() => {
                  agoraStore.toggleStageMode(sessionStore.userId);
                }}
              />
              <Text
                text={
                  agoraStore.isStageMode
                    ? t('messages.stageIsActive')
                    : t('messages.stageIsInactiveToggleToActivate')
                }
                size="s"
                isMultiline={false}
              />
            </styled.ToggleContainer>
            {agoraStore.isStageMode && <StageModeStats />}
            {agoraStore.isStageMode && agoraStageModeStore.canEnterStage && (
              <Button
                label={`${t('actions.goOnStage')}?`}
                variant="primary"
                onClick={handleEnterStage}
                disabled={agoraStageModeStore.isTogglingIsOnStage}
              />
            )}
            {agoraStore.isStageMode && agoraStageModeStore.isOnStage && (
              <Button
                label={`${t('actions.leaveStage')}?`}
                variant="danger"
                onClick={handleLeaveStage}
                disabled={agoraStageModeStore.isTogglingIsOnStage}
              />
            )}
            {agoraStore.isStageMode && agoraStageModeStore.isStageFull && (
              <Text text={t('messages.stageIsFull')} size="s" isMultiline={false} />
            )}
          </styled.ActionsContainer>
        </SpaceTopBar>
        <styled.Body>
          <styled.InnerBody>
            <styled.PopupQueueContainer>
              <StageModePopupQueue />
            </styled.PopupQueueContainer>
            <styled.StageContainer>
              {agoraStore.isStageMode ? (
                <Stage onRemoteUserClick={remoteUserClicked} />
              ) : (
                <styled.StageModeNotActiveText
                  text={t('messages.stageModeNotActiveModerator')}
                  size="xl"
                  transform="uppercase"
                  weight="bold"
                />
              )}
            </styled.StageContainer>
          </styled.InnerBody>
          {streamChatStore.isOpen && streamChatStore.client && streamChatStore.currentChannel && (
            <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
          )}
        </styled.Body>
      </SpacePage>
      {removeParticipantFromStageDialog.isOpen &&
        collaborationStore.participantToRemoveFromStage && (
          <RemoveParticipantFromStageDialog
            participant={collaborationStore.participantToRemoveFromStage}
          />
        )}
    </>
  );
};

export default observer(StageModeModerator);
