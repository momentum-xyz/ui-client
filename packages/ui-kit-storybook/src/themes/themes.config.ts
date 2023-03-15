import {ThemeInterface} from '../interfaces';

/*
    IMPORTANT:
    Do NOT change the order, it will break things!
    To add a new color, append at the end.
*/

export const AccentColorList: string[] = ['#004373'];

export const AccentTextColorList: string[] = ['#9EEEFF'];

export const BackgroundColorList: string[] = ['#EAD6E5'];

export const TextColorList: string[] = ['#FFFFFF'];

export const DangerColorList: string[] = ['#EA0000'];

export const SuccessColorList: string[] = ['#00CC50'];

export const DefaultThemeConfig: ThemeInterface = {
  accentBg: AccentColorList[0],
  accentText: AccentTextColorList[0],
  bg: BackgroundColorList[0],
  text: TextColorList[0],
  danger: DangerColorList[0],
  success: SuccessColorList[0]
};
