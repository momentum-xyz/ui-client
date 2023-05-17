import {FC} from 'react';
import cn from 'classnames';

import {IconSvg} from '../IconSvg';

import * as styled from './Warning.styled';

export interface WarningPropsInterface {
  message: string;
  wide?: boolean;
}

const Warning: FC<WarningPropsInterface> = ({message, wide = true}) => {
  return (
    <styled.Container data-testid="Warning-test" className={cn(wide && 'wide')}>
      <IconSvg name="alert" isWhite />
      <span>{message}</span>
    </styled.Container>
  );
};

export default Warning;
