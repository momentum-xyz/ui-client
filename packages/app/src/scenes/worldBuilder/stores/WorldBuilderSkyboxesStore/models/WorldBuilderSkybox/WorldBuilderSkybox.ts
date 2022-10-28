import {Instance, types} from 'mobx-state-tree';

const WorldBuilderSkybox = types
  .model('WorldBuilderSkybox', {
    id: types.identifier,
    name: types.string,
    image: types.string
  })
  .views((self) => ({
    // get imageSrc(): string {
    //   return `${appVariables.RENDER_SERVICE_URL}/get/${self.image}`;
    // }
  }));

export interface WorldBuilderSkyboxInterface extends Instance<typeof WorldBuilderSkybox> {}

export {WorldBuilderSkybox};
