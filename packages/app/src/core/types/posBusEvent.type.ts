import {AttributeValueInterface} from '@momentum-xyz/sdk';

// import {
//   PosBusEmojiMessageType,
//   PosBusGatheringMessageType,
//   PosBusScreenShareMessageType
// } from 'core/types';
import {
  // PosBusCollaborationEnum,
  PosBusMessageStatusEnum
} from 'core/enums';

export type PosBusEventType = {
  'posbus-connected': () => void;
  'posbus-disconnected': () => void;
  'posbus-duplicated-sessions': () => void;
  notification: (type: PosBusMessageStatusEnum, message: string) => void;
  // collaboration: (type: PosBusCollaborationEnum, channel: string, receiverId: string) => void;
  // broadcast: (broadcast: any) => void;
  // 'notify-gathering-start': (message: PosBusGatheringMessageType) => void;
  // 'meeting-kick': (spaceId: string) => void;
  // 'meeting-mute': () => void;
  // 'meeting-mute-all': (moderatorId: string) => void;
  // 'stage-mode-toggled': (stageModeStatus: any) => void;
  // 'stage-mode-request': (userId: string) => void;
  // 'stage-mode-invite': () => void;
  // 'stage-mode-kick': (userId: string) => void;
  // 'stage-mode-mute': () => void;
  // 'stage-mode-accepted': (userId: string) => void;
  // 'stage-mode-declined': (userId: string) => void;
  // 'stage-mode-user-joined': (userId: string) => void;
  // 'stage-mode-user-left': (userId: string) => void;
  // 'user-wowed': (spaceId: string, count: number) => void;
  // 'user-vibed': (type: string, count: number) => void;
  'high-five': (senderId: string, message: string) => void;
  'high-five-sent': (message: string) => void;
  // emoji: (message: PosBusEmojiMessageType) => void;
  // megamoji: (emojiUrl: string) => void;
  // 'fly-to-me': (spaceId: string, pilotId: string, pilotName: string) => void;
  // 'start-fly-with-me': (spaceId: string, pilotId: string, pilotName: string) => void;
  // 'stop-fly-with-me': (spaceId: string, pilotId: string, pilotName: string) => void;
  // 'simple-notification': (message: string) => void;
  // 'screen-share': (message: PosBusScreenShareMessageType) => void;
  'voice-chat-kick-user': (userId: string) => void;
  'voice-chat-mute-user': (userId: string) => void;
  'voice-chat-mute-all': (initiatorId: string) => void;
  'voice-chat-user-joined': (userId: string) => void;
  'voice-chat-user-left': (userId: string) => void;
  // 'space-invite': (
  //   spaceId: string,
  //   invitorId: string,
  //   invitorName: string,
  //   uiTypeId: string,
  //   uiTypeName: string
  // ) => void;
  'attribute-value-changed': <T extends AttributeValueInterface>(props: {
    attribute_name: string;
    change_type: string;
    plugin_id: string;
    target_id: string;
    value?: T;
  }) => void;
  'space-attribute-changed': <T extends AttributeValueInterface>(
    topic: string,
    attributeName: string,
    value: T
  ) => void;
  'space-attribute-removed': (topic: string, attributeName: string) => void;
  'space-attribute-item-changed': (
    topic: string,
    attributeName: string,
    attributeItemName: string,
    value: unknown
  ) => void;
  'space-attribute-item-removed': (
    topic: string,
    attributeName: string,
    attributeItemName: string
  ) => void;
};
