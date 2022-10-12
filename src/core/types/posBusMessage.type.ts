import {BroadcastStatusEnum, PosBusStatusEnum} from 'core/enums';
import {
  IntegrationType,
  StageModeKickType,
  StageModeLeftType,
  StageModeMuteType,
  StageModeAdmitType,
  StageModeInviteType,
  StageModeJoinedType,
  StageModeRequestType,
  StageModeStateMessageType,
  StageModeDeclineInviteType
} from 'core/types';

export type PosBusMessageStatusType = {
  status: PosBusStatusEnum;
};

export type PosBusCollaborationMessageType = {
  integrationType: IntegrationType;
  spaceId: string;
};

export type PosBusGatheringMessageType = {
  spaceId: string;
  name: string;
  start: Date;
};

export type PosBusScreenShareMessageType = {
  spaceId: string;
};

export type PosBusVibeMessageType = {
  count: number;
  type: '-1' | '+1';
};

export type PosBusInviteMessageType = {
  spaceId: string;
  sender: {
    id: string;
    name: string;
  };
  uiTypeId: string;
  uiTypeName: string;
};

export type PosBusBroadcastMessageType = {
  url: string;
  youtubeUrl: string;
  spaceId: string;
  spaceName: string;
  broadcastStatus: BroadcastStatusEnum;
  users: string[];
};

export type PosBusHigh5MessageType = {
  senderId: string;
  receiverId: string;
  message: string;
};

export type PosBusEmojiMessageType = {
  targetType: number;
  targetID: string;
  urlAvatar: string;
  nickname: string;
  url: string;
  emojiID: string;
};

export type PosBusMegamojiMessageType = {
  targetType: number;
  url: string;
};

export type PosBusCommunicationKickType = {
  action: 'kick';
  spaceId: string;
};

export type PosBusCommunicationMuteType = {
  action: 'mute';
};

export type PosBusCommunicationMuteAllType = {
  action: 'mute-all';
  moderatorId: string;
};

export type PosBusCommunicationMessageType =
  | PosBusCommunicationKickType
  | PosBusCommunicationMuteType
  | PosBusCommunicationMuteAllType;

export type PosBusStageModeMessageType =
  | StageModeStateMessageType
  | StageModeRequestType
  | StageModeAdmitType
  | StageModeInviteType
  | StageModeDeclineInviteType
  | StageModeJoinedType
  | StageModeLeftType
  | StageModeKickType
  | StageModeMuteType;
