import {FC, memo} from 'react';
import cn from 'classnames';

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
      className={cn(isDisabled && 'disabled')}
      data-testid="IconButton-test"
    >
      <IconSvg isDisabled={isDisabled} {...rest} />
    </styled.Button>
  );
};

export default memo(IconButton);
