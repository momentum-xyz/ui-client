/** Base **/
export interface ValidatorInterface {
  id: string;
  parentId: string;
  spaceTypeId: string;
  operatorSpaceId?: string;
  uiTypeId: string;
  operatorSpaceName: string;
  name: string;
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

export interface ValidatorEntityInterface {
  name: string;
  accountId: string;
}

/** FETCH EVENTS **/
export interface FetchValidatorsResponseInterface extends Array<ValidatorInterface> {}

export interface BaseValidatorsRequestInterface {
  withIdentity: boolean;
  parentSpaceId?: string;
}

/** BOOKMARK **/
export interface UpdateValidatorBookmarkRequestInterface {
  id: string;
  bookmark: boolean;
}

export interface UpdateValidatorBookmarkResponseInterface {
  id: string;
  bookmark: boolean;
}
