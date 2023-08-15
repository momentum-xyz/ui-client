import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, ButtonPropsInterface} from '@momentum-xyz/ui-kit';

import * as styled from './CanvasButtonGroup.styled';

interface PropsInterface {
  backProps?: ButtonPropsInterface;
  nextProps?: ButtonPropsInterface;
}

const CanvasButtonGroup: FC<PropsInterface> = ({backProps, nextProps}) => {
  return (
    <styled.StepActions data-testid="CanvasButtonGroup-test">
      <styled.StepAction>
        {!!backProps && <Button {...backProps} wide variant="secondary" />}
      </styled.StepAction>
      <styled.StepAction>
        {!!nextProps && <Button {...nextProps} wide variant="secondary" />}
      </styled.StepAction>
    </styled.StepActions>
  );
};

export default observer(CanvasButtonGroup);
