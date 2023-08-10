import {FC, memo, useEffect, useState} from 'react';

import svgLogo from '../../static/images/rabbit_jumping.svg';

import * as styled from './ProgressBar.styled';

export interface ProgressBarPropsInterface {
  percent?: number;
  simulateProgress?: boolean;
  withLogo?: boolean;
}

const SIMULATED_PROGRESS_RATE = 120;
const SIMULATED_PROGRESS_MAX_TARGET = 95;

const ProgressBar: FC<ProgressBarPropsInterface> = (props) => {
  const {percent, simulateProgress = false, withLogo = false} = props;

  const [simulatedProgress, setSimulatedProgress] = useState(0);
  useEffect(() => {
    if (!simulateProgress) {
      return;
    }
    const interval = setInterval(() => {
      setSimulatedProgress(
        (prev) => prev + (SIMULATED_PROGRESS_MAX_TARGET - prev) / SIMULATED_PROGRESS_RATE
      );
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [simulateProgress]);

  return (
    <styled.Container>
      {!!withLogo && <styled.Logo src={svgLogo} alt="progress bar logo" />}
      <styled.ProgressBar data-testid="ProgressBar-test">
        <styled.BarLine style={{width: `${percent ?? simulatedProgress}%`}} />
      </styled.ProgressBar>
    </styled.Container>
  );
};

export default memo(ProgressBar);
