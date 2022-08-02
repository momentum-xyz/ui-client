import React, {useCallback, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {StageModeRequestEnum} from 'core/enums';

import Modal, {ModalRef} from '../../util/Modal';
import StageModeInvitedOnStagePopup from '../../popup/stageMode/StageModeInvitedOnStagePopup';
import StageModePrepareOnStagePopup from '../../popup/stageMode/StageModePrepareOnStagePopup';
import {CountdownPopup} from '../../../modules/broadcastadmin/popups/CountdownPopup';
import AcceptedToJoinOnStagePopup from '../../popup/stageMode/AcceptedToJoinOnStagePopup';
import DeclinedToJoinOnStagePopup from '../../popup/stageMode/DeclinedToJoinOnStagePopup';

const StageModeModalController: React.FC = () => {
  const {mainStore, sessionStore} = useStore();
  const {agoraStore} = mainStore;
  const {agoraStageModeStore, userDevicesStore} = agoraStore;

  const invitedToStageModalRef = useRef<ModalRef>(null);
  const prepareToJoinStageModalRef = useRef<ModalRef>(null);
  const countdownModalRef = useRef<ModalRef>(null);
  const acceptedToJoin = useRef<ModalRef>(null);
  const declinedToJoin = useRef<ModalRef>(null);

  const [accepted, setAccepted] = useState<boolean>();

  const isHandlingInviteOrRequest = () => {
    return (
      acceptedToJoin.current?.isShown === true ||
      invitedToStageModalRef.current?.isShown === true ||
      prepareToJoinStageModalRef.current?.isShown === true ||
      countdownModalRef.current?.isShown === true ||
      agoraStageModeStore.isOnStage
    );
  };

  usePosBusEvent('stage-mode-invite', () => {
    if (!isHandlingInviteOrRequest()) {
      invitedToStageModalRef.current?.open();
      setAccepted(false);
    }
  });

  usePosBusEvent('stage-mode-accepted', (userId) => {
    if (userId === sessionStore.userId) {
      if (!isHandlingInviteOrRequest()) {
        acceptedToJoin.current?.open();
        setAccepted(true);
      }
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    //check user
    if (userId === sessionStore.userId) {
      declinedToJoin.current?.open();
    }
  });

  const handleDecline = () => {
    acceptedToJoin.current?.close();
  };

  const handleCountdownEnded = useCallback(async () => {
    if (!agoraStageModeStore.canEnterStage) {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.stageModeFull')}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
      countdownModalRef.current?.close();
      return;
    }

    if (!accepted) {
      try {
        await agoraStageModeStore.invitationRespond(StageModeRequestEnum.ACCEPT);
        await agoraStageModeStore.enterStage(userDevicesStore.createLocalTracks);
      } catch {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.joinStageRefused')}
            isCloseButton
          />
        );
      } finally {
        countdownModalRef.current?.close();
      }
    } else if (accepted) {
      try {
        await agoraStageModeStore.enterStage(userDevicesStore.createLocalTracks);
        countdownModalRef.current?.close();
      } catch {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.joinStageRefused')}
            isCloseButton
          />
        );
      }
    }
  }, [accepted, agoraStore]);

  const handleCountdownCanceled = () => {
    countdownModalRef.current?.close();
    prepareToJoinStageModalRef.current?.close();
  };

  const handleInviteDeclined = useCallback(async () => {
    await agoraStageModeStore.invitationRespond(StageModeRequestEnum.DECLINE);
    invitedToStageModalRef.current?.close();
  }, [agoraStore]);

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

export default observer(StageModeModalController);
