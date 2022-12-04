import {getRoot, IAnyStateTreeNode} from 'mobx-state-tree';

import {RootStoreType} from 'stores/RootStore';

/**
 * enable typesafe store communication (replace getRoot and getParent)
 * https://github.com/mobxjs/mobx-state-tree/issues/371
 */
export const getRootStore = (self: IAnyStateTreeNode): RootStoreType =>
  getRoot<RootStoreType>(self);
