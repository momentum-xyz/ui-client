import React, {FC, memo} from 'react';
import cn from 'classnames';

import {TextAlignType, TextSize, TextTransform, TextWeightType} from 'ui-kit/types';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './Text.styled';

export interface TextProps extends PropsWithThemeInterface {
  text?: string;
  size: TextSize;
  transform?: TextTransform;
  isMultiline?: boolean;
  align?: TextAlignType;
  weight?: TextWeightType;
  isCustom?: boolean;
  firstBoldSentences?: number;
}

const Text: FC<TextProps> = ({
  theme,
  text = '',
  size,
  align = 'center',
  transform = 'normal',
  isMultiline = true,
  isCustom = false,
  weight = 'normal',
  firstBoldSentences
}) => {
  const generateText = () => {
    if (firstBoldSentences && text) {
      return text.match(/[^.?!]+[.!?]+[\])'"`’”]*|.+/g)?.map((sentence, index) => {
        if (index < firstBoldSentences) {
          return <styled.BoldSpan>{sentence}</styled.BoldSpan>;
        }

        return sentence;
      });
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
        `weight-${weight}`
      )}
      theme={theme}
    >
      {generateText()}
    </styled.Text>
  );
};

export default memo(Text);
