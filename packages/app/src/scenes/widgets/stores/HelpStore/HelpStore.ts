import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {appVariables} from 'api/constants';
import {api, WorldEmojiesResponse} from 'api';

export enum HelpSectionEnum {
  Discord = 'Discord',
  Momentum = 'Momentum',
  Controls = 'Controls',
  Wiki = 'Wiki',
  IntroVideo = 'IntroVideo',
  Emoji = 'Emoji'
}

const HelpStore = types
  .compose(
    ResetModel,
    types.model('HelpStore', {
      helpDialog: types.optional(Dialog, {}),
      emojiRequest: types.optional(RequestModel, {}),
      emojiUrls: types.optional(types.array(types.string), []),
      showDiscordSection: false,
      showIntroVideoSection: false,
      showControlsSection: false,
      showMomentumSection: false,
      showWikiSection: false,
      showEmojiSection: false
    })
  )
  .actions((self) => ({
    init(worldId: string) {
      this.initEmoji(worldId);
    },
    toggleSection(section: HelpSectionEnum, show?: boolean) {
      if (show) {
        self[`show${section}Section`] = show;
        return;
      }
      self[`show${section}Section`] = !self[`show${section}Section`];
    },
    initEmoji: flow(function* (worldId: string) {
      const response: WorldEmojiesResponse = yield self.emojiRequest.send(
        api.spaceEmojiRepository.fetchWorldEmojies,
        {worldId}
      );

      const data = response.map(
        (emoji) => `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S1}/${emoji.hash}`
      );

      self.emojiUrls = cast(data.slice(0, 18));
    })
  }));

export {HelpStore};
