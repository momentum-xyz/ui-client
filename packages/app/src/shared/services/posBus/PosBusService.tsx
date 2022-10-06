import {PosBusEventEmitter} from 'core/constants';
import {PosBusNotificationEnum, StageModeStatusEnum} from 'core/enums';
import {
  PosBusVibeMessageType,
  PosBusHigh5MessageType,
  PosBusMessageStatusType,
  PosBusInviteMessageType,
  PosBusBroadcastMessageType,
  PosBusGatheringMessageType,
  PosBusStageModeMessageType,
  PosBusCollaborationMessageType,
  PosBusCommunicationMessageType,
  PosBusEmojiMessageType,
  PosBusMegamojiMessageType,
  PosBusFlyWithMeType
} from 'core/types';

class PosBusService {
  static handleIncomingVibe(message: PosBusVibeMessageType) {
    const {count, type} = message;
    PosBusEventEmitter.emit('user-vibed', type, count);
  }

  static handleIncomingInvite(message: PosBusInviteMessageType) {
    const {spaceId, sender, uiTypeId, uiTypeName} = message;
    PosBusEventEmitter.emit('space-invite', spaceId, sender.id, sender.name, uiTypeId, uiTypeName);
  }

  static handleIncomingCollaboration(message: PosBusCollaborationMessageType) {
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

  static handleIncomingBroadcast(message: PosBusBroadcastMessageType) {
    PosBusEventEmitter.emit('broadcast', message);
  }

  static handleIncomingCommunication(message: PosBusCommunicationMessageType) {
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

  static handleIncomingStageMode(message: PosBusStageModeMessageType) {
    switch (message.action) {
      case 'state':
        PosBusEventEmitter.emit(
          'stage-mode-toggled',
          message.value === '0' ? StageModeStatusEnum.STOPPED : StageModeStatusEnum.INITIATED
        );
        break;
      case 'request':
        PosBusEventEmitter.emit('stage-mode-request', message.userId);
        break;
      case 'accept-request':
        PosBusEventEmitter.emit(
          message.value === 1 ? 'stage-mode-accepted' : 'stage-mode-declined',
          message.userId
        );
        break;
      case 'invite':
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
    }
  }

  static handleIncomingHigh5(message: PosBusHigh5MessageType) {
    PosBusEventEmitter.emit('high-five', message.senderId, message.message);
  }

  static handleIncomingEmoji(message: PosBusEmojiMessageType) {
    PosBusEventEmitter.emit('emoji', message);
  }

  static handleIncomingMegamoji(message: PosBusMegamojiMessageType) {
    PosBusEventEmitter.emit('megamoji', message.url);
  }

  static handleNotifyGathering(message: PosBusGatheringMessageType) {
    PosBusEventEmitter.emit('notify-gathering-start', message);
  }

  static handlePosBusMessage(message: PosBusMessageStatusType) {
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

  static handleStartFlyWithMeMessage(message: PosBusFlyWithMeType) {
    PosBusEventEmitter.emit('start-fly-with-me', message.spaceId, message.pilotId);
  }

  static handleStopFlyWithMeMessage(message: PosBusFlyWithMeType) {
    PosBusEventEmitter.emit('stop-fly-with-me', message.spaceId, message.pilotId);
  }

  static handleRelayMessage(target: string, message: any): void {
    console.log('[unity message]:', target, message);
    switch (target) {
      case 'collaboration':
        this.handleIncomingCollaboration(message as PosBusCollaborationMessageType);
        break;
      case 'event':
        this.handleNotifyGathering(message as PosBusGatheringMessageType);
        break;
      case 'vibe':
        this.handleIncomingVibe(message as PosBusVibeMessageType);
        break;
      case 'invite':
        this.handleIncomingInvite(message as PosBusInviteMessageType);
        break;
      case 'meeting':
        this.handleIncomingCommunication(message as PosBusCommunicationMessageType);
        break;
      case 'broadcast':
        this.handleIncomingBroadcast(message as PosBusBroadcastMessageType);
        break;
      case 'stage':
        this.handleIncomingStageMode(message as PosBusStageModeMessageType);
        break;
      case 'high5':
        this.handleIncomingHigh5(message as PosBusHigh5MessageType);
        break;
      case 'emoji':
        this.handleIncomingEmoji(message as PosBusEmojiMessageType);
        break;
      case 'megamoji':
        this.handleIncomingMegamoji(message as PosBusMegamojiMessageType);
        break;
      case 'posbus':
        this.handlePosBusMessage(message as PosBusMessageStatusType);
        break;
      case 'start-fly-with-me':
        this.handleStartFlyWithMeMessage(message as PosBusFlyWithMeType);
        break;
      case 'stop-fly-with-me':
        this.handleStopFlyWithMeMessage(message as PosBusFlyWithMeType);
        break;
      default:
        console.debug('Unknown relay message type', target);
    }
  }

  static handleSimpleNotification(kind: PosBusNotificationEnum, flag: number, message: string) {
    console.log('[unity simple message]:', kind, flag, message);
    if (kind === PosBusNotificationEnum.TextMessage) {
      PosBusEventEmitter.emit('simple-notification', message);
    } else if (kind === PosBusNotificationEnum.HighFive) {
      PosBusEventEmitter.emit('high-five-sent', message);
    }
  }
}

export default PosBusService;
