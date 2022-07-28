import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import StageModeStage from 'component/atoms/StageMode/StageModeStage';
import StageModePopupQueueComponent from 'component/layout/StageMode/StageModePopupQueueComponent';
import {useStageModePopupQueueContext} from 'context/StageMode/StageModePopupQueueContext';
import {ParticipantRole} from 'core/enums';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {ToastContent, Button, SpaceTopBar, Text} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {StageModeStats} from 'scenes/collaboration/pages/StageModePage/components/atoms';

import * as styled from './StageModeGuest.styled';

const StageModeGuest: React.FC = () => {
  const [stageStats, setStageStats] = useState<{speakers: number; audience: number}>({
    speakers: 0,
    audience: 0
  });
  const {mainStore, collaborationStore, sessionStore} = useStore();
  const {agoraStore, favoriteStore} = mainStore;
  const [requestMade, setRequestMade] = useState<boolean>();
  const {addAwaitingPermissionPopup, removeAwaitingPermissionPopup} =
    useStageModePopupQueueContext();

  const {t} = useTranslation();
  const history = useHistory();

  usePosBusEvent('stage-mode-accepted', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      setRequestMade(false);
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      setRequestMade(false);
    }
  });

  const showSuccessStageModeRequestSubmissionToast = useCallback(() => {
    addAwaitingPermissionPopup();
  }, [addAwaitingPermissionPopup]);

  const handleUserRequest = useCallback(async () => {
    try {
      await agoraStore.requestToGoOnStage();
      showSuccessStageModeRequestSubmissionToast();
      setRequestMade(true);
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
      setRequestMade(false);
    }
  }, [agoraStore, showSuccessStageModeRequestSubmissionToast, t]);

  useEffect(() => {
    const audience = agoraStore.stageModeUsers.filter((user) => {
      return user.role === ParticipantRole.AUDIENCE_MEMBER;
    });

    const speakers = agoraStore.stageModeUsers.filter((user) => {
      return user.role === ParticipantRole.SPEAKER;
    });

    setStageStats({
      speakers: agoraStore.isOnStage ? speakers.length + 1 : speakers.length,
      audience: agoraStore.isOnStage ? audience.length - 1 : audience.length
    });
  }, [agoraStore.stageModeUsers, agoraStore.isOnStage]);

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
          {agoraStore.isStageMode && (
            <StageModeStats speakers={stageStats.speakers} audience={stageStats.audience} />
          )}

          {agoraStore.isStageMode && !requestMade && (
            <Button
              label={agoraStore.isOnStage ? t('actions.leaveStage') : t('actions.goOnStage')}
              variant={agoraStore.isOnStage ? 'danger' : 'primary'}
              onClick={agoraStore.isOnStage ? agoraStore.leaveStage : handleUserRequest}
            />
          )}
          {agoraStore.isStageMode && requestMade && (
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
