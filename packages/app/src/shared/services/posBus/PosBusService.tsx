import {PosBusEventEmitter} from 'core/constants';
import {PosBusMessageTypeEnum, PosBusNotificationEnum, StageModeStatusEnum} from 'core/enums';
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
  PosBusFlyWithMeType,
  PosBusScreenShareMessageType,
  PosBusMiroStateMessageType as PosBusAttributeMessageType
} from 'core/types';

class PosBusService {
  static main = new PosBusService();

  public subscibedSpacePluginTopics: Set<string>;

  private constructor() {
    this.subscibedSpacePluginTopics = new Set();
  }

  subcribe(topic: string) {
    this.subscibedSpacePluginTopics.add(topic);
  }

  unsubscribe(topic: string) {
    this.subscibedSpacePluginTopics.delete(topic);
  }

  handleIncomingVibe(message: PosBusVibeMessageType) {
    const {count, type} = message;
    PosBusEventEmitter.emit('user-vibed', type, count);
  }

  handleIncomingInvite(message: PosBusInviteMessageType) {
    const {spaceId, sender, uiTypeId, uiTypeName} = message;
    PosBusEventEmitter.emit('space-invite', spaceId, sender.id, sender.name, uiTypeId, uiTypeName);
  }

  handleIncomingCollaboration(message: PosBusCollaborationMessageType) {
    const {integrationType, spaceId} = message;
    switch (integrationType) {
      case 'google_drive':
        PosBusEventEmitter.emit('google-drive-file-change', spaceId);
        break;
      default:
    }
  }

  handleIncomingBroadcast(message: PosBusBroadcastMessageType) {
    PosBusEventEmitter.emit('broadcast', message);
  }

  handleScreenShareStart(message: PosBusScreenShareMessageType) {
    PosBusEventEmitter.emit('screen-share', message);
  }

  handleIncomingCommunication(message: PosBusCommunicationMessageType) {
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

  handleIncomingStageMode(message: PosBusStageModeMessageType) {
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

  handleIncomingHigh5(message: PosBusHigh5MessageType) {
    PosBusEventEmitter.emit('high-five', message.senderId, message.message);
  }

  handleIncomingEmoji(message: PosBusEmojiMessageType) {
    PosBusEventEmitter.emit('emoji', message);
  }

  handleIncomingMegamoji(message: PosBusMegamojiMessageType) {
    PosBusEventEmitter.emit('megamoji', message.url);
  }

  handleNotifyGathering(message: PosBusGatheringMessageType) {
    PosBusEventEmitter.emit('notify-gathering-start', message);
  }

  handlePosBusMessage(message: PosBusMessageStatusType) {
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

  handleStartFlyWithMeMessage(message: PosBusFlyWithMeType) {
    PosBusEventEmitter.emit('start-fly-with-me', message.spaceId, message.pilot, message.pilotName);
  }

  handleStopFlyWithMeMessage(message: PosBusFlyWithMeType) {
    PosBusEventEmitter.emit('stop-fly-with-me', message.spaceId, message.pilot, message.pilotName);
  }

  handleSpaceAttributeMessaage(target: string, message: PosBusAttributeMessageType) {
    switch (message.type) {
      case PosBusMessageTypeEnum.ATTRIBUTE_CHANGED:
        PosBusEventEmitter.emit(
          'space-attribute-changed',
          target,
          message.data.attribute_name,
          message.data.sub_name,
          message.data.value
        );
        break;
      case PosBusMessageTypeEnum.ATTRIBUTE_REMOVED:
        PosBusEventEmitter.emit(
          'space-attribute-removed',
          target,
          message.data.attribute_name,
          message.data.sub_name
        );
        break;
    }
  }

  handleRelayMessage(target: string, message: unknown): void {
    console.log('[unity message]:', target, message);

    if (this.subscibedSpacePluginTopics.has(target)) {
      this.handleSpaceAttributeMessaage(target, message as PosBusAttributeMessageType);
      return;
    }

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
      case 'screen-share':
        this.handleScreenShareStart(message as PosBusScreenShareMessageType);
        break;

      default:
        console.debug('Unknown relay message type', target);
    }
  }

  handleSimpleNotification(kind: PosBusNotificationEnum, flag: number, message: string) {
    console.log('[unity simple message]:', kind, flag, message);
    if (kind === PosBusNotificationEnum.TextMessage) {
      PosBusEventEmitter.emit('simple-notification', message);
    } else if (kind === PosBusNotificationEnum.HighFive) {
      PosBusEventEmitter.emit('high-five-sent', message);
    }
  }
}

export default PosBusService;
