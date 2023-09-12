import {UserContributionInterface} from 'api/interfaces';

import {UserInfoInterface} from '../userRepository/userRepository.api.types';

export interface GetUserContributionsRequest {
  objectId: string;
}

export interface ContributionItemInterface {
  votes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  object_id: string;
  user: UserInfoInterface;
  value: UserContributionInterface;
  type: {plugin_id: string; attribute_name: string};
}

export interface GetUserContributionsResponse {
  count: number;
  limit: number;
  offset: number;
  items: ContributionItemInterface[] | null;
}
