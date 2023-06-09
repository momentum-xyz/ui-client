import {PostTypeEnum} from '@momentum-xyz/core';

import {IconNameType} from '../types';

export interface PostFormInterface {
  file?: File;
  description?: string;
}

export interface PostAuthorInterface {
  id: string;
  name: string;
  avatarSrc: string | null;
  isItMe: boolean;
}

export interface PostEntryInterface {
  id: string;
  hashSrc: string;
  icon: IconNameType;
  description: string | null;
  type: PostTypeEnum;
  objectId?: string;
  objectName?: string;
  created: string;
}
