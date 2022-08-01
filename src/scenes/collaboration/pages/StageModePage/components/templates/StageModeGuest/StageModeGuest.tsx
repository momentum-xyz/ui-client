import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import StageModePopupQueueComponent from 'component/layout/StageMode/StageModePopupQueueComponent';
import {useStageModePopupQueueContext} from 'context/StageMode/StageModePopupQueueContext';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {ToastContent, Button, SpaceTopBar, Text} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {StageModeStats, Stage} from 'scenes/collaboration/pages/StageModePage/components';

import * as styled from './StageModeGuest.styled';

const StageModeGuest: React.FC = () => {
  const {mainStore, collaborationStore, sessionStore} = useStore();
  const {agoraStore, favoriteStore} = mainStore;
  const {stageModeStore} = agoraStore;
  const {addAwaitingPermissionPopup, removeAwaitingPermissionPopup} =
    useStageModePopupQueueContext();

  const {t} = useTranslation();
  const history = useHistory();

  usePosBusEvent('stage-mode-accepted', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      stageModeStore.requestToGoOnstageWasHandled();
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      stageModeStore.requestToGoOnstageWasHandled();
    }
  });

  const showSuccessStageModeRequestSubmissionToast = useCallback(() => {
    addAwaitingPermissionPopup();
  }, [addAwaitingPermissionPopup]);

  const handleUserRequest = useCallback(async () => {
    try {
      await stageModeStore.requestToGoOnStage();
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
        isChatOpen={false}
        toggleChat={agoraStore.toggleChat}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        onClose={() => history.push(ROUTES.base)}
      >
        <styled.Actions>
          {agoraStore.isStageMode && <StageModeStats />}

          {agoraStore.isStageMode && !stageModeStore.requestWasMadeToGoOnStage && (
            <Button
              label={stageModeStore.isOnStage ? t('actions.leaveStage') : t('actions.goOnStage')}
              variant={stageModeStore.isOnStage ? 'danger' : 'primary'}
              onClick={stageModeStore.isOnStage ? stageModeStore.leaveStage : handleUserRequest}
            />
          )}
          {agoraStore.isStageMode && stageModeStore.requestWasMadeToGoOnStage && (
            <Text text={t('messages.pendingRequestToGoOnStage')} size="m" />
          )}
          {agoraStore.isStageMode && !stageModeStore.canEnterStage && (
            <Text text={t('messages.stageIsFull')} size="m" />
          )}
        </styled.Actions>
      </SpaceTopBar>
      <styled.Body>
        <styled.PopupQueueWrapper>
          <StageModePopupQueueComponent />
        </styled.PopupQueueWrapper>
        <styled.StageModeContainer>
          {agoraStore.isStageMode ? (
            <Stage />
          ) : (
            <styled.StageModeMessageText
              text={t('messages.stageModeNotActive')}
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
