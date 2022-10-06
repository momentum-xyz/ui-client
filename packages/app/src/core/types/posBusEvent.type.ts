import {PosBusEmojiMessageType, PosBusGatheringMessageType} from 'core/types';
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
  'start-fly-with-me': (spaceId: string, pilotId: string) => void;
  'stop-fly-with-me': (spaceId: string, pilotId: string) => void;
  'simple-notification': (message: string) => void;
  'space-invite': (
    spaceId: string,
    invitorId: string,
    invitorName: string,
    uiTypeId: string,
    uiTypeName: string
  ) => void;
};
