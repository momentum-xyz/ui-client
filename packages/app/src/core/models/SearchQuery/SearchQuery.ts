import {types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {SEARCH_MINIMAL_CHARACTER_COUNT} from '@momentum-xyz/ui-kit';

const SearchQuery = types
  .compose(
    ResetModel,
    types.model('SearchQuery', {
      request: types.optional(RequestModel, {}),
      query: ''
    })
  )
  .actions((self) => ({
    setQuery(query: string): void {
      self.query = query;
    }
  }))
  .views((self) => ({
    get isQueryValid(): boolean {
      return self.query.length >= SEARCH_MINIMAL_CHARACTER_COUNT;
    },
    get isPending(): boolean {
      return self.request.isPending;
    }
  }));

export {SearchQuery};
