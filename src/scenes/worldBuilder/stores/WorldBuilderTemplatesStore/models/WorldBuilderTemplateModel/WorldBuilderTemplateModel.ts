import {Instance, types} from 'mobx-state-tree';

const WorldBuilderTemplateModel = types
  .model('WorldBuilderTemplateModel', {
    id: types.identifier,
    name: types.string,
    description: types.string,
    image: types.string,
    showMore: false
  })
  .actions((self) => ({
    toggleShowMore() {
      self.showMore = !self.showMore;
    }
  }));

export interface WorldBuilderTemplateModelInterface
  extends Instance<typeof WorldBuilderTemplateModel> {}

export {WorldBuilderTemplateModel};
