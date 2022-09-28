export type StageModeStateMessageType = {
  action: 'state';
  value: '0' | '1';
};

export type StageModeRequestType = {
  action: 'request';
  userId: string;
  users: string[];
};

export type StageModeAdmitType = {
  action: 'accept-request';
  value: 0 | 1;
  userId: string;
};

export type StageModeInviteType = {
  action: 'invite';
  invitor: string;
};

export type StageModeDeclineInviteType = {
  action: 'decline-invite';
  userId: string;
  users: string[];
};

export type StageModeJoinedType = {
  action: 'joined-stage';
  userId: string;
};

export type StageModeLeftType = {
  action: 'left-stage';
  userId: string;
};

export type StageModeKickType = {
  action: 'kick';
  userId: string;
};
export type StageModeMuteType = {
  action: 'mute';
  userId: string;
};
