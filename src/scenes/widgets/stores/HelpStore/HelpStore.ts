import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

export type HelpSectionType = 'Discord' | 'Controls';

const HelpStore = types
  .compose(
    ResetModel,
    types.model('HelpStore', {
      helpDialog: types.optional(DialogModel, {}),
      showDiscordSection: false,
      showControlsSection: false
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
