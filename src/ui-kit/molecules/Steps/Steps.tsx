import React, {FC} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './Steps.styled';

interface PropsInterface extends PropsWithThemeInterface {
  currentStep?: number;
  steps: string[];
}

const Steps: FC<PropsInterface> = ({currentStep, steps}) => {
  return (
    <styled.Container data-testid="Steps-test">
      {steps.map((step, index) => (
        <styled.StepContainerWrapper key={step}>
          <styled.StepContainer>
            <styled.Step className={cn(currentStep && index < currentStep && 'completed')}>
              {currentStep === index && <styled.SelectedFill />}
              {!!currentStep && index < currentStep && index + 1}
            </styled.Step>
            <styled.Label label={step} type="h3" />
          </styled.StepContainer>
          {index < steps.length - 1 && (
            <styled.LinkingLine className={cn(currentStep && index < currentStep && 'completed')} />
          )}
        </styled.StepContainerWrapper>
      ))}
    </styled.Container>
  );
};

export default Steps;
