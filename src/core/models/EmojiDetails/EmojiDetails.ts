import {Instance, types} from 'mobx-state-tree';

import {appVariables} from 'api/constants';

const emojiSize = 's1';

const EmojiDetails = types
  .model('EmojiDetails', {
    id: types.string,
    code: types.string,
    hash: types.string,
    name: types.string,
    order: types.number,
    spaceId: types.string
  })
  .views((self) => ({
    get imgSrc(): string {
      return `${appVariables.RENDER_SERVICE_URL}/texture/${emojiSize}/${self.hash}`;
    }
  }));

export interface EmojiDetailsInterface extends Instance<typeof EmojiDetails> {}

export {EmojiDetails};
