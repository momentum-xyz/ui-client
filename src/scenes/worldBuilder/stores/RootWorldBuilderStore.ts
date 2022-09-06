import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {WorldBuilderNameStore} from './WorldBuilderNameStore';
import {WorldBuilderTemplatesStore} from './WorldBuilderTemplatesStore';

const RootWorldBuilderStore = types.compose(
  ResetModel,
  types.model('RootWorldBuilderStore', {
    worldBuilderNameStore: types.optional(WorldBuilderNameStore, {}),
    worldBuilderTemplatesStore: types.optional(WorldBuilderTemplatesStore, {})
  })
);

export {RootWorldBuilderStore};
