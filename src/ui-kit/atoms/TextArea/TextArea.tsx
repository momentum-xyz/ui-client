import React, {forwardRef, HTMLProps} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from 'ui-kit';

import * as styled from './TextArea.styled';

interface PropsInterface
  extends PropsWithThemeInterface,
    Omit<HTMLProps<HTMLTextAreaElement>, 'onChange'> {
  name: string;
  placeholder?: string;
  selected?: boolean;
  disabled?: boolean;
  onChange?: (text: string) => void;
  value?: string;
  lines?: number;
  lineLength?: number;
  isResizable?: boolean;
  isError?: boolean;
  errorMessage?: string;
  bottomBorder?: boolean;
  className?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, PropsInterface>((props, ref) => {
  const {
    theme,
    name,
    placeholder,
    disabled = false,
    onChange,
    value,
    selected = false,
    lines = 4,
    lineLength,
    isResizable = false,
    isError = false,
    bottomBorder = false,
    errorMessage,
    className,
    ...restProps
  } = props;

  return (
    <styled.Container className={className} data-testid="TextArea-test">
      <styled.Label type="h4" align="left" theme={theme} label={name} transform="uppercase" />
      <styled.TextAreaContainer
        theme={theme}
        className={cn(
          selected && 'highlighted',
          isResizable && 'resizable',
          bottomBorder && 'bottomBorder'
        )}
      >
        <textarea
          {...restProps}
          placeholder={placeholder}
          name={name}
          disabled={disabled}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          cols={lineLength}
          rows={lines}
          className={cn(isError && 'error')}
          ref={ref}
        />
        <styled.ErrorMessage className={cn(!isError && 'none')}>{errorMessage}</styled.ErrorMessage>
      </styled.TextAreaContainer>
    </styled.Container>
  );
});

export default TextArea;
