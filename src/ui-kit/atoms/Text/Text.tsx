import React, {FC, memo} from 'react';
import cn from 'classnames';

import {TextAlignType, TextSize, TextTransform, TextWeightType} from 'ui-kit/types';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';
import {splitIntoFirstNSentencesAndRest} from 'core/utils';

import * as styled from './Text.styled';

export interface TextPropsInterface extends PropsWithThemeInterface {
  text?: string;
  size: TextSize;
  transform?: TextTransform;
  isMultiline?: boolean;
  align?: TextAlignType;
  weight?: TextWeightType;
  isCustom?: boolean;
  firstBoldSentences?: number;
  className?: string;
}

const Text: FC<TextPropsInterface> = ({
  theme,
  text = '',
  size,
  align = 'center',
  transform = 'normal',
  isMultiline = true,
  isCustom = false,
  weight = 'normal',
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
          <styled.BoldSpan>{firstSentences.join()}</styled.BoldSpan>
          {restSentences.join()}
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
        isCustom && 'Text-custom',
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
