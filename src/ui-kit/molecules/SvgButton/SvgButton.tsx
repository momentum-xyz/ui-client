import React, {FC} from 'react';

import {IconSvg, SizeType} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './SvgButton.styled';

interface PropsInterface extends PropsWithThemeInterface {
  iconName: IconName;
  size: SizeType;
  onClick?: (event?) => void;
  isDanger?: boolean;
  isWhite?: boolean;
}

const SvgButton: FC<PropsInterface> = ({
  theme,
  onClick,
  isDanger,
  size,
  iconName,
  isWhite = false
}) => {
  return (
    <styled.Container onClick={onClick}>
      <IconSvg
        name={iconName}
        theme={theme}
        size={size}
        isCustom
        isDanger={isDanger}
        isWhite={isWhite}
      />
    </styled.Container>
  );
};

export default SvgButton;
