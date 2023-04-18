import {Step} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './Steps.styled';

export interface StepInterface<T> {
  id: T;
  icon?: IconNameType;
  label?: string;
  variant?: 'active' | 'next' | 'prev';
}

export interface StepsPropsInterface<T> {
  stepList: StepInterface<T>[];
}

const Steps = <T,>({stepList}: StepsPropsInterface<T>) => {
  return (
    <styled.Steps data-testid="Steps-test">
      {stepList.map((stepItem, index) => (
        <Step key={index} icon={stepItem.icon} label={stepItem.label} variant={stepItem.variant} />
      ))}
    </styled.Steps>
  );
};

export default Steps;
