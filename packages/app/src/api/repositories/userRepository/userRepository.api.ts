import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  FetchBigStakersListRequest,
  FetchBigStakersListResponse,
  FetchMeRequest,
  FetchMeResponse,
  FetchMyStakesRequest,
  FetchMyStakesResponse,
  FetchMyWalletsRequest,
  FetchMyWalletsResponse,
  FetchUserListRequest,
  FetchUserListResponse,
  FetchUserRequest,
  FetchUserResponse,
  FetchUserStakedWorldListRequest,
  FetchUserStakedWorldListResponse,
  FetchUserWorldListRequest,
  FetchUserWorldListResponse,
  PostPendingStakeRequest,
  PostPendingStakeResponse
} from './userRepository.api.types';
import {userRepositoryEndpoints} from './userRepository.api.endpoints';

export const fetchMe: RequestInterface<FetchMeRequest, FetchMeResponse> = (options) => {
  return request.get(userRepositoryEndpoints().me, options);
};

export const fetchMyWallets: RequestInterface<FetchMyWalletsRequest, FetchMyWalletsResponse> = (
  options
) => {
  return request.get(userRepositoryEndpoints().myWallets, options);
};

export const fetchMyStakes: RequestInterface<FetchMyStakesRequest, FetchMyStakesResponse> = (
  options
) => {
  return request.get(userRepositoryEndpoints().myStakes, options);
};

export const postPendingStake: RequestInterface<PostPendingStakeRequest, PostPendingStakeResponse> =
  (options) => {
    const {transaction_id, odyssey_id, wallet, comment, amount, kind, ...restOptions} = options;
    const data: PostPendingStakeRequest = {
      transaction_id,
      odyssey_id,
      wallet,
      comment,
      amount,
      kind
    };
    return request.post(userRepositoryEndpoints().myStakes, data, restOptions);
  };

export const fetchUser: RequestInterface<FetchUserRequest, FetchUserResponse> = (options) => {
  const {userId, ...restOptions} = options;
  const url = generatePath(userRepositoryEndpoints().profile, {userId});
  return request.get(url, restOptions);
};

export const fetchUserList: RequestInterface<FetchUserListRequest, FetchUserListResponse> = (
  options
) => {
  const {limit, sortDirection, ...restOptions} = options;
  restOptions.params = {sort: sortDirection, limit};
  return request.get(userRepositoryEndpoints().list, restOptions);
};

export const fetchBigStakersList: RequestInterface<
  FetchBigStakersListRequest,
  FetchBigStakersListResponse
> = (options) => {
  return request.get(userRepositoryEndpoints().bigStakers, options);
};

export const fetchOwnedWorldList: RequestInterface<
  FetchUserWorldListRequest,
  FetchUserWorldListResponse
> = (options) => {
  const {userId, ...restOptions} = options;
  const url = generatePath(userRepositoryEndpoints().ownedWorldList, {userId});
  return request.get(url, restOptions);
};

export const fetchStakedWorldList: RequestInterface<
  FetchUserStakedWorldListRequest,
  FetchUserStakedWorldListResponse
> = (options) => {
  const {userId, ...restOptions} = options;
  const url = generatePath(userRepositoryEndpoints().stakedWorldList, {userId});
  return request.get(url, restOptions);
};
