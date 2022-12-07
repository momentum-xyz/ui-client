import {Instance, types} from 'mobx-state-tree';

const Asset3d = types
  .model('Asset3d', {
    id: types.identifier,
    name: types.string,
    image: types.string
  })
  .views((self) => ({
    // get imageSrc(): string {
    //   return `${appVariables.RENDER_SERVICE_URL}/get/${self.image}`;
    // }
  }));

export interface Asset3dInterface extends Instance<typeof Asset3d> {}

export {Asset3d};
