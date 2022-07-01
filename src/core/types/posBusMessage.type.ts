import {IntegrationType} from 'core/types';

export type PosBusCollaborationMessageType = {
  integrationType: IntegrationType;
  spaceId: string;
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
