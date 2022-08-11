import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {useHistory} from 'react-router-dom';

import {
  Toggle,
  Stage,
  Button,
  Text,
  ToastContent,
  TOAST_GROUND_OPTIONS,
  SpaceTopBar,
  TextChat
} from 'ui-kit';
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

const StageModeModerator: React.FC = () => {
  const {mainStore, collaborationStore, sessionStore} = useStore();
  const {agoraStore, favoriteStore} = mainStore;
  const {agoraStageModeStore, userDevicesStore} = agoraStore;
  const {space, removeParticipantFromStageDialog, textChatStore} = collaborationStore;

  const history = useHistory();

  const remoteUserClicked = useCallback(
    async (remoteUser: AgoraRemoteUserInterface, event = StageModeModerationEventEnum.REMOVE) => {
      if (event === StageModeModerationEventEnum.REMOVE) {
        collaborationStore.selectUserToRemoveAndOpenDialog(remoteUser);
      } else if (event === StageModeModerationEventEnum.MUTE) {
        await agoraStore.muteRemoteUser(remoteUser.uid as string);
      }
    },
    [agoraStore, collaborationStore]
  );

  const handleEnterStage = useCallback(async () => {
    if (!agoraStageModeStore.canEnterStage) {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.stageIsFull')}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );

      return;
    }

    await agoraStageModeStore.enterStage(userDevicesStore.createLocalTracks);
  }, [agoraStageModeStore, userDevicesStore.createLocalTracks]);

  const handleLeaveStage = useCallback(() => {
    agoraStageModeStore.leaveStage();
  }, [agoraStageModeStore]);

  if (!space) {
    return null;
  }

  return (
    <>
      <styled.Container data-testid="StageModeModerator-test">
        <SpaceTopBar
          title={space.name ?? ''}
          subtitle={t('labels.stageMode')}
          isAdmin={space.isAdmin}
          spaceId={space.id}
          isSpaceFavorite={favoriteStore.isFavorite(space.id || '')}
          toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
          onClose={() => history.push(ROUTES.base)}
          isChatOpen={collaborationStore.textChatDialog.isOpen}
          toggleChat={collaborationStore.textChatDialog.toggle}
          editSpaceHidden
        >
          <styled.ActionsContainer>
            <styled.ToggleContainer>
              <Toggle
                checked={agoraStore.isStageMode}
                onChange={() => {
                  agoraStore.toggleStageMode(sessionStore.userId);
                }}
                disabled={agoraStore.isTogglingStageMode}
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
            {agoraStore.isStageMode &&
              (agoraStageModeStore.canEnterStage || agoraStageModeStore.isOnStage) && (
                <>
                  <StageModeStats />
                  {agoraStageModeStore.isOnStage ? (
                    <Button
                      label={`${t('actions.leaveStage')}?`}
                      variant="danger"
                      onClick={handleLeaveStage}
                    />
                  ) : (
                    <Button
                      label={`${t('actions.goOnStage')}?`}
                      variant="primary"
                      onClick={handleEnterStage}
                    />
                  )}
                </>
              )}
            {agoraStore.isStageMode && !agoraStageModeStore.canEnterStage && (
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
          {collaborationStore.textChatDialog.isOpen && (
            <TextChat
              currentChannel={textChatStore.currentChannel}
              userId={sessionStore.userId}
              sendMessage={textChatStore.sendMessage}
              messages={textChatStore.messages}
            />
          )}
        </styled.Body>
      </styled.Container>
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
