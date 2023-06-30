import {FC, useState} from 'react';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './TextCut.styled';

const DEFAULT_CHAR_LIMIT = 130;

export interface TextCutPropsInterface {
  text: string;
  charLimit?: number;
  lines?: number;
}

const TextCut: FC<TextCutPropsInterface> = ({text, charLimit = DEFAULT_CHAR_LIMIT, lines = 0}) => {
  const {t} = useI18n();

  const textIsTooLong = text && text.length > charLimit;
  const slicedText = textIsTooLong ? `${text?.slice(0, charLimit)}...` : text;

  const [showFullText, setShowFullText] = useState(false);

  return (
    <styled.Container data-testid="TextCut-test">
      <styled.Text lines={lines}>{showFullText ? text : slicedText}</styled.Text>
      {textIsTooLong && (
        <styled.Link onClick={() => setShowFullText(!showFullText)}>
          {showFullText ? t('labels.readLess') : t('labels.readMore')}
        </styled.Link>
      )}
    </styled.Container>
  );
};

export default TextCut;
