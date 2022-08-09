import React, {FC, memo} from 'react';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './ProgressBar.styled';

interface PropsInterface extends PropsWithThemeInterface {
  percent: number;
}

const ProgressBar: FC<PropsInterface> = (props) => {
  const {percent} = props;
  return (
    <styled.ProgressBar data-testid="ProgressBar-test">
      <styled.BarLine style={{width: `${percent}%`}} />
    </styled.ProgressBar>
  );
};

export default memo(ProgressBar);
