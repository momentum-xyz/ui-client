import React, {useRef, useState} from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {ToastContent} from 'ui-kit';

import useWebsocketEvent from '../../../context/Websocket/hooks/useWebsocketEvent';
import Modal, {ModalRef} from '../../util/Modal';
import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import StageModeInvitedOnStagePopup from '../../popup/stageMode/StageModeInvitedOnStagePopup';
import StageModePrepareOnStagePopup from '../../popup/stageMode/StageModePrepareOnStagePopup';
import {CountdownPopup} from '../../../modules/broadcastadmin/popups/CountdownPopup';
import {useAgoraStageMode} from '../../../hooks/communication/useAgoraStageMode';
import {useStageModeInvitationAcceptOrDecline} from '../../../hooks/api/useStageModeService';
import AcceptedToJoinOnStagePopup from '../../popup/stageMode/AcceptedToJoinOnStagePopup';
import DeclinedToJoinOnStagePopup from '../../popup/stageMode/DeclinedToJoinOnStagePopup';


const StageModeModalController: React.FC = () => {
  const {collaborationState} = useCollaboration();
  const {enterStage, isOnStage} = useAgoraStageMode();

  const invitedToStageModalRef = useRef<ModalRef>(null);
  const prepareToJoinStageModalRef = useRef<ModalRef>(null);
  const countdownModalRef = useRef<ModalRef>(null);
  const acceptedToJoin = useRef<ModalRef>(null);
  const declinedToJoin = useRef<ModalRef>(null);

  const [accept, decline] = useStageModeInvitationAcceptOrDecline(
    collaborationState.collaborationSpace?.id
  );
  const [accepted, setAccepted] = useState<boolean>();

  const isHandlingInviteOrRequest = () => {
    return (
      acceptedToJoin.current?.isShown === true ||
      invitedToStageModalRef.current?.isShown === true ||
      prepareToJoinStageModalRef.current?.isShown === true ||
      countdownModalRef.current?.isShown === true ||
      isOnStage
    );
  };

  useWebsocketEvent('stage-mode-invite', () => {
    if (!isHandlingInviteOrRequest()) {
      invitedToStageModalRef.current?.open();
      setAccepted(false);
    }
  });

  useWebsocketEvent('stage-mode-accepted', () => {
    if (!isHandlingInviteOrRequest()) {
      acceptedToJoin.current?.open();
      setAccepted(true);
    }
  });

  useWebsocketEvent('stage-mode-declined', () => {
    declinedToJoin.current?.open();
  });

  const handleDecline = () => {
    acceptedToJoin.current?.close();
  };

  const handleCountdownEnded = () => {
    if (!accepted) {
      accept()
        .then(enterStage)
        .catch(() => {
          toast.error(
            <ToastContent
              isDanger
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('messages.joinStageRefused')}
              isCloseButton
            />
          );
        })
        .finally(countdownModalRef.current?.close);
    } else if (accepted) {
      enterStage()
        .then(countdownModalRef.current?.close)
        .catch(() => {
          toast.error(
            <ToastContent
              isDanger
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('messages.joinStageRefused')}
              isCloseButton
            />
          );
        });
    }
  };

  const handleCountdownCanceled = () => {
    countdownModalRef.current?.close();
    prepareToJoinStageModalRef.current?.close();
  };

  const handleInviteDeclined = () => {
    decline().then(invitedToStageModalRef.current?.close);
  };

  return (
    <>
      <Modal ref={invitedToStageModalRef}>
        <StageModeInvitedOnStagePopup
          onClose={invitedToStageModalRef.current?.close}
          onGetReady={prepareToJoinStageModalRef.current?.open}
          onDecline={handleInviteDeclined}
        />
      </Modal>
      <Modal ref={prepareToJoinStageModalRef}>
        <StageModePrepareOnStagePopup
          onClose={prepareToJoinStageModalRef.current?.close}
          onReady={countdownModalRef.current?.open}
        />
      </Modal>
      <Modal ref={countdownModalRef}>
        <CountdownPopup
          title="Going On Stage"
          onSave={handleCountdownEnded}
          onClose={handleCountdownCanceled}
        />
      </Modal>
      <Modal backdrop ref={acceptedToJoin}>
        <AcceptedToJoinOnStagePopup
          onClose={acceptedToJoin.current?.close}
          onReady={prepareToJoinStageModalRef.current?.open}
          onDecline={handleDecline}
        />
      </Modal>
      <Modal backdrop ref={declinedToJoin}>
        <DeclinedToJoinOnStagePopup onClose={declinedToJoin.current?.close} />
      </Modal>
    </>
  );
};

export default StageModeModalController;
