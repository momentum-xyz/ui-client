import {FC, memo} from 'react';

import svgLogo from '../../static/images/rabbit_jumping.svg';

import * as styled from './ProgressBar.styled';

export interface ProgressBarPropsInterface {
  percent: number;
  withLogo?: boolean;
}

const ProgressBar: FC<ProgressBarPropsInterface> = (props) => {
  const {percent, withLogo = false} = props;
  return (
    <styled.Container>
      {!!withLogo && <styled.Logo src={svgLogo} alt="progress bar logo" />}
      <styled.ProgressBar data-testid="ProgressBar-test">
        <styled.BarLine style={{width: `${percent}%`}} />
      </styled.ProgressBar>
    </styled.Container>
  );
};

export default memo(ProgressBar);
