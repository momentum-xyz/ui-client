import {toast} from 'react-toastify';
import React, {useState} from 'react';
import {t} from 'i18next';

import {UnityService} from 'shared/services';
import {PosBusEventEmitter} from 'core/constants';
import {ToastContent, TOAST_BASE_OPTIONS} from 'ui-kit';
import {PosBusGatheringMessageType, CollaborationMessageType} from 'core/types';
import {PosBusEventEnum, PosBusNotificationEnum, StageModeStatusEnum} from 'core/enums';
import {
  BroadcastMessage,
  CommunicationMessage,
  High5Message,
  InviteMessage,
  StageModeMessage,
  VibeMessage,
  PosBusMessage
} from 'context/Unity/types';

class PosBusService {
  static sendHighFive(receiverId: string) {
    try {
      UnityService.triggerInteractionMsg?.(PosBusEventEnum.HighFive, receiverId, 0, '');
    } catch (error) {
      console.error(error);
    }
  }

  static handleIncomingVibe(message: VibeMessage) {
    const {count, type} = message;
    PosBusEventEmitter.emit('user-vibed', type, count);
  }

  static handleIncomingInvite(message: InviteMessage) {
    const {spaceId, sender, uiTypeId, uiTypeName} = message;
    PosBusEventEmitter.emit('space-invite', spaceId, sender.id, sender.name, uiTypeId, uiTypeName);
  }

  static handleIncomingCollaboration(message: CollaborationMessageType) {
    const {integrationType, spaceId} = message;
    switch (integrationType) {
      case 'miro':
        PosBusEventEmitter.emit('miro-board-change', spaceId);
        break;
      case 'google_drive':
        PosBusEventEmitter.emit('google-drive-file-change', spaceId);
        break;
      default:
    }
  }

  static handleIncomingBroadcast(message: BroadcastMessage) {
    PosBusEventEmitter.emit('broadcast', message);
  }

  static handleIncomingCommunication(message: CommunicationMessage) {
    switch (message.action) {
      case 'kick':
        PosBusEventEmitter.emit('meeting-kick', message.spaceId);
        break;
      case 'mute':
        PosBusEventEmitter.emit('meeting-mute');
        break;
      case 'mute-all':
        PosBusEventEmitter.emit('meeting-mute-all', message.moderatorId);
        break;
      default:
    }
  }

  static handleIncomingStageMode(message: StageModeMessage) {
    switch (message.action) {
      case 'state':
        // eslint-disable-next-line no-case-declarations
        const parsedStatus = Number(message.value) === 0 ? 'stopped' : 'initiated';
        PosBusEventEmitter.emit('stage-mode-toggled', parsedStatus as StageModeStatusEnum);
        break;
      case 'request':
        PosBusEventEmitter.emit('stage-mode-request', message.userId);
        break;
      case 'accept-request':
        // eslint-disable-next-line no-case-declarations
        const eventName = message.value === 1 ? 'stage-mode-accepted' : 'stage-mode-declined';
        PosBusEventEmitter.emit(eventName, message.userId);
        break;
      case 'invite':
        // TODO: pass message.invitor
        PosBusEventEmitter.emit('stage-mode-invite');
        break;
      case 'joined-stage':
        PosBusEventEmitter.emit('stage-mode-user-joined', message.userId);
        break;
      case 'left-stage':
        PosBusEventEmitter.emit('stage-mode-user-left', message.userId);
        break;
      case 'kick':
        PosBusEventEmitter.emit('stage-mode-kick', message.userId);
        break;
      case 'mute':
        PosBusEventEmitter.emit('stage-mode-mute');
        break;
      default:
    }
  }

  static handleIncomingHigh5(message: High5Message) {
    const Content: React.FC = () => {
      const [clicked, setClicked] = useState(false);

      const handleClick = () => {
        if (clicked) {
          return;
        }

        setClicked(true);
        setTimeout(() => {
          this.sendHighFive(message.senderId);
          UnityService.lookAtWisp(message.senderId);
        }, 500);
      };

      return (
        <ToastContent
          headerIconName="hand"
          text={t('messages.returnHighFive')}
          title={message.message}
          approveInfo={{title: t('titles.returnHighFive'), onClick: handleClick}}
        />
      );
    };

    toast.info(<Content />, TOAST_BASE_OPTIONS);
  }

  static handleNotifyGathering(message: PosBusGatheringMessageType) {
    PosBusEventEmitter.emit('notify-gathering-start', message);
  }

  static handlePosBusMessage(message: PosBusMessage) {
    switch (message.status) {
      case 'connected':
        PosBusEventEmitter.emit('posbus-connected');
        break;
      case 'disconnected':
        PosBusEventEmitter.emit('posbus-disconnected');
        break;
      default:
        console.warn('Unknown posbus status', message.status);
    }
  }

  static handleRelayMessage(target: string, message: any): void {
    console.log('[unity message]:', target, message);

    switch (target) {
      case 'vibe':
        this.handleIncomingVibe(message as VibeMessage);
        break;
      case 'invite':
        this.handleIncomingInvite(message as InviteMessage);
        break;
      case 'collaboration':
        this.handleIncomingCollaboration(message as CollaborationMessageType);
        break;
      case 'meeting':
        this.handleIncomingCommunication(message as CommunicationMessage);
        break;
      case 'broadcast':
        this.handleIncomingBroadcast(message as BroadcastMessage);
        break;
      case 'stage':
        this.handleIncomingStageMode(message as StageModeMessage);
        break;
      case 'high5':
        this.handleIncomingHigh5(message as High5Message);
        break;
      case 'event':
        this.handleNotifyGathering(message as PosBusGatheringMessageType);
        break;
      case 'posbus':
        this.handlePosBusMessage(message as PosBusMessage);
        break;
      default:
        console.debug('Unknown relay message type', target);
    }
  }

  static handleSimpleNotification(kind: PosBusNotificationEnum, flag: number, message: string) {
    console.log('[unity simple message]:', kind, flag, message);

    // Example call: 500 0 "High five sent!"
    if (kind === PosBusNotificationEnum.TextMessage) {
      toast.info(
        <ToastContent
          headerIconName="check"
          title={t('titles.alert')}
          text={message}
          isCloseButton
        />
      );
    }
  }
}

export default PosBusService;
