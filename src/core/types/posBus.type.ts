import {IntegrationType} from 'core/types';

export type CollaborationMessageType = {
  integrationType: IntegrationType;
  spaceId: string;
};

export type PosBusGatheringMessageType = {
  spaceId: string;
  name: string;
  start: Date;
};
