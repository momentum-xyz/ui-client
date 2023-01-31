import {Instance, types} from 'mobx-state-tree';

import {appVariables} from 'api/constants';

const Asset3d = types
  .model('Asset3d', {
    id: types.identifier,
    name: types.string,
    image: types.string,
    isUserAttribute: types.optional(types.boolean, false)
  })
  .views((self) => ({
    get thumbnailAssetDownloadUrl(): string {
      return `${appVariables.RENDER_SERVICE_URL}/asset/${self.id.replace(/-/g, '')}`;
    }
  }));

export interface Asset3dInterface extends Instance<typeof Asset3d> {}

export {Asset3d};
