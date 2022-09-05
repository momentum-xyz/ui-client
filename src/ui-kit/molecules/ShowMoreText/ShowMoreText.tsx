import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import cn from 'classnames';
import {t} from 'i18next';
import debounce from 'lodash/debounce';

import {TextAlignType, TextSizeType, TextTransformType, TextWeightType} from 'ui-kit/types';
import {Text} from 'ui-kit';
import {useResize} from 'ui-kit/hooks';

import * as styled from './ShowMoreText.styled';

interface TextPropsInterface {
  size: TextSizeType;
  transform?: TextTransformType;
  isMultiline?: boolean;
  align?: TextAlignType;
  weight?: TextWeightType;
  firstBoldSentences?: number;
}

interface PropsInterface {
  text: string;
  textProps: TextPropsInterface;
  lines?: number;
}

const ShowMoreText: FC<PropsInterface> = ({text, textProps, lines = 4}) => {
  const [showExpand, setShowExpand] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const hasClamping = (el: HTMLDivElement) => {
    const {clientHeight, scrollHeight} = el;
    return clientHeight < scrollHeight;
  };

  const checkButtonAvailability = useCallback(() => {
    if (ref.current) {
      setShowExpand(hasClamping(ref.current));
    }
  }, [ref]);

  const debouncedCheck = debounce(checkButtonAvailability, 50);

  useEffect(() => {
    checkButtonAvailability();
  }, [checkButtonAvailability]);

  useResize(ref, () => {
    debouncedCheck();
  });

  return (
    <styled.Container data-testid="ShowMoreText-test">
      <styled.Text className={cn(collapsed && 'collapsed')} ref={ref} lines={lines}>
        <Text text={text} {...textProps} />
      </styled.Text>
      {showExpand && (
        <styled.More
          className={cn(collapsed && 'collapsed')}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Text
            text={collapsed ? t('eventList.eventItem.showMore') : t('eventList.eventItem.collapse')}
            align="left"
            size="xs"
          />
          <styled.MoreTextButton iconName="chevron" size="small" />
        </styled.More>
      )}
    </styled.Container>
  );
};

export default ShowMoreText;
