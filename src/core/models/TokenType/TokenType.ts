import {types, Instance} from 'mobx-state-tree';

const TokenTypeModel = types.model('NetworkTypeModel', {
  label: types.string,
  value: types.string
});

export interface TokenTypeModelModelInterface extends Instance<typeof TokenTypeModel> {}

export {TokenTypeModel};
