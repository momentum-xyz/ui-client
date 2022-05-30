import React, {FC, HTMLProps, memo, MouseEventHandler} from 'react';
import cn from 'classnames';

import {SizeType, TextTransform, VariantType} from 'ui-kit/types';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';
import {IconSvg} from 'ui-kit';

import * as styled from './Button.styled';

interface PropsInterface
  extends PropsWithThemeInterface,
    Pick<HTMLProps<HTMLButtonElement>, 'className'> {
  label: string;
  icon?: IconName;
  size?: SizeType;
  variant?: VariantType;
  transform?: TextTransform;
  wide?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  submit?: boolean;
  isCustom?: boolean;
  noWhitespaceWrap?: boolean;
  withBackground?: boolean;
}

const Button: FC<PropsInterface> = (props) => {
  const {
    variant = 'primary',
    size = 'normal',
    wide,
    label,
    submit = false,
    theme,
    transform = 'uppercase',
    disabled,
    onClick,
    icon,
    isCustom = false,
    noWhitespaceWrap = false,
    withBackground = false,
    className
  } = props;

  return (
    <styled.Button
      data-testid="Button-test"
      theme={theme}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        variant,
        size,
        `transform-${transform}`,
        wide && 'wide',
        isCustom && 'Button-custom',
        noWhitespaceWrap && 'noWhitespaceWrap',
        withBackground && 'withBackground',
        className
      )}
      type={submit ? 'submit' : 'button'}
    >
      {icon && <IconSvg name={icon} size="normal" isCustom isDanger={variant === 'danger'} />}
      {label}
    </styled.Button>
  );
};

export default memo(Button);
