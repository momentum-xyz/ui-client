import React, {FC, memo} from 'react';
import cn from 'classnames';

import {HeadingType, TextAlignType, TextTransform, TextWeightType} from 'ui-kit/types';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './Heading.styled';

interface HeadingProps extends PropsWithThemeInterface {
  type: HeadingType;
  label: string;
  isCustom?: boolean;
  transform?: TextTransform;
  isDanger?: boolean;
  align?: TextAlignType;
  weight?: TextWeightType;
}

const Heading: FC<HeadingProps> = (props) => {
  const {
    transform = 'normal',
    align = 'center',
    isCustom = false,
    weight = 'bold',
    isDanger = false,
    ...restProps
  } = props;

  const content = () => {
    switch (props.type) {
      case 'h1':
        return (
          <styled.H1 data-testid="Heading-H1-test" className={cn(transform)}>
            {restProps.label}
          </styled.H1>
        );
      case 'h2':
        return (
          <styled.H2 data-testid="Heading-H2-test" className={cn(transform)}>
            {restProps.label}
          </styled.H2>
        );
      case 'h3':
        return (
          <styled.H3 data-testid="Heading-H3-test" className={cn(transform)}>
            {restProps.label}
          </styled.H3>
        );
      case 'h4':
        return (
          <styled.H4 data-testid="Heading-H4-test" className={cn(transform)}>
            {restProps.label}
          </styled.H4>
        );
      case 'h5':
        return (
          <styled.H5 data-testid="Heading-H5-test" className={cn(transform)}>
            {restProps.label}
          </styled.H5>
        );
    }
  };

  return (
    <styled.Heading
      theme={restProps.theme}
      className={cn(align, weight, isCustom && 'Heading-custom', isDanger && 'danger')}
    >
      {content()}
    </styled.Heading>
  );
};

export default memo(Heading);
