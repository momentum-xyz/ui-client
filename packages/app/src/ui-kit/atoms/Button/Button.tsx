import React, {memo, MouseEventHandler, forwardRef} from 'react';
import cn from 'classnames';
import {TextTransformType, PropsWithThemeInterface} from '@momentum/ui-kit';
import {SizeType, VariantType} from 'ui-kit/types';

import * as styled from './Button.styled';

interface PropsInterface extends PropsWithThemeInterface {
  label: string;
  icon?: IconNameType;
  size?: SizeType;
  variant?: VariantType;
  transform?: TextTransformType;
  wide?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  submit?: boolean;
  noWhitespaceWrap?: boolean;
  className?: string;
  preserveSpaces?: boolean;
}

const Button = forwardRef<HTMLButtonElement, PropsInterface>((props, ref) => {
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
    noWhitespaceWrap = false,
    preserveSpaces = false,
    className
  } = props;

  return (
    <styled.Button
      ref={ref}
      data-testid="Button-test"
      theme={theme}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        variant,
        size,
        `transform-${transform}`,
        wide && 'wide',
        noWhitespaceWrap && 'noWhitespaceWrap',
        preserveSpaces && 'preservesSpaces',
        className
      )}
      type={submit ? 'submit' : 'button'}
    >
      {icon && <styled.Icon name={icon} size="normal" isDanger={variant === 'danger'} />}
      {label}
    </styled.Button>
  );
});

export default memo(Button);
