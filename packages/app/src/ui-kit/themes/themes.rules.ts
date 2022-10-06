import {ThemeInterface, AccentColorList, BackgroundColorList} from '@momentum/ui-kit';

export const getBackgroundColorByAccent = (theme: ThemeInterface) => {
  if (theme.accent === AccentColorList[0]) {
    return [BackgroundColorList[0]];
  } else {
    return BackgroundColorList.filter((color) => color !== BackgroundColorList[0]);
  }
};
