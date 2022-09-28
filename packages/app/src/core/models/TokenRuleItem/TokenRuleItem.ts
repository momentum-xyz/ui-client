import {types, Instance} from 'mobx-state-tree';

const TokenRuleItemModel = types
  .model('TokenRuleItemModel', {
    id: types.string,
    status: types.string,
    name: types.string,
    network: types.maybeNull(types.string),
    contractAddress: types.maybeNull(types.string),
    minBalance: types.maybe(types.number),
    tokenGroupUserId: types.string,
    tokenType: types.maybeNull(types.string),
    userName: types.maybe(types.string),
    userId: types.maybe(types.string),
    spaceName: types.maybe(types.string)
  })
  .views((self) => ({
    canRemove(currentUserId?: string) {
      return currentUserId && self.userId === currentUserId;
    }
  }));

export interface TokenRuleItemModelInterface extends Instance<typeof TokenRuleItemModel> {}

export {TokenRuleItemModel};
