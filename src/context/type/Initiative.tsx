import {Space} from './Space';

export interface Initiative {
  isAdmin: boolean;
  space: Space;
  spaceId: {
    type: string;
    data: Buffer;
  };
  userId: {
    type: string;
    data: Buffer;
  };
}
