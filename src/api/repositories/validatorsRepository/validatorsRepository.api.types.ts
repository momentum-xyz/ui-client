/** Base **/
export interface ValidatorInterface {
  id: string;
  parentId: string;
  spaceTypeId: string;
  name: string;
  operatorSpaceId?: string;
  uiTypeId: string;
  isFavorited: boolean;
  metadata: {
    kusama_metadata: KusamaMetaDataInterface;
  };
}

export interface KusamaMetaDataInterface {
  validator_id: string;
  validator_reward: number;
  validator_info: {
    accountId: string;
    entity: {
      name: string;
      accountId: string;
    };
    commission: string | number;
    ownStake: number | string;
    status: string;
    totalStake: string;
    validatorAccountDetails: {
      name: string;
    };
  };
}

export interface ValidatorEntity {
  name: string;
  accountId: string;
}

/** FETCH EVENTS **/
export interface FetchValidatorsResponse extends Array<ValidatorInterface> {}

export interface BaseValidatorsRequest {
  withIdentity: boolean;
  parentSpaceId?: string;
}

/** BOOKMARK **/
export interface UpdateValidatorBookmarkRequest {
  id: string;
  bookmark: boolean;
}

export interface UpdateValidatorBookmarkResponse {
  id: string;
  bookmark: boolean;
}
