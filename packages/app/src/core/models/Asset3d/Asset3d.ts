import {Instance, types} from 'mobx-state-tree';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {appVariables} from 'api/constants';

const Asset3d = types
  .model('Asset3d', {
    id: types.identifier,
    category: types.maybeNull(types.string),
    name: types.string,
    artist_name: types.optional(types.string, ''),
    // TODO remove
    image: types.string,
    preview_hash: types.maybeNull(types.string),
    is_private: types.optional(types.boolean, false),
    isUserAttribute: types.optional(types.boolean, false)
  })
  .views((self) => ({
    get thumbnailAssetDownloadUrl(): string {
      return `${appVariables.RENDER_SERVICE_URL}/asset/${self.id.replace(/-/g, '')}`;
    },
    get previewUrl(): string {
      return self.preview_hash
        ? `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S4}/${self.preview_hash}`
        : `https://dev.odyssey.ninja/api/v3/render/texture/${ImageSizeEnum.S4}/03ce359d18bfc0fe977bd66ab471d222`;
    }
  }));

export interface Asset3dInterface extends Instance<typeof Asset3d> {}

export {Asset3d};
