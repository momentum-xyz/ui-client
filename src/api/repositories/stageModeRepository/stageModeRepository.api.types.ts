import {ParticipantStatus, ParticipantRole} from 'core/enums';

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

export interface StageModeResponse {
  id?: string;
  position: string;
  participants: ParticipantInterface[];
}
