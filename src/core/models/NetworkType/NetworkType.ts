import {types, Instance} from 'mobx-state-tree';

const NetworkTypeModel = types.model('NetworkTypeModel', {
  label: types.string,
  value: types.string
});

export interface NetworkTypeModelInterface extends Instance<typeof NetworkTypeModel> {}

export {NetworkTypeModel};
