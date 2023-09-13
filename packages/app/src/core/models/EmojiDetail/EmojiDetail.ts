import {Instance, types} from 'mobx-state-tree';

import {appVariables} from 'api/constants';

const emojiSizeUI = 's1';

const EmojiDetail = types
  .model('EmojiDetail', {
    emojiId: types.string,
    hash: types.string,
    name: types.string
  })
  .views((self) => ({
    get imgSrc(): string {
      return `${appVariables.RENDER_SERVICE_URL}/texture/${emojiSizeUI}/${self.hash}`;
    }
  }));

export interface EmojiDetailModelInterface extends Instance<typeof EmojiDetail> {}

export {EmojiDetail};
