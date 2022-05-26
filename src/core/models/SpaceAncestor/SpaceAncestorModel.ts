import {Instance, types} from 'mobx-state-tree';

const SpaceAncestorModel = types.model('SpaceAncestor', {
  id: types.string,
  name: types.string,
  isSelected: types.boolean
});

export interface SpaceAncestorModelInterface extends Instance<typeof SpaceAncestorModel> {}

export {SpaceAncestorModel};
