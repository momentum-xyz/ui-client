import React, {FC, memo, TextareaHTMLAttributes} from 'react';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './TextAreaDark.styled';

interface PropsInterface extends PropsWithThemeInterface {
  onChange?: (value: string) => void;
}

type PropsType = PropsInterface & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>;

const ROWS_COUNT_DEFAULT = 4;

const TextAreaDark: FC<PropsType> = (props) => {
  const {onChange, rows = ROWS_COUNT_DEFAULT, ...rest} = props;
  return (
    <styled.TextAreaContainer data-testid="TextArea-test">
      <textarea {...rest} rows={rows} onChange={(event) => onChange?.(event.target.value)} />
    </styled.TextAreaContainer>
  );
};

export default memo(TextAreaDark);
