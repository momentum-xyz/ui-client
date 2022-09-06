import {Instance, types} from 'mobx-state-tree';

import {appVariables} from 'api/constants';

const WorldBuilderTemplate = types
  .model('WorldBuilderTemplate', {
    id: types.identifier,
    name: types.string,
    description: types.string,
    image: types.string
  })
  .views((self) => ({
    get imageSrc(): string {
      return `${appVariables.RENDER_SERVICE_URL}/get/${self.image}`;
    }
  }));

export interface WorldBuilderTemplateModelInterface extends Instance<typeof WorldBuilderTemplate> {}

export {WorldBuilderTemplate};
