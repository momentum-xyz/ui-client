import {cast, types} from 'mobx-state-tree';
import {DefaultThemeConfig, ThemeInterface} from '@momentum-xyz/ui-kit-storybook';

import {storage} from 'shared/services';
import {StorageKeyEnum} from 'core/enums';

const ThemeStore = types
  .model('ThemeStore', {
    theme: types.optional(types.frozen<ThemeInterface>(), DefaultThemeConfig)
  })
  .actions((self) => ({
    init(): void {
      const stored = storage.get<ThemeInterface>(StorageKeyEnum.Theme);
      self.theme = cast(stored ? (stored as ThemeInterface) : DefaultThemeConfig);
    }
  }))
  .views(() => ({}));

export {ThemeStore};
