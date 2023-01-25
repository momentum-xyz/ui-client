import React, {FC} from 'react';
import cn from 'classnames';

import * as styled from './CycleNumbered.styled';

interface PropsInterface {
  number: number;
  isActive?: boolean;
}

const CycleNumbered: FC<PropsInterface> = ({number, isActive}) => {
  return (
    <styled.Number>
      <styled.Inner className={cn(isActive && 'active')}>{number}</styled.Inner>
    </styled.Number>
  );
};

export default CycleNumbered;
