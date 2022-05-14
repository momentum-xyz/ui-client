import {ThemeInterface} from 'ui-kit/interfaces';

/*
    IMPORTANT: Do NOT change the order, it will break things!
    To add a new color, append at the end.
*/
export const AccentColorList: string[] = [
  '#000000',
  '#0071FF',
  '#9CFF8B',
  '#01FFB3',
  '#01F0FF',
  '#B2F1FF',
  '#88CCD6',
  '#6FB6DD',
  '#6FDBC1'
];

/*
    IMPORTANT: Do NOT change the order, it will break things!
    To add a new color, append at the end.
*/
export const BackgroundColorList: string[] = [
  '#FFFFFF',
  '#252931',
  '#14284E',
  '#051745',
  '#151C2E',
  '#171638',
  '#1C2635'
];

/*
    IMPORTANT: Do NOT change the order, it will break things!
    To add a new color, append at the end.
*/
export const TextColorList: string[] = ['#000000', '#FFFFFF'];

/*
    IMPORTANT: Do NOT change the order, it will break things!
    To add a new color, append at the end.
*/
export const AccentWarningColorList: string[] = ['#A19C23'];

/*
    IMPORTANT: Do NOT change the order, it will break things!
    To add a new color, append at the end.
*/
export const AccentDangerColorList: string[] = ['#FFAE63'];

export const DefaultThemeConfig: ThemeInterface = {
  accent: AccentColorList[3],
  bg: BackgroundColorList[3],
  text: TextColorList[1],
  accentDanger: AccentDangerColorList[0],
  accentWarning: AccentWarningColorList[0]
};
