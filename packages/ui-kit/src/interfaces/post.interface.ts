import {TimelineTypeEnum} from '@momentum-xyz/core';

export interface PostFormInterface {
  file?: File;
  description?: string;
}

export interface PostAuthorInterface {
  id: string;
  name: string;
  avatarSrc: string | null;
  isItMe?: boolean;
}

export interface PostEntryInterface {
  id: string;
  hashSrc: string | null;
  description: string | null;
  type: TimelineTypeEnum;
  objectId?: string;
  objectName?: string;
  objectAvatarSrc?: string;
  tokenSymbol?: string;
  tokenAmount?: string;
  created: string;
}
