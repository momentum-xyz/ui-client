import {FC, memo} from 'react';
import cn from 'classnames';

import * as styled from './Textarea.styled';

export interface TextareaPropsInterface {
  name?: string;
  size?: 'normal';
  value?: string | null;
  placeholder?: string;
  lines?: number;
  lineLength?: number;
  disabled?: boolean;
  danger?: boolean;
  isResizable?: boolean;
  onChange: (value: string) => void;
}

const Textarea: FC<TextareaPropsInterface> = ({
  name,
  size = 'normal',
  value,
  placeholder,
  lines = 3,
  lineLength,
  disabled,
  danger,
  isResizable,
  onChange
}) => {
  return (
    <styled.Container data-testid="Textarea-test">
      <textarea
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        value={value || ''}
        onChange={(event) => onChange?.(event.target.value)}
        cols={lineLength}
        rows={lines}
        className={cn(size, !isResizable && 'disableResize', danger && 'danger')}
      />
    </styled.Container>
  );
};

export default memo(Textarea);
