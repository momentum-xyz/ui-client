import {ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {types} from 'mobx-state-tree';

import {appVariables} from 'api/constants';

export const DockContent = types
  .model('DockContent', {
    id: types.string,
    name: types.maybe(types.string),
    createdAt: types.maybe(types.string),
    avatarHash: types.maybe(types.string)
  })
  .views((self) => ({
    get avatarSrc(): string | undefined {
      return (
        self.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.avatarHash}`
      );
    }
  }));
