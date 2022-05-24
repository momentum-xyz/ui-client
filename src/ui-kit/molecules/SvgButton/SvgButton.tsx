import React, {FC} from 'react';

import {IconSvg, SizeType} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './SvgButton.styled';

interface PropsInterface extends PropsWithThemeInterface {
  iconName: IconName;
  size: SizeType;
  onClick?: (event?: Event) => void;
  isDanger?: boolean;
  isWhite?: boolean;
  disabled?: boolean;
}

const SvgButton: FC<PropsInterface> = ({
  theme,
  onClick,
  isDanger,
  size,
  iconName,
  isWhite = false,
  disabled = false
}) => {
  return (
    // @ts-ignore: div doesn't have onClick
    <styled.Container onClick={onClick} disabled={disabled}>
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
