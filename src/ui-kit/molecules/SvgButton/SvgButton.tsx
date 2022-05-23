import React, {FC, HTMLProps} from 'react';

import {IconSvg, SizeType} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './SvgButton.styled';

interface PropsInterface
  extends PropsWithThemeInterface,
    Pick<HTMLProps<HTMLDivElement>, 'className'> {
  iconName: IconName;
  size: SizeType;
  onClick?: (event?: Event) => void;
  isDanger?: boolean;
  isWhite?: boolean;
}

const SvgButton: FC<PropsInterface> = ({
  theme,
  onClick,
  isDanger,
  size,
  iconName,
  isWhite = false,
  className
}) => {
  return (
    // @ts-ignore: div doesn't have onClick
    <styled.Container onClick={onClick}>
      <IconSvg
        name={iconName}
        theme={theme}
        size={size}
        isCustom
        isDanger={isDanger}
        isWhite={isWhite}
        className={className}
      />
    </styled.Container>
  );
};

export default SvgButton;
