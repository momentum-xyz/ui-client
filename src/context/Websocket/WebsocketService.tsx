import {toast} from 'react-toastify';
import React, {useState} from 'react';
import {t} from 'i18next';

import {EventEmitter} from 'core/utils';
import {
  BroadcastMessage,
  CollaborationMessage,
  CommunicationMessage,
  High5Message,
  InviteMessage,
  NotifyMessage,
  StageModeMessage,
  VibeMessage,
  PosBusMessage
} from 'context/Unity/types';
import {ToastContent, TOAST_BASE_OPTIONS} from 'ui-kit';

import {InteractionTypes} from '../type/Notification';
import UnityService, {PosBusInteractionType, PosBusNotificationType} from '../Unity/UnityService';
import {StageModeStatus} from '../type/StageMode';

import {CollaborationTypes, NotificationTypes} from './WebsocketTypes';

export type WebsocketEvents = {
  connected: () => void;
  connectionFailed: () => void;
  notification: (type: NotificationTypes, message: string) => void;
  'notify-gathering-start': (message: NotifyMessage) => void;
  interaction: (type: InteractionTypes, senderId: string, message: string) => void;
  collaboration: (type: CollaborationTypes, channel: string, receiverId: string) => void;
  'miro-board-change': (id: string) => void;
  'google-drive-file-change': (id: string) => void;
  broadcast: (broadcast: any) => void;
  'meeting-kick': (spaceId: string) => void;
  'meeting-mute': () => void;
  'meeting-mute-all': (moderatorId: string) => void;
  'stage-mode-toggled': (
    stageModeStatus: StageModeStatus.INITIATED | StageModeStatus.STOPPED
  ) => void;
  'stage-mode-request': (userId: string) => void;
  'stage-mode-invite': () => void;
  'stage-mode-kick': (userId: string) => void;
  'stage-mode-mute': () => void;
  'stage-mode-accepted': (userId: string) => void;
  'stage-mode-declined': (userId: string) => void;
  'stage-mode-user-joined': (userId: string) => void;
  'stage-mode-user-left': (userId: string) => void;
  'user-wowed': (spaceId: string, count: number) => void;
  'user-vibed': (type: string, count: number) => void;
  'posbus-connected': () => void;
  'posbus-disconnected': () => void;
  'space-invite': (
    spaceId: string,
    invitorId: string,
    invitorName: string,
    uiTypeId: string,
    uiTypeName: string
  ) => void;
};

export const WebsocketEventEmitter = new EventEmitter<WebsocketEvents>();

// TODO: refactor into proper unity hook :)
class WebsocketService {
  async initialize() {
    console.debug('INITIALIZE Unity relay message handling.');
    // since this isn't a react hook, we can't easily inject UnityService context.
    UnityService.relayMessageHandler((target: string, message: any) =>
      this.handleRelayMessage(target, message)
    );
    UnityService.simpleNotificationHandler(
      (kind: PosBusNotificationType, flag: number, message: string) => {
        console.debug('React simple notification', kind, flag, message);
        this.handleSimpleNotification(kind, flag, message);
      }
    );

    try {
      WebsocketEventEmitter.emit('connected'); // check if there are used any where.
    } catch (e) {
      console.info('Could not connect to broker');
      console.error(e);
      WebsocketEventEmitter.emit('connectionFailed');
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  handleGlobalInteraction(topic, message) {
    const [, senderId, type] = topic.split('/');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    WebsocketEventEmitter.emit('interaction', type, senderId, message);
  }

  handleHighFiveReceived(senderId: string, message: string) {
    console.info(`Is a high five indeed! sender="${senderId}" message="${message}"`);

    const Content: React.FC = () => {
      const [clicked, setClicked] = useState(false);

      const handleClick = () => {
        if (clicked) {
          return;
        }

        setClicked(true);
        setTimeout(() => {
          this.sendHighFive(senderId).then();
          UnityService.lookAtWisp(senderId);
        }, 500);
      };

      return (
        <ToastContent
          headerIconName="hand"
          text={t('messages.highFiveReceivedText')}
          title={t('messages.highFiveReceivedTitle', {
            name: message
          })}
          approveInfo={{title: t('titles.returnHighFive'), onClick: handleClick}}
        />
      );
    };

    toast.info(<Content />, TOAST_BASE_OPTIONS);
  }

  async sendHighFive(receiverId: string) {
    try {
      UnityService.triggerInteractionMsg?.(PosBusInteractionType.HighFive, receiverId, 0, '');
      // const topic = 'users/' + this.userId + '/action';
      // this.client?.publish(topic, JSON.stringify({type: InteractionTypes.HIGHFIVE, receiverId}), {
      //   qos: 1
      // });

      // return topic;
    } catch (error) {
      console.error(error);
    }
  }

  async sendWow(receiver_id: string) {
    try {
      UnityService.triggerInteractionMsg?.(PosBusInteractionType.Wow, receiver_id, 0, '');
      // const topic = 'interactions/' + this.userId + '/' + receiver_id + '/' + InteractionTypes.WOW;

      // this.client?.publish(topic, '', {qos: 1});
    } catch (error) {
      console.error(error);
    }
  }

  handleIncomingVibe(message: VibeMessage) {
    const {count, type} = message;
    WebsocketEventEmitter.emit('user-vibed', type, count);
  }

  handleIncomingInvite(message: InviteMessage) {
    const {spaceId, sender, uiTypeId, uiTypeName} = message;
    WebsocketEventEmitter.emit(
      'space-invite',
      spaceId,
      sender.id,
      sender.name,
      uiTypeId,
      uiTypeName
    );
  }

  handleIncomingCollaboration(message: CollaborationMessage) {
    const {integrationType, spaceId} = message;
    switch (integrationType) {
      case 'miro':
        WebsocketEventEmitter.emit('miro-board-change', spaceId);
        break;
      case 'google_drive':
        WebsocketEventEmitter.emit('google-drive-file-change', spaceId);
        break;
      default:
    }
  }

  handleIncomingBroadcast(message: BroadcastMessage) {
    WebsocketEventEmitter.emit('broadcast', message);
  }

  handleIncomingCommunication(message: CommunicationMessage) {
    switch (message.action) {
      case 'kick':
        WebsocketEventEmitter.emit('meeting-kick', message.spaceId);
        break;
      case 'mute':
        WebsocketEventEmitter.emit('meeting-mute');
        break;
      case 'mute-all':
        WebsocketEventEmitter.emit('meeting-mute-all', message.moderatorId);
        break;
      default:
    }
  }

  handleIncomingStageMode(message: StageModeMessage) {
    switch (message.action) {
      case 'state':
        // eslint-disable-next-line no-case-declarations
        const parsedStatus = Number(message.value) === 0 ? 'stopped' : 'initiated';
        WebsocketEventEmitter.emit('stage-mode-toggled', parsedStatus as StageModeStatus);
        break;
      case 'request':
        WebsocketEventEmitter.emit('stage-mode-request', message.userId);
        break;
      case 'accept-request':
        // eslint-disable-next-line no-case-declarations
        const eventName = message.value === 1 ? 'stage-mode-accepted' : 'stage-mode-declined';
        WebsocketEventEmitter.emit(eventName, message.userId);
        break;
      case 'invite':
        // TODO: pass message.invitor
        WebsocketEventEmitter.emit('stage-mode-invite');
        break;
      case 'joined-stage':
        WebsocketEventEmitter.emit('stage-mode-user-joined', message.userId);
        break;
      case 'left-stage':
        WebsocketEventEmitter.emit('stage-mode-user-left', message.userId);
        break;
      case 'kick':
        WebsocketEventEmitter.emit('stage-mode-kick', message.userId);
        break;
      case 'mute':
        WebsocketEventEmitter.emit('stage-mode-mute');
        break;
      default:
    }
  }

  handleIncomingHigh5(message: High5Message) {
    this.handleHighFiveReceived(message.senderId, message.message);
  }

  handleNotifyGathering(message: NotifyMessage) {
    WebsocketEventEmitter.emit('notify-gathering-start', message);
  }

  handleRelayMessage(target: string, message: any): void {
    console.debug('unity-relay:', target, message);
    // WARNING: hack: bridging new controller unity message to old legacy mqtt code.
    switch (target) {
      case 'vibe':
        this.handleIncomingVibe(message as VibeMessage);
        break;
      case 'invite':
        this.handleIncomingInvite(message as InviteMessage);
        break;
      case 'collaboration':
        this.handleIncomingCollaboration(message as CollaborationMessage);
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
        this.handleNotifyGathering(message as NotifyMessage);
        break;
      case 'posbus':
        this.handlePosBusMessage(message as PosBusMessage);
        break;
      default:
        console.debug('Unknown relay message type', target);
    }
  }

  handlePosBusMessage(message: PosBusMessage) {
    switch (message.status) {
      case 'connected':
        WebsocketEventEmitter.emit('posbus-connected');
        break;
      case 'disconnected':
        WebsocketEventEmitter.emit('posbus-disconnected');
        break;
      default:
        console.warn('Unknown posbus status', message.status);
    }
  }

  handleSimpleNotification(kind: PosBusNotificationType, flag: number, message: string) {
    // Example call: 500 0 "High five sent!"
    if (kind === PosBusNotificationType.TextMessage) {
      // move markup to proper component.

      toast.info(
        <ToastContent
          headerIconName="check"
          title={t('titles.alert')}
          text={message}
          isCloseButton
        />
      );
    } else if (kind === PosBusNotificationType.HighFive) {
      toast.info(
        <ToastContent
          headerIconName="check"
          title={t('messages.highFiveSentTitle', {
            name: message
          })}
          text={t('messages.highFiveSentText')}
          isCloseButton
        />
      );
    }
  }
}

export default new WebsocketService();
