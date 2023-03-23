import {NewsItemTypeEnum} from '@momentum-xyz/core';

export interface NewsListItemInterface {
  uuid: string;
  date: string;
  type: NewsItemTypeEnum;

  connected?: {
    uuid: string;
    isMutual: boolean;
  };

  custom?: {
    title: string;
    description?: string;
    images?: string[];
    stars: string[];
    reactions: string[]; // ???
    comments: {
      uuid: string;
      message: string;
    }[];
  };
}
