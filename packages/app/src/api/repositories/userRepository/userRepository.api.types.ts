import {IconNameType, UserStatusEnum} from '@momentum-xyz/ui-kit';

import {UserProfileInterface, WorldInfoInterface} from 'api';

/** COMMON **/

export interface UserInterface {
  id: string;
  name: string;
  description: string | null;
  userTypeId: string;
  createdAt: string;
  updatedAt: string | null;
  wallet: string | null;
  isNodeAdmin: boolean;
  status: UserStatusEnum | null;
  profile: UserProfileInterface;
  isGuest?: boolean;
}

export interface UserInfoInterface {
  id: string;
  name: string;
  profile: UserProfileInterface;
}

export interface BigStakerInfoInterface {
  user_id: string;
  name: string;
  avatarHash: string | null;
  stake_count: number;
}

export interface StakeInterface {
  wallet_id: string;
  amount: string;
  reward: string;
  blockchain_id: string;
  kind: number;
  avatar_hash: string | null;
  last_comment: string | null;
  name: string;
  object_id: string;
  updated_at: string;
}

export interface WalletInterface {
  wallet_id: string;
  balance: string;
  reward: string;
  blockchain_name: string;
  contract_id: string;
  updated_at: string;
  transferable: string;
  staked: string;
  unbonding: string;
  wallet_icon?: IconNameType;
}

/** FETCH ME **/

export interface FetchMeRequest {}

export interface FetchMeResponse extends UserInterface {}

/** FETCH MY WALLETS **/

export interface FetchMyWalletsRequest {}

export interface FetchMyWalletsResponse extends Array<WalletInterface> {}

/** FETCH MY STAKES **/

export interface FetchMyStakesRequest {}

export interface FetchMyStakesResponse extends Array<StakeInterface> {}

/** POST PENDING STAKE **/

export interface PostPendingStakeRequest {
  transaction_id: string;
  odyssey_id: string;
  wallet: string;
  comment: string;
  amount: string;
  kind: string;
}

export interface PostPendingStakeResponse {}

/** POST PENDING NFT MINT **/

export interface PostPendingNftMintRequest {
  transaction_id: string;
  wallet: string;
}

/** FETCH User **/

export interface FetchUserRequest {
  userId: string;
}

export interface FetchUserResponse extends UserInterface {}

/** FETCH USER LIST **/

export interface FetchUserListRequest {
  sortDirection: 'DESC' | 'ASC';
  limit: number;
}

export interface FetchUserListResponse extends Array<UserInfoInterface> {}

/** FETCH BIG STAKERS LIST **/

export interface FetchBigStakersListRequest {}

export interface FetchBigStakersListResponse extends Array<BigStakerInfoInterface> {}

/** FETCH OWNED WORLD LIST **/

export interface FetchUserWorldListRequest {
  userId: string;
}

export interface FetchUserWorldListResponse extends Array<WorldInfoInterface> {}

/** FETCH STAKED WORLD LIST **/

export interface FetchUserStakedWorldListRequest {
  userId: string;
}

export interface FetchUserStakedWorldListResponse extends Array<WorldInfoInterface> {}

/** REMOVE WALLET **/

export interface RemoveWalletRequest {
  wallet: string;
}
