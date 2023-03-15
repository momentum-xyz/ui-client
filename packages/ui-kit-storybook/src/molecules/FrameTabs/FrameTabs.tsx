import {FC, PropsWithChildren} from 'react';

import {ButtonEllipse, StepInterface} from '../../atoms';

import * as styled from './FrameTabs.styled';

export interface FrameTabsPropsInterface {
  stepList: StepInterface[];
}

const FrameTabs: FC<PropsWithChildren<FrameTabsPropsInterface>> = ({stepList, children}) => {
  return (
    <styled.Container data-testid="FrameTabs-test">
      <styled.Inner>
        <styled.Steps>
          {stepList.map((stepItem, index) => (
            <ButtonEllipse key={index} icon="planet" label="Latest" />
          ))}
        </styled.Steps>
        {children}
      </styled.Inner>
    </styled.Container>
  );
};

export default FrameTabs;
