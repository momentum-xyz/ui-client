import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {useStore, usePosBusEvent} from 'shared/hooks';
import {ToastContent, Button, SpaceTopBar, Text, Stage} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {
  StageModePopupQueue,
  StageModeStats
} from 'scenes/collaboration/pages/StageModePage/components';

import * as styled from './StageModeGuest.styled';

const StageModeGuest: React.FC = () => {
  const {mainStore, collaborationStore, sessionStore} = useStore();
  const {agoraStore, favoriteStore} = mainStore;
  const {agoraStageModeStore} = agoraStore;
  const {addAwaitingPermissionPopup, removeAwaitingPermissionPopup} =
    collaborationStore.stageModeStore;

  const {t} = useTranslation();
  const history = useHistory();

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

  if (!collaborationStore.space) {
    return null;
  }

  return (
    <styled.Container>
      <SpaceTopBar
        title={collaborationStore.space.name ?? ''}
        subtitle={t('labels.stageMode')}
        isSpaceFavorite={favoriteStore.isSpaceFavorite}
        isChatOpen={agoraStore.isChatOpen}
        toggleChat={agoraStore.toggleChat}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        onClose={() => history.push(ROUTES.base)}
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
      </styled.Body>
    </styled.Container>
  );
};

export default observer(StageModeGuest);
