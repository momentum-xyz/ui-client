import {cast, flow, types} from 'mobx-state-tree';

import {AvatarSizeEnum} from 'core/enums';
import {appVariables} from 'api/constants';
import {api, EmojiConfigResponse} from 'api';
import {DialogModel, RequestModel, ResetModel} from 'core/models';

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
      helpDialog: types.optional(DialogModel, {}),
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
      const response: EmojiConfigResponse = yield self.emojiRequest.send(
        api.emojiRepository.fetchSpaceEmojiConfig,
        {worldId}
      );

      const data = response.map(
        ({emoji}) => `${appVariables.RENDER_SERVICE_URL}/texture/${AvatarSizeEnum.S1}/${emoji.hash}`
      );

      self.emojiUrls = cast(data.slice(0, 18));
    })
  }));

export {HelpStore};
