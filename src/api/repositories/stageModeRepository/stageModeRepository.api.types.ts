import {ParticipantStatus, ParticipantRole, ModerationEnum, StageModeRequestEnum} from 'core/enums';

import {SpaceIntegrationsStageModeResponse} from '../spaceIntegrationsRepository/spaceIntegrations.api.types';

interface ChannelInterface {
  id: string;
  position: string;
  participants: ParticipantInterface[];
  created_at: Date;
  updated_at: Date;
}

interface ParticipantInterface {
  id: string;
  userId?: {
    type: string;
    data: Buffer;
  };
  is_owner: boolean;
  user_id: string;
  status: ParticipantStatus;
  role: ParticipantRole;
  channel?: ChannelInterface;
  created_at: Date;
  updated_at: Date;
}

export interface StageModeRequest {
  spaceId: string;
}

export interface StageModeJoinResponse extends SpaceIntegrationsStageModeResponse {}

export interface StageModeResponse {
  id?: string;
  position: string;
  participants: ParticipantInterface[];
}

// ** Invitation response **

export interface StageModeResponseRequest extends StageModeRequest {
  userId?: string;
  stageModeRequestType: StageModeRequestEnum.ACCEPT | StageModeRequestEnum.DECLINE;
}

// ** Admit or kick **

export interface StageModeAdmitOrKickRequest extends StageModeRequest {
  modType: ModerationEnum;
  userId: string;
}

// ** Request **

export interface StageModeRequestRequest extends StageModeRequest {
  userId?: string;
}

// ** Invite **

export interface StageModeInviteRequest extends StageModeRequest {
  userId: string;
}
