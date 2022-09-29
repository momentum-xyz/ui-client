import React, {FC, memo} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from '../../interfaces';
import {TextAlignType, TextTransformType, TextWeightType, TextSizeType} from '../../types';
import {splitIntoFirstNSentencesAndRest} from '../../utils';

import * as styled from './Text.styled';

export interface TextPropsInterface extends PropsWithThemeInterface {
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

const Text: FC<TextPropsInterface> = ({
  theme,
  text = '',
  size,
  align = 'center',
  transform = 'normal',
  isMultiline = true,
  weight = 'normal',
  noWrap = false,
  breakLongWord = false,
  firstBoldSentences,
  className
}) => {
  const generateText = () => {
    if (firstBoldSentences && text) {
      const [firstSentences, restSentences] = splitIntoFirstNSentencesAndRest(
        text,
        firstBoldSentences
      );

      return (
        <>
          <styled.BoldSpan>{firstSentences.join('')}</styled.BoldSpan>
          {restSentences.join('')}
        </>
      );
    }

    return text;
  };

  return (
    <styled.Text
      data-testid="Text-test"
      className={cn(
        size,
        `transform-${transform}`,
        !isMultiline && 'singleLine',
        align,
        noWrap && 'noWrap',
        breakLongWord && 'breakLongWord',
        `weight-${weight}`,
        className
      )}
      theme={theme}
    >
      {generateText()}
    </styled.Text>
  );
};

export default memo(Text);
