import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {SpaceInviteRequest, SpaceInviteResponse} from './spaceInvite.api.types';
import {spaceInviteEndpoints} from './spaceInvite.api.endpoins';

export const inviteToSpaceOrTable: RequestInterface<SpaceInviteRequest, SpaceInviteResponse> = (
  options
) => {
  const {spaceId, userId, isTable, ...restOptions} = options;
  const data = {spaceId, userId, isTable};

  return request.post(spaceInviteEndpoints().base, data, restOptions);
};
