import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
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
  const {agoraStageModeStore, userDevicesStore} = agoraStore;
  const {textChatStore, space} = collaborationStore;
  const {addAwaitingPermissionPopup} = collaborationStore.stageModeStore;

  const {t} = useTranslation();

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
          showCloseButton
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
                onClick={async () => {
                  await userDevicesStore.mute();
                  await userDevicesStore.turnOffCamera();

                  await agoraStageModeStore.leaveStage();
                }}
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
