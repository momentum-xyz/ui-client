import React, {FC} from 'react';
import cn from 'classnames';

import {VariantType} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './ValueContainer.styled';

interface PropsInterface extends PropsWithThemeInterface {
  variant: VariantType;
  onClick: () => void;
  isDisabled?: boolean;
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
