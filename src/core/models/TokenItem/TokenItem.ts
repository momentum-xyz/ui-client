import {types, Instance} from 'mobx-state-tree';

const TokenItemModel = types.model('TokenRuleItemModel', {
  id: types.string,
  name: types.string
});

export interface TokenItemModelInterface extends Instance<typeof TokenItemModel> {}

export {TokenItemModel};
