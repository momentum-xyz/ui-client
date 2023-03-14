import {FC, memo} from 'react';

import IconSvg, {IconSvgPropsInterface} from '../IconSvg/IconSvg';

import * as styled from './IconButton.styled';

export interface IconButtonPropsInterface extends IconSvgPropsInterface {
  onClick?: () => void;
}

const IconButton: FC<IconButtonPropsInterface> = ({onClick, ...rest}) => {
  return (
    <styled.Button data-testid="IconButton-test" type="button" onClick={onClick}>
      <IconSvg {...rest} />
    </styled.Button>
  );
};

export default memo(IconButton);
