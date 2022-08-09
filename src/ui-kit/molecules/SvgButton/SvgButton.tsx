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
  disabled?: boolean;
}

const SvgButton: FC<PropsInterface> = ({
  children,
  theme,
  onClick,
  isDanger,
  size,
  iconName,
  className,
  isWhite = false,
  disabled = false,
  ...rest
}) => {
  return (
    // @ts-ignore: div doesn't have onClick
    <styled.Container {...rest} onClick={onClick} disabled={disabled} data-testid="SvgButton-test">
      <IconSvg
        name={iconName}
        theme={theme}
        size={size}
        isCustom
        isDanger={isDanger}
        isWhite={isWhite}
        className={className}
      />
      {children}
    </styled.Container>
  );
};

export default SvgButton;
