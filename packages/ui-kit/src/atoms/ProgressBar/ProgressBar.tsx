import {FC, memo} from 'react';

import * as styled from './ProgressBar.styled';

export interface ProgressBarPropsInterface {
  percent: number;
}

const ProgressBar: FC<ProgressBarPropsInterface> = (props) => {
  const {percent} = props;
  return (
    <styled.ProgressBar data-testid="ProgressBar-test">
      <styled.BarLine style={{width: `${percent}%`}} />
    </styled.ProgressBar>
  );
};

export default memo(ProgressBar);
