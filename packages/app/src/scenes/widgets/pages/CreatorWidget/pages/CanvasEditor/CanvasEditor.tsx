import {FC, ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Frame, Panel, Steps, StepInterface} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {CanvasStepType} from 'core/types';

import {IntroStep, MissionStep, QuestionsStep, ScriptStep, TeamworkScriptStep} from './components';
import * as styled from './CanvasEditor.styled';

interface PropsInterface {
  onClose: () => void;
}

const STEP_LIST: StepInterface<CanvasStepType>[] = [
  {id: 'intro', label: '1'},
  {id: 'mission', label: '2'},
  {id: 'questions', label: '3'},
  {id: 'script', label: '4'},
  {id: 'teamworkScript', label: '5'},
  {id: 'overview', label: '6'}
];

const CanvasEditor: FC<PropsInterface> = ({onClose}) => {
  const {widgetStore} = useStore();
  const {creatorStore} = widgetStore;
  const {canvasEditorStore} = creatorStore;

  const canvasRef = useRef<HTMLDivElement>(null);
  const [stepActions, setStepActions] = useState<ReactElement>();
  const [activeStep, setActiveStep] = useState<CanvasStepType>('intro');

  const {t} = useI18n();

  useEffect(() => {
    return () => {
      canvasEditorStore.resetModel();
    };
  }, [canvasEditorStore]);

  const handleSetActiveStep = useCallback((stepType: CanvasStepType) => {
    setActiveStep(stepType);

    // Reset the scroll position during step changes
    if (canvasRef.current?.parentElement) {
      canvasRef.current.parentElement.scrollTop = 0;
    }
  }, []);

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
      <styled.Container ref={canvasRef} data-testid="CanvasEditor-test">
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
              <IntroStep setActiveStep={handleSetActiveStep} onRenderActions={setStepActions} />
            )}

            {activeStep === 'mission' && (
              <MissionStep
                missionData={canvasEditorStore.missionData}
                onUpdate={canvasEditorStore.setMissionData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'questions' && (
              <QuestionsStep
                questionsData={canvasEditorStore.questionsData}
                onUpdate={canvasEditorStore.setQuestionsData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'script' && (
              <ScriptStep
                aiCreditsCount={20}
                scriptData={canvasEditorStore.scriptData}
                onUpdate={canvasEditorStore.setScriptData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'teamworkScript' && (
              <TeamworkScriptStep
                aiCreditsCount={12}
                teamworkScriptData={canvasEditorStore.teamworkScriptData}
                onUpdate={canvasEditorStore.setTeamworkScriptData}
                setActiveStep={handleSetActiveStep}
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
