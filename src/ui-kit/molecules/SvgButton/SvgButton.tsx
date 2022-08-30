import React, {FC, HTMLProps} from 'react';
import cn from 'classnames';

import {IconSvg, SizeType} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './SvgButton.styled';

interface PropsInterface
  extends PropsWithThemeInterface,
    Pick<HTMLProps<HTMLDivElement>, 'className'> {
  iconName: IconName;
  size: SizeType;
  onClick?: () => void;
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
    <styled.Container
      {...rest}
      name={iconName}
      onClick={onClick}
      disabled={disabled}
      data-testid="SvgButton-test"
    >
      <IconSvg
        name={iconName}
        theme={theme}
        size={size}
        isDanger={isDanger}
        isWhite={isWhite}
        className={cn('svg-icon', className)}
      />
      {children}
    </styled.Container>
  );
};

export default SvgButton;
