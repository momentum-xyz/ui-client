import {TextAlignType, TextSizeType, TextTransformType, TextWeightType} from '../types';
import {PropsWithThemeInterface} from '../interfaces';

export interface TextInterface extends PropsWithThemeInterface {
  text?: string;
  size: TextSizeType;
  transform?: TextTransformType;
  isMultiline?: boolean;
  align?: TextAlignType;
  weight?: TextWeightType;
  firstBoldSentences?: number;
  className?: string;
  noWrap?: boolean;
  breakLongWord?: boolean;
}
