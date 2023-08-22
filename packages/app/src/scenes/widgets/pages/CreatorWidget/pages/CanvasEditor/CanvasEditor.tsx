import {FC, ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Frame, Panel, Steps, StepInterface} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {CanvasStepType} from 'core/types';

import {
  IntroStep,
  MissionStep,
  OverviewStep,
  QuestionsStep,
  ScriptStep,
  TeamworkScriptStep
} from './components';
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
  const {widgetStore, universeStore} = useStore();
  const {creatorStore} = widgetStore;
  const {canvasEditorStore} = creatorStore;
  const {worldId, world3dStore} = universeStore;

  const canvasRef = useRef<HTMLDivElement>(null);
  const [stepActions, setStepActions] = useState<ReactElement>();
  const [activeStep, setActiveStep] = useState<CanvasStepType>('intro');

  const {t} = useI18n();

  useEffect(() => {
    canvasEditorStore.setCreated(new Date().toISOString());
    canvasEditorStore.load(worldId);

    return () => {
      canvasEditorStore.resetModel();
    };
  }, [canvasEditorStore, worldId]);

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
              <IntroStep
                isNewCanvas={!canvasEditorStore.canvasObjectId}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
                onDelete={async () => {
                  if (await canvasEditorStore.delete()) {
                    onClose();
                  }
                }}
              />
            )}

            {activeStep === 'mission' && (
              <MissionStep
                isNewCanvas={!canvasEditorStore.canvasObjectId}
                missionData={canvasEditorStore.missionData}
                onUpdate={canvasEditorStore.setMissionData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'questions' && (
              <QuestionsStep
                isNewCanvas={!canvasEditorStore.canvasObjectId}
                questionsData={canvasEditorStore.questionsData}
                onUpdate={canvasEditorStore.setQuestionsData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'script' && (
              <ScriptStep
                isNewCanvas={!canvasEditorStore.canvasObjectId}
                leonardoCosts={canvasEditorStore.leonardoCosts}
                scriptData={canvasEditorStore.scriptData}
                onUpdate={canvasEditorStore.setScriptData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'teamworkScript' && (
              <TeamworkScriptStep
                isNewCanvas={!canvasEditorStore.canvasObjectId}
                chatGPTCosts={canvasEditorStore.chatGPTCosts}
                teamworkScriptData={canvasEditorStore.teamworkScriptData}
                onUpdate={canvasEditorStore.setTeamworkScriptData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'overview' && (
              <OverviewStep
                isNewCanvas={!canvasEditorStore.canvasObjectId}
                version={canvasEditorStore.version}
                created={canvasEditorStore.created}
                missionTitle={canvasEditorStore.missionData.missionTitle}
                chatGPTCosts={canvasEditorStore.chatGPTCosts}
                leonardoCosts={canvasEditorStore.leonardoCosts}
                isLeonardo={canvasEditorStore.scriptData.isLeonardo}
                isChatGPT={canvasEditorStore.teamworkScriptData.isChatGPT}
                contributionAmount={canvasEditorStore.contributionAmount}
                setContributionAmount={canvasEditorStore.setContributionAmount}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
                onSpawnAndSubmit={() => canvasEditorStore.spawnAndSubmit(worldId)}
                onSpawned={() => {
                  world3dStore?.setAttachedToCamera(null);
                  onClose();
                }}
              />
            )}
          </Frame>
        </styled.StepContent>
      </styled.Container>
    </Panel>
  );
};

export default observer(CanvasEditor);
