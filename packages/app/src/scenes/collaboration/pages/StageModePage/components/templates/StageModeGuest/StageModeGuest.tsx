import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {ToastContent, SpaceTopBar, Stage, SpacePage} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components';
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
  const {agoraStageModeStore, userDevicesStore, agoraScreenShareStore} = agoraStore;
  const {streamChatStore, spaceStore, screenShareStore} = collaborationStore;
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
  }, [agoraStageModeStore, showSuccessStageModeRequestSubmissionToast, t]);

  if (!spaceStore) {
    return null;
  }

  return (
    <SpacePage dataTestId="StageModeGuest-test">
      <SpaceTopBar
        title={spaceStore.name ?? ''}
        subtitle={t('labels.stageMode')}
        isSpaceFavorite={favoriteStore.isFavorite(spaceStore.id || '')}
        isAdmin={spaceStore.isAdmin}
        spaceId={spaceStore.id}
        isChatOpen={streamChatStore.isOpen}
        toggleChat={streamChatStore.textChatDialog.toggle}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
        onLeave={onLeaveMeeting}
      >
        <styled.Actions>
          <styled.Spacer />
          {agoraStore.isStageMode && <StageModeStats />}
          {agoraStore.isStageMode &&
            agoraStageModeStore.canEnterStage &&
            !agoraStageModeStore.requestWasMadeToGoOnStage && (
              <Button
                label={t('actions.goOnStage')}
                variant="primary"
                onClick={handleUserRequest}
              />
            )}
          {agoraStore.isStageMode && agoraStageModeStore.isOnStage && (
            <Button
              label={t('actions.leaveStage')}
              variant="danger"
              onClick={async () => {
                await Promise.all([userDevicesStore.mute(), userDevicesStore.turnOffCamera()]);

                await agoraStageModeStore.leaveStage(userDevicesStore.cleanupLocalTracks);

                if (sessionStore.userId === screenShareStore.screenOwnerId) {
                  agoraScreenShareStore.stopScreenSharing();
                }
              }}
            />
          )}
          {agoraStore.isStageMode && agoraStageModeStore.requestWasMadeToGoOnStage && (
            <Text text={t('messages.pendingRequestToGoOnStage')} size="m" />
          )}
          {agoraStore.isStageMode && agoraStageModeStore.isStageFull && (
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
        {streamChatStore.isOpen && streamChatStore.client && streamChatStore.currentChannel && (
          <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
        )}
      </styled.Body>
    </SpacePage>
  );
};

export default observer(StageModeGuest);
