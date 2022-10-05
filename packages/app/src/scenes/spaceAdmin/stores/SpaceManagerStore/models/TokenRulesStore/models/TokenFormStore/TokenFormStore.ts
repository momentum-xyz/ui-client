import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';
import {ResetModel} from '@momentum/sdk';

import {TokenItemModel} from 'core/models';
import {
  api,
  CreateTokenResponse,
  FetchTokenNameResponse,
  FetchTokensResponse,
  TokenFormInterface,
  TokenSearchResponse
} from 'api';

const TokenFormStore = types.compose(
  ResetModel,
  types
    .model('TokenFormStore', {
      tokens: types.array(TokenItemModel),
      request: types.optional(RequestModel, {}),
      searchRequest: types.optional(RequestModel, {}),
      tokenNameRequest: types.optional(RequestModel, {}),
      search: types.optional(types.string, ''),
      tokenRequest: types.optional(RequestModel, {}),
      tokenCreateRequest: types.optional(RequestModel, {}),
      tokenName: types.optional(types.string, 'Token Name Placeholder Only ( Do not proceed )'),
      acceptedToken: types.maybeNull(TokenItemModel),
      results: types.optional(types.array(TokenItemModel), []),
      selectedTokenId: types.maybe(types.string),
      showResults: false
    })
    .actions((self) => ({
      fetchTokens: flow(function* fetchTokens() {
        const response: FetchTokensResponse = yield self.request.send(
          api.tokenRepository.fetchTokens,
          {}
        );
        if (response) {
          self.tokens = cast(
            response.tokens.map((token) => ({
              id: token.id,
              name: token.name
            }))
          );
        }
      }),
      fetchTokenName: flow(function* fetchTokenName(network: string, address: string) {
        const response: FetchTokenNameResponse = yield self.tokenNameRequest.send(
          api.tokenRepository.fetchTokenName,
          {
            network,
            address
          }
        );

        if (response) {
          self.tokenName = cast(response.tokenNames[0]);
        }
      }),
      searchToken: flow(function* (query: string) {
        const response: TokenSearchResponse = yield self.searchRequest.send(
          api.tokenRepository.searchToken,
          {
            q: query
          }
        );

        if (response) {
          self.results = cast(response.results);
          self.showResults = response.results.length > 0;
        }
      }),
      createToken: flow(function* (data: TokenFormInterface) {
        const response: CreateTokenResponse = yield self.tokenCreateRequest.send(
          api.tokenRepository.createToken,
          {
            data
          }
        );

        if (response) {
          self.acceptedToken = cast(response.message);
        }
      }),
      hideResults() {
        self.showResults = false;
      },
      selectTokenRule(id?: string) {
        self.selectedTokenId = id;
        self.showResults = false;
      },
      setSearch(search: string) {
        self.search = search;
      }
    }))
    .views((self) => ({
      get tokensSearched() {
        return self.tokens.filter((token) => token.name.toLowerCase().includes(self.search));
      },
      get fetchTokenNameLoading() {
        return self.tokenNameRequest.isPending;
      },
      get fetchTokenNameDone() {
        return self.tokenNameRequest.isDone;
      },
      get createTokenDone() {
        return self.tokenCreateRequest.isDone;
      },
      get createTokenLoading() {
        return self.tokenCreateRequest.isPending;
      }
    }))
);
export {TokenFormStore};
