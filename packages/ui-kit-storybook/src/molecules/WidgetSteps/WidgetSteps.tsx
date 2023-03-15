import {FC, PropsWithChildren} from 'react';

import {Step, StepInterface} from '../../atoms';

import * as styled from './WidgetSteps.styled';

export interface WidgetStepsPropsInterface {
  stepList: StepInterface[];
}

const WidgetSteps: FC<PropsWithChildren<WidgetStepsPropsInterface>> = ({stepList, children}) => {
  return (
    <styled.Container data-testid="WidgetSteps-test">
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
    </styled.Container>
  );
};

export default WidgetSteps;
