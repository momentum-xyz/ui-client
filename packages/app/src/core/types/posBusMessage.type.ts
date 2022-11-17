import {BroadcastStatusEnum, PosBusMessageTypeEnum, PosBusStatusEnum} from 'core/enums';
import {
  StageModeKickType,
  StageModeLeftType,
  StageModeMuteType,
  StageModeAdmitType,
  StageModeInviteType,
  StageModeJoinedType,
  StageModeRequestType,
  StageModeStateMessageType,
  StageModeDeclineInviteType,
  PosBusAttributeMessageDataType
} from 'core/types';

export type PosBusMessageStatusType = {
  status: PosBusStatusEnum;
};

export type PosBusGatheringMessageType = {
  spaceId: string;
  name: string;
  start: Date;
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

export type PosBusFlyWithMeType = {
  pilot: string;
  pilotName: string;
  spaceId: string;
};

export type PosBusScreenShareMessageType = {
  spaceId: string;
};

// NEW CONTROLLER MESSAGES

export type PosBusMiroStateMessageType = {
  type: PosBusMessageTypeEnum;
  data: PosBusAttributeMessageDataType<unknown>;
};
