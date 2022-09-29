import React, {FC, HTMLProps, ReactNode} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from '../../interfaces';
import {SizeType} from '../../types';
import {IconSvg} from '../../atoms';

import * as styled from './SvgButton.styled';

export interface PropsInterface
  extends PropsWithThemeInterface,
    Pick<HTMLProps<HTMLDivElement>, 'className'> {
  iconName: IconNameType;
  size: SizeType;
  onClick?: () => void;
  isDanger?: boolean;
  isWhite?: boolean;
  disabled?: boolean;
  children?: ReactNode;
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
