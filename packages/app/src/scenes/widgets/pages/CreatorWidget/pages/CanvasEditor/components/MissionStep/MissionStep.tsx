import {FC, ReactElement, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';

import * as styled from './MissionStep.styled';

interface PropsInterface {
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
}

const MissionStep: FC<PropsInterface> = ({onRenderActions, setActiveStep}) => {
  const {t} = useI18n();

  const onCreateEntry = useCallback(() => {
    // TODO
    setActiveStep('questions');
  }, [setActiveStep]);

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        backProps={{
          label: t('actions.back'),
          onClick: () => setActiveStep('intro')
        }}
        nextProps={{
          icon: 'rocket',
          label: 'Create an entry',
          onClick: onCreateEntry
        }}
      />
    );
  }, [onCreateEntry, onRenderActions, setActiveStep, t]);

  return <styled.Container data-testid="MissionStep-test">Step 2</styled.Container>;
};

export default observer(MissionStep);
