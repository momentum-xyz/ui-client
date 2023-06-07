import {FC, memo} from 'react';

import IconSvg, {IconSvgPropsInterface} from '../IconSvg/IconSvg';

import * as styled from './IconButton.styled';

export interface IconButtonPropsInterface extends IconSvgPropsInterface {
  onClick?: () => void;
}

const IconButton: FC<IconButtonPropsInterface> = ({onClick, isDisabled, ...rest}) => {
  return (
    <styled.Button
      type="button"
      onClick={!isDisabled ? onClick : undefined}
      data-testid="IconButton-test"
    >
      <IconSvg isDisabled={isDisabled} {...rest} />
    </styled.Button>
  );
};

export default memo(IconButton);
