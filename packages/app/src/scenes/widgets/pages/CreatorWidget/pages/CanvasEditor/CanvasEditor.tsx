import {FC, ReactElement, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Frame, Panel, Steps, StepInterface} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {CanvasStepType} from 'core/types';

import {IntroStep, MissionStep} from './components';
import * as styled from './CanvasEditor.styled';

interface PropsInterface {
  onClose: () => void;
}

const STEP_LIST: StepInterface<CanvasStepType>[] = [
  {id: 'intro', label: '1'},
  {id: 'mission', label: '2'},
  {id: 'questions', label: '3'},
  {id: 'script', label: '4'},
  {id: 'teamwork', label: '5'},
  {id: 'overview', label: '6'}
];

const CanvasEditor: FC<PropsInterface> = ({onClose}) => {
  const {widgetStore} = useStore();
  const {creatorStore} = widgetStore;
  const {canvasEditorStore} = creatorStore;

  const [stepActions, setStepActions] = useState<ReactElement>();
  const [activeStep, setActiveStep] = useState<CanvasStepType>('intro');

  const {t} = useI18n();

  useEffect(() => {
    return () => {
      canvasEditorStore.resetModel();
    };
  }, [canvasEditorStore]);

  return (
    <Panel
      icon="idea"
      isFullHeight
      size="large"
      variant="primary"
      title={t('labels.canvasEditor')}
      bottomComponent={stepActions}
      onClose={onClose}
    >
      <styled.Container data-testid="CanvasEditor-test">
        <styled.Steps>
          <Steps
            stepList={STEP_LIST.map((step) => ({
              variant: step.id === activeStep ? 'active' : 'prev',
              ...step
            }))}
          />
        </styled.Steps>

        <styled.StepContent>
          <Frame>
            {activeStep === 'intro' && (
              <IntroStep setActiveStep={setActiveStep} onRenderActions={setStepActions} />
            )}

            {activeStep === 'mission' && (
              <MissionStep
                missionData={canvasEditorStore.missionData}
                onUpdate={canvasEditorStore.setMissionData}
                setActiveStep={setActiveStep}
                onRenderActions={setStepActions}
              />
            )}
          </Frame>
        </styled.StepContent>
      </styled.Container>
    </Panel>
  );
};

export default observer(CanvasEditor);
