import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import StageModeStage from 'component/atoms/StageMode/StageModeStage';
import StageModePopupQueueComponent from 'component/layout/StageMode/StageModePopupQueueComponent';
import {useStageModePopupQueueContext} from 'context/StageMode/StageModePopupQueueContext';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {ToastContent, Button, SpaceTopBar, Text} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {StageModeStats} from 'scenes/collaboration/pages/StageModePage/components/atoms';

import * as styled from './StageModeGuest.styled';

const StageModeGuest: React.FC = () => {
  const {mainStore, collaborationStore, sessionStore} = useStore();
  const {agoraStore, favoriteStore} = mainStore;
  const {addAwaitingPermissionPopup, removeAwaitingPermissionPopup} =
    useStageModePopupQueueContext();

  const {t} = useTranslation();
  const history = useHistory();

  usePosBusEvent('stage-mode-accepted', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      agoraStore.requestToGoOnstageWasHandled();
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      agoraStore.requestToGoOnstageWasHandled();
    }
  });

  const showSuccessStageModeRequestSubmissionToast = useCallback(() => {
    addAwaitingPermissionPopup();
  }, [addAwaitingPermissionPopup]);

  const handleUserRequest = useCallback(async () => {
    try {
      await agoraStore.requestToGoOnStage();
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

          {agoraStore.isStageMode && !agoraStore.requestWasMadeToGoOnStage && (
            <Button
              label={agoraStore.isOnStage ? t('actions.leaveStage') : t('actions.goOnStage')}
              variant={agoraStore.isOnStage ? 'danger' : 'primary'}
              onClick={agoraStore.isOnStage ? agoraStore.leaveStage : handleUserRequest}
            />
          )}
          {agoraStore.isStageMode && agoraStore.requestWasMadeToGoOnStage && (
            <Text text={t('messages.pendingRequestToGoOnStage')} size="m" />
          )}
          {agoraStore.isStageMode && !agoraStore.canEnterStage && (
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
            <StageModeStage />
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
