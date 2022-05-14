import {cast, types} from 'mobx-state-tree';

import {storage} from 'core/services';
import {StorageKeyEnum} from 'core/enums';
import {
  AccentColorList,
  BackgroundColorList,
  DefaultThemeConfig,
  TextColorList,
  ThemeInterface
} from 'ui-kit';

const ThemeStore = types
  .model('ThemeStore', {
    theme: types.optional(types.frozen<ThemeInterface>(), DefaultThemeConfig)
  })
  .actions((self) => ({
    init(): void {
      const stored = storage.get<ThemeInterface>(StorageKeyEnum.Theme);
      self.theme = cast(!!stored ? (stored as ThemeInterface) : DefaultThemeConfig);
    },
    changeAccentColor(accent: string): void {
      self.theme = {...self.theme, accent};
      if (accent === AccentColorList[0]) {
        self.theme = {...self.theme, bg: BackgroundColorList[0], text: TextColorList[0]};
      } else if (self.theme.bg === BackgroundColorList[0]) {
        self.theme = {...self.theme, bg: BackgroundColorList[1], text: TextColorList[1]};
      } else if (self.theme.text === TextColorList[0]) {
        self.theme = {...self.theme, text: TextColorList[1]};
      }
      storage.set(StorageKeyEnum.Theme, {...self.theme});
    },
    changeBackgroundColor(bg: string): void {
      if (self.theme.accent === AccentColorList[0]) {
        return;
      }
      self.theme = {...self.theme, bg};
      storage.set(StorageKeyEnum.Theme, {...self.theme});
    },
    changeTextColor(text: string): void {
      if (self.theme.accent === AccentColorList[0]) {
        return;
      }
      self.theme = {...self.theme, text};
      storage.set(StorageKeyEnum.Theme, {...self.theme});
    }
  }))
  .views(() => ({}));

export {ThemeStore};
