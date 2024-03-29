import {FC} from 'react';
import cn from 'classnames';
import {observer} from 'mobx-react-lite';
import {Button, ButtonPropsInterface} from '@momentum-xyz/ui-kit';

import * as styled from './CanvasButtonGroup.styled';

interface PropsInterface {
  isSingleButton?: boolean;
  backProps?: ButtonPropsInterface;
  nextProps?: ButtonPropsInterface;
}

const CanvasButtonGroup: FC<PropsInterface> = ({isSingleButton, backProps, nextProps}) => {
  return (
    <styled.StepActions
      className={cn(isSingleButton && 'single')}
      data-testid="CanvasButtonGroup-test"
    >
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
