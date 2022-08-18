import {ParticipantRole, ParticipantStatus} from 'core/enums';

import {SpaceType} from '../type/Space';

export interface CollaborationSpace {
  id: string;
  name?: string;
  position?: string;
  own?: boolean;
  type?: SpaceType;
}

export interface CollaborationTable {
  id: string;
}

export interface ChannelInviteDto {
  id: string;
  participants: ParticipantDto[];
}

export interface Channel {
  id: string;
  position: string;
  participants: Participant[];
  created_at: Date;
  updated_at: Date;
}

export interface ParticipantDto {
  id?: string;
  is_owner?: boolean;
  status: ParticipantStatus;
  user_id?: string;
  userId?: {
    type: string;
    data: Buffer;
  };
}

export interface Participant {
  id: string;
  userId?: {
    type: string;
    data: Buffer;
  };
  is_owner: boolean;
  user_id: string;
  status: ParticipantStatus;
  role: ParticipantRole;
  channel?: Channel;
  created_at: Date;
  updated_at: Date;
}

export default CollaborationSpace;
