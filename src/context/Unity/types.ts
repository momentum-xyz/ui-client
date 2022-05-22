export type VibeMessage = {count: number; type: '-1' | '+1'};

export type InviteMessage = {
  spaceId: string;
  sender: {
    id: string;
    name: string;
  };
  uiTypeId: string;
  uiTypeName: string;
};

export type IntegrationTypes = 'miro' | 'google_drive' | 'broadcast' | 'stage_mode';

export type CollaborationMessage = {
  integrationType: IntegrationTypes;
  spaceId: string;
};

export type BroadcastStatus =
  | 'force_small'
  | 'play_small'
  | 'force_large'
  | 'play_large'
  | 'play'
  | 'stop';

export type BroadcastMessage = {
  url: string;
  youtubeUrl: string;
  spaceId: string;
  spaceName: string;
  broadcastStatus: BroadcastStatus;
  users: string[];
};

export type StageModeAction =
  | 'state'
  | 'request'
  | 'accept-request'
  | 'invite'
  | 'decline-invite'
  | 'joined-stage'
  | 'left-stage'
  | 'kick'
  | 'mute';

export type StageModeStatus = 'initiated' | 'stopped';

export type StageModeMessage =
  | StageModeStateMessage
  | StageModeRequest
  | StageModeAdmit
  | StageModeInvite
  | StageModeDeclineInvite
  | StageModeJoined
  | StageModeLeft
  | StageModeKick
  | StageModeMute;

export type StageModeStateMessage = {
  action: 'state';
  value: '0' | '1';
};

export type StageModeRequest = {
  action: 'request';
  userId: string;
  users: string[];
};

export type StageModeAdmit = {
  action: 'accept-request';
  value: 0 | 1;
  userId: string;
};

export type StageModeInvite = {
  action: 'invite';
  invitor: string;
};

export type StageModeDeclineInvite = {
  action: 'decline-invite';
  userId: string;
  users: string[];
};

export type StageModeJoined = {
  action: 'joined-stage';
  userId: string;
};

export type StageModeLeft = {
  action: 'left-stage';
  userId: string;
};

export type StageModeKick = {
  action: 'kick';
  userId: string;
};
export type StageModeMute = {
  action: 'mute';
  userId: string;
};

export type High5Message = {
  senderId: string;
  receiverId: string;
  message: string;
};
