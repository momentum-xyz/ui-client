export interface Space {
  id: {
    type: string;
    data: Buffer;
  };
  name: string;
  description: string;
  secret: number;
  parentId?: {
    type: string;
    data: Buffer;
  };
  userSpaces?: UserSpace[] | any[];
  children?: Space[];
  createdAt?: Date;
  updatedAt?: Date;
  auxProject?: AuxProject;
  isAdmin?: string;
  ownedById?: {
    type: string;
    data: Buffer;
  };
  spaceType: SpaceType | any;
  metadata?: {
    kusama_metadata?: {
      operator_id?: string;
    };
  };
}

export interface User {
  name: string;
}

export interface UserSpace {
  user: User;
  isAdmin: boolean;
  spaceId?: {
    type: string;
    data: Buffer;
  };
  userId?: {
    type: string;
    data: Buffer;
  };
  space?: Space;
}

export interface SpaceResponse {
  space: Space;
  admin: boolean;
  member?: boolean;
  status: number;
  message: string;
  spaceType: SpaceType;
  children: Space[];
  ancestors?: Space[];
  ownerName?: string;
}

export interface SpaceCheckResponse {
  spaceId: string;
  status: any;
  message: string;
}

export interface SpaceCreateResponse {
  id: string;
  status: any;
  message: string;
}

export interface SpaceUserResponse {
  isAdmin: boolean;
}

export interface SpaceDTO {
  parentId?: string;
  worldId?: string;
  root: boolean;
  visibility: boolean;
  name: string;
  description?: string;
  spaceType?: SpaceType;
}

export interface AuxProject {
  problem: string;
  solution: string;
}

export enum SpaceType {
  WORLD = 'world',
  PROGRAM = 'program',
  CHALLENGE = 'challenge',
  PROJECT = 'project',
  GRAB_A_TABLE = 'grab-a-table',
  OPERATOR = 'Operator'
}
