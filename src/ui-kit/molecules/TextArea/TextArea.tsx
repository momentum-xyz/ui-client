import React, {FC, HTMLProps} from 'react';
import cn from 'classnames';

import {Heading, PropsWithThemeInterface} from 'ui-kit';

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
  isCustom?: boolean;
  isResizable?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const TextArea: FC<PropsInterface> = ({
  theme,
  name,
  placeholder,
  disabled = false,
  onChange,
  value,
  selected = false,
  lines = 3,
  lineLength,
  isCustom = false,
  isResizable = false,
  isError = false,
  errorMessage,
  ...restProps
}) => {
  return (
    <styled.Container className={cn(isCustom && 'TextArea-custom')}>
      <Heading type="h4" align="left" theme={theme} label={name} transform="uppercase" isCustom />
      <styled.TextAreaContainer
        theme={theme}
        className={cn(selected && 'highlighted', isResizable && 'resizable')}
      >
        <textarea
          placeholder={placeholder}
          name={name}
          disabled={disabled}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          cols={lineLength}
          rows={lines}
          className={cn(isError && 'error')}
          {...restProps}
        />
        <styled.ErrorMessage className={cn(!isError && 'none')}>{errorMessage}</styled.ErrorMessage>
      </styled.TextAreaContainer>
    </styled.Container>
  );
};

export default TextArea;
