import {FC, PropsWithChildren} from 'react';

import {Step, StepInterface} from '../../atoms';

import * as styled from './FrameSteps.styled';

export interface FrameStepsPropsInterface {
  stepList: StepInterface[];
}

const FrameSteps: FC<PropsWithChildren<FrameStepsPropsInterface>> = ({stepList, children}) => {
  return (
    <styled.Container data-testid="FrameSteps-test">
      <styled.Inner>
        <styled.Steps>
          {stepList.map((stepItem, index) => (
            <Step
              key={index}
              icon={stepItem.icon}
              label={stepItem.label}
              variant={stepItem.variant}
            />
          ))}
        </styled.Steps>
        {children}
      </styled.Inner>
    </styled.Container>
  );
};

export default FrameSteps;
