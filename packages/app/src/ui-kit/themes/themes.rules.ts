import {ThemeInterface, AccentColorList, BackgroundColorList} from '@momentum-xyz/ui-kit';

export const getBackgroundColorByAccent = (theme: ThemeInterface) => {
  if (theme.accent === AccentColorList[0]) {
    return [BackgroundColorList[0]];
  } else {
    return BackgroundColorList.filter((color: string) => color !== BackgroundColorList[0]);
  }
};
