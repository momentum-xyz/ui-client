import {cast, flow, types} from 'mobx-state-tree';
import {values} from 'mobx';
import {BN, formatBalance} from '@polkadot/util';

import {ValidatorItemModel, ResetModel, RequestModel} from 'core/models';
import {api, FetchValidatorsResponseInterface} from 'api';

const ValidatorsStore = types.compose(
  ResetModel,
  types
    .model('ValidatorStore', {
      request: types.optional(RequestModel, {}),
      favoritesRequest: types.optional(RequestModel, {}),
      validators: types.array(ValidatorItemModel),
      search: types.optional(types.string, ''),
      withIdentity: true
    })
    .actions((self) => ({
      fetch: flow(function* (spaceId?: string) {
        const response: FetchValidatorsResponseInterface = yield self.request.send(
          api.validatorsRepository.fetchValidators,
          {withIdentity: self.withIdentity}
        );

        if (response) {
          self.validators = cast(
            response.map((validator) => {
              const {
                metadata,
                id,
                parentId,
                operatorSpaceId,
                isFavorited,
                name,
                operatorSpaceName
              } = validator;
              const {kusama_metadata} = metadata;
              const {validator_info, validator_reward} = kusama_metadata;
              return {
                id,
                spaceId: id,
                hasLink: !!operatorSpaceId,
                address: validator_info.accountId,
                entity: name,
                operatorSpaceName,
                validator: validator_info.validatorAccountDetails.name,
                commission: validator_info.commission,
                ownStake: formatBalance(new BN(validator_info.ownStake), {
                  decimals: 12,
                  withUnit: false,
                  withSi: false
                }),
                reward: validator_reward,
                operatorId: parentId,
                isBookmarked: isFavorited,
                selected: spaceId === parentId
              };
            })
          );
        }
      }),
      setSearch(search: string) {
        self.search = search;
      },
      setWithIdentity(withIdentity: boolean) {
        self.withIdentity = withIdentity;
      }
    }))
    .views((self) => ({
      get validatorsCount() {
        return self.validators.length;
      },
      get selectedValidatorsCount() {
        return values(self.validators).filter((validator) => validator.selected).length;
      },
      get validatorsTotals() {
        return `${this.selectedValidatorsCount}/24`;
      },
      get bookmarkedValidatorsCount() {
        return values(self.validators).filter((validator) => validator.isBookmarked).length;
      },
      get validatorsSearched() {
        return self.validators.filter(
          (validator) =>
            validator.entity.toLowerCase().includes(self.search.toLowerCase()) ||
            validator.validator.toLowerCase().includes(self.search.toLowerCase())
        );
      },
      get selectedValidators() {
        return self.validators
          .filter((validator) => validator.selected)
          .map((validator) => validator.address);
      },

      get selectedValidatorsOptions() {
        return this.selectedValidators.map((address) => {
          return {
            label: address,
            value: address,
            icon: 'wallet' as IconNameType
          };
        });
      },
      get selectedValidatorsValidation() {
        return this.selectedValidators.length > 0 && this.selectedValidators.length <= 24;
      }
    }))
);

export {ValidatorsStore};
