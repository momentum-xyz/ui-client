import React, {FC} from 'react';

import {VariantType} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './ValueContainer.styled';

interface PropsInterface extends PropsWithThemeInterface {
  variant: VariantType;
  onClick: () => void;
}

const ValueContainer: FC<PropsInterface> = (props) => {
  const {theme, variant, onClick, children} = props;
  return (
    <styled.Container theme={theme} className={`${variant}`} onClick={onClick}>
      {children}
    </styled.Container>
  );
};

export default ValueContainer;
