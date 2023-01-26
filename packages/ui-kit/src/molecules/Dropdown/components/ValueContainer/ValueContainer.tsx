import React, {FC, ReactNode} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from '../../../../interfaces';
import {VariantType} from '../../../../types';

import * as styled from './ValueContainer.styled';

interface PropsInterface extends PropsWithThemeInterface {
  variant: VariantType;
  onClick: () => void;
  isDisabled?: boolean;
  children?: ReactNode;
}

const ValueContainer: FC<PropsInterface> = (props) => {
  const {theme, variant, isDisabled, onClick, children} = props;
  return (
    <styled.Container
      theme={theme}
      className={cn(`${variant}`, isDisabled && 'disabled')}
      onClick={onClick}
    >
      {children}
    </styled.Container>
  );
};

export default ValueContainer;
