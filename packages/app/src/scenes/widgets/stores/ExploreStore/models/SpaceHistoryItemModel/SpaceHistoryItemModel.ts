import {Instance, types} from 'mobx-state-tree';

const SpaceHistoryItemModel = types.model('SpaceHistoryItemModel', {
  spaceName: types.string,
  spaceId: types.string
});

export interface SpaceHistoryItemModelInterface extends Instance<typeof SpaceHistoryItemModel> {}

export {SpaceHistoryItemModel};
