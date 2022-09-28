import React, {FC, memo} from 'react';
import cn from 'classnames';

import {HeadingType, TextAlignType, TextTransformType, TextWeightType} from '../../types';
import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './Heading.styled';

interface PropsInterface extends PropsWithThemeInterface {
  type: HeadingType;
  label: string;
  transform?: TextTransformType;
  isDanger?: boolean;
  align?: TextAlignType;
  weight?: TextWeightType;
  className?: string;
  isTruncate?: boolean;
}

const Heading: FC<PropsInterface> = (props) => {
  const {
    transform = 'normal',
    align = 'center',
    weight = 'bold',
    isDanger = false,
    className,
    isTruncate = false,
    ...restProps
  } = props;

  const content = () => {
    switch (props.type) {
      case 'h1':
        return (
          <styled.H1
            data-testid="Heading-H1-test"
            className={cn(transform, isTruncate && 'text-truncate')}
          >
            {restProps.label}
          </styled.H1>
        );
      case 'h2':
        return (
          <styled.H2
            data-testid="Heading-H2-test"
            className={cn(transform, isTruncate && 'text-truncate')}
          >
            {restProps.label}
          </styled.H2>
        );
      case 'h3':
        return (
          <styled.H3
            data-testid="Heading-H3-test"
            className={cn(transform, isTruncate && 'text-truncate')}
          >
            {restProps.label}
          </styled.H3>
        );
      case 'h4':
        return (
          <styled.H4
            data-testid="Heading-H4-test"
            className={cn(transform, isTruncate && 'text-truncate')}
          >
            {restProps.label}
          </styled.H4>
        );
      case 'h5':
        return (
          <styled.H5
            data-testid="Heading-H5-test"
            className={cn(transform, isTruncate && 'text-truncate')}
          >
            {restProps.label}
          </styled.H5>
        );
    }
  };

  return (
    <styled.Heading
      theme={restProps.theme}
      className={cn(align, weight, isDanger && 'danger', className)}
    >
      {content()}
    </styled.Heading>
  );
};

export default memo(Heading);
