import {ThemeInterface} from 'ui-kit/interfaces';

import {AccentColorList, BackgroundColorList} from './themes.config';

export const getBackgroundColorByAccent = (theme: ThemeInterface) => {
  if (theme.accent === AccentColorList[0]) {
    return [BackgroundColorList[0]];
  } else {
    return BackgroundColorList.filter((color) => color !== BackgroundColorList[0]);
  }
};
