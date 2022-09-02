import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {WorldNameStore} from './WorldNameStore';

const RootWorldBuilderStore = types.compose(
  ResetModel,
  types.model('RootWorldBuilderStore', {
    worldNameStore: types.optional(WorldNameStore, {})
  })
);

export {RootWorldBuilderStore};
