import {types, Instance} from 'mobx-state-tree';

const UUIDModel = types.model('UUID', {
  type: types.string,
  data: types.frozen<Buffer>()
});

export interface UUIDModelInterface extends Instance<typeof UUIDModel> {}

export {UUIDModel};
