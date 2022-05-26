import {appVariables} from 'api/constants';

import {SpaceInviteDto, SpaceInviteResponse} from '../../context/type/SpaceInvite';
import {SpaceCreateResponse} from '../../context/type/Space';

import {usePost} from './useApi';

export const useSpaceInvite = (userId: string) => {
  const [postRequest, , loading] = usePost<SpaceInviteResponse, SpaceInviteDto>(
    appVariables.BACKEND_ENDPOINT_URL + '/space-invite'
  );

  const returnValue: [(spaceId: string) => Promise<SpaceInviteResponse>, boolean] = [
    (spaceId) =>
      postRequest({
        userId: userId,
        spaceId: spaceId
      }),
    loading
  ];

  return returnValue;
};

export const useTableInvite = () => {
  return usePost<SpaceCreateResponse, SpaceInviteDto>(
    appVariables.BACKEND_ENDPOINT_URL + `/space-invite`
  );
};
