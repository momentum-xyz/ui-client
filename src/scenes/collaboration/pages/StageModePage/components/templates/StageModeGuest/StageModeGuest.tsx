import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {useStore, usePosBusEvent} from 'shared/hooks';
import {ToastContent, Button, SpaceTopBar, Text, Stage, TextChat} from 'ui-kit';
import {
  StageModePopupQueue,
  StageModeStats
} from 'scenes/collaboration/pages/StageModePage/components';

import * as styled from './StageModeGuest.styled';

interface PropsInterface {
  onLeaveMeeting: () => void;
}

const StageModeGuest: React.FC<PropsInterface> = ({onLeaveMeeting}) => {
  const {mainStore, collaborationStore, sessionStore} = useStore();
  const {agoraStore, favoriteStore} = mainStore;
  const {agoraStageModeStore} = agoraStore;
  const {textChatStore, space} = collaborationStore;
  const {addAwaitingPermissionPopup, removeAwaitingPermissionPopup} =
    collaborationStore.stageModeStore;

  const {t} = useTranslation();

  usePosBusEvent('stage-mode-accepted', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      agoraStageModeStore.requestToGoOnstageWasHandled();
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      agoraStageModeStore.requestToGoOnstageWasHandled();
    }
  });

  const showSuccessStageModeRequestSubmissionToast = useCallback(() => {
    addAwaitingPermissionPopup();
  }, [addAwaitingPermissionPopup]);

  const handleUserRequest = useCallback(async () => {
    try {
      await agoraStageModeStore.requestToGoOnStage();
      showSuccessStageModeRequestSubmissionToast();
    } catch (e) {
      console.info(e);
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.joinStageRequestFailure')}
          isCloseButton
        />
      );
    }
  }, [agoraStore, showSuccessStageModeRequestSubmissionToast, t]);

  if (!space) {
    return null;
  }

  return (
    <styled.Container data-testid="StageModeGuest-test">
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={t('labels.stageMode')}
        isSpaceFavorite={favoriteStore.isSpaceFavorite}
        isAdmin={space.isAdmin}
        spaceId={space.id}
        isChatOpen={textChatStore.textChatDialog.isOpen}
        toggleChat={textChatStore.textChatDialog.toggle}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        numberOfUnreadMessages={textChatStore.numberOfUnreadMessages}
        onLeave={onLeaveMeeting}
      >
        <styled.Actions>
          {agoraStore.isStageMode && <StageModeStats />}

          {agoraStore.isStageMode &&
            !agoraStageModeStore.requestWasMadeToGoOnStage &&
            (agoraStageModeStore.isOnStage ? (
              <Button
                label={t('actions.leaveStage')}
                variant="danger"
                onClick={agoraStageModeStore.leaveStage}
              />
            ) : (
              <Button
                label={t('actions.goOnStage')}
                variant="primary"
                onClick={handleUserRequest}
              />
            ))}
          {agoraStore.isStageMode && agoraStageModeStore.requestWasMadeToGoOnStage && (
            <Text text={t('messages.pendingRequestToGoOnStage')} size="m" />
          )}
          {agoraStore.isStageMode && !agoraStageModeStore.canEnterStage && (
            <Text text={t('messages.stageIsFull')} size="m" />
          )}
        </styled.Actions>
      </SpaceTopBar>
      <styled.Body>
        <styled.InnerBody>
          <styled.PopupQueueWrapper>
            <StageModePopupQueue />
          </styled.PopupQueueWrapper>
          <styled.StageModeContainer>
            {agoraStore.isStageMode ? (
              <Stage />
            ) : (
              <styled.StageModeMessageText
                text={t('messages.stageModeNotActiveGuest')}
                size="xl"
                transform="uppercase"
                align="center"
                weight="bold"
              />
            )}
          </styled.StageModeContainer>
        </styled.InnerBody>
        {textChatStore.textChatDialog.isOpen && (
          <TextChat
            currentChannel={textChatStore.currentChannel}
            userId={sessionStore.userId}
            sendMessage={textChatStore.sendMessage}
            messages={textChatStore.messages}
            messageSent={textChatStore.messageSent}
          />
        )}
      </styled.Body>
    </styled.Container>
  );
};

export default observer(StageModeGuest);
