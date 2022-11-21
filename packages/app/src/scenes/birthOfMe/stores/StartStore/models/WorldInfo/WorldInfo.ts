import {Instance, types} from 'mobx-state-tree';

const WorldInfo = types
  .model('WorldInfo', {
    id: types.identifier,
    name: types.string,
    image: types.string
  })
  .views((self) => ({
    // get imageSrc(): string {
    //   return `${appVariables.RENDER_SERVICE_URL}/get/${self.image}`;
    // }
  }));

export interface WorldInfoInterface extends Instance<typeof WorldInfo> {}

export {WorldInfo};
