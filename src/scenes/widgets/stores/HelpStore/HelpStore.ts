import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

export enum HelpSectionType {
  Discord = 'Discord',
  Momentum = 'Momentum',
  Controls = 'Controls',
  Wiki = 'Wiki',
  IntroVideo = 'IntroVideo'
}

const HelpStore = types
  .compose(
    ResetModel,
    types.model('HelpStore', {
      helpDialog: types.optional(DialogModel, {}),
      showDiscordSection: false,
      showIntroVideoSection: false,
      showControlsSection: false,
      showMomentumSection: false,
      showWikiSection: false
    })
  )
  .actions((self) => ({
    toggleSection(section: HelpSectionType, show?: boolean) {
      if (show) {
        self[`show${section}Section`] = show;
        return;
      }
      self[`show${section}Section`] = !self[`show${section}Section`];
    }
  }));

export {HelpStore};
