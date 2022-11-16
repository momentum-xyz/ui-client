import {AttributeValueInterface} from '@momentum-xyz/sdk';

import {
  PosBusEmojiMessageType,
  PosBusGatheringMessageType,
  PosBusScreenShareMessageType
} from 'core/types';
import {PosBusCollaborationEnum, PosBusMessageStatusEnum, StageModeStatusEnum} from 'core/enums';

export type PosBusEventType = {
  'posbus-connected': () => void;
  'posbus-disconnected': () => void;
  notification: (type: PosBusMessageStatusEnum, message: string) => void;
  collaboration: (type: PosBusCollaborationEnum, channel: string, receiverId: string) => void;
  broadcast: (broadcast: any) => void;
  'notify-gathering-start': (message: PosBusGatheringMessageType) => void;
  'miro-board-change': (id: string) => void;
  'google-drive-file-change': (id: string) => void;
  'meeting-kick': (spaceId: string) => void;
  'meeting-mute': () => void;
  'meeting-mute-all': (moderatorId: string) => void;
  'stage-mode-toggled': (stageModeStatus: StageModeStatusEnum) => void;
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
  'high-five': (senderId: string, message: string) => void;
  'high-five-sent': (message: string) => void;
  emoji: (message: PosBusEmojiMessageType) => void;
  megamoji: (emojiUrl: string) => void;
  'start-fly-with-me': (spaceId: string, pilotId: string, pilotName: string) => void;
  'stop-fly-with-me': (spaceId: string, pilotId: string, pilotName: string) => void;
  'simple-notification': (message: string) => void;
  'screen-share': (message: PosBusScreenShareMessageType) => void;
  'space-invite': (
    spaceId: string,
    invitorId: string,
    invitorName: string,
    uiTypeId: string,
    uiTypeName: string
  ) => void;
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
