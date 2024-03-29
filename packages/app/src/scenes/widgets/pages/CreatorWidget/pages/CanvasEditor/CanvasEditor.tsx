import {FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Event3dEmitter, useI18n} from '@momentum-xyz/core';
import {Frame, Panel, Steps, StepInterface, IconNameType} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {CanvasStepType} from 'core/types';
import {isAIProviderEnabled} from 'api/constants';
import {AIProvidersFlagEnum} from 'api/enums';

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

export interface CanvasStepInterface<T> extends StepInterface<T> {
  stepIcon?: IconNameType;
  stepTitle?: string;
  stepLabel?: string;
}

const CanvasEditor: FC<PropsInterface> = ({onClose}) => {
  const {widgetStore, universeStore} = useStore();
  const {creatorStore} = widgetStore;
  const {canvasEditorStore} = creatorStore;
  const {worldId, world3dStore} = universeStore;
  const {canvasObjectId} = canvasEditorStore;

  const canvasRef = useRef<HTMLDivElement>(null);
  const [stepActions, setStepActions] = useState<ReactElement>();
  const [activeStep, setActiveStep] = useState<CanvasStepType>('intro');

  const {t} = useI18n();

  const isLeonardoEnabled = isAIProviderEnabled(AIProvidersFlagEnum.LEONARDO);
  const isChatGPTEnabled = isAIProviderEnabled(AIProvidersFlagEnum.CHAT_GPT);

  const stepList = useMemo((): CanvasStepInterface<CanvasStepType>[] => {
    const steps: CanvasStepInterface<CanvasStepType>[] = [
      {
        id: 'intro',
        label: '1',
        stepTitle: t('labels.canvasStep1')
      },
      {
        id: 'mission',
        label: '2',
        stepIcon: 'rocket',
        stepTitle: t('labels.canvasStep2'),
        stepLabel: t('actions.describeMission')
      },
      {
        id: 'questions',
        label: '3',
        stepIcon: 'document_request',
        stepTitle: t('labels.canvasStep3'),
        stepLabel: t('actions.createEntry')
      }
    ];

    if (isLeonardoEnabled) {
      steps.push({
        id: 'script',
        label: '4',
        stepIcon: 'ai',
        stepTitle: t('labels.canvasStep4'),
        stepLabel: t('actions.aiImageScript')
      });
    }

    if (isChatGPTEnabled) {
      steps.push({
        id: 'teamworkScript',
        label: isLeonardoEnabled ? '5' : '4',
        stepIcon: 'script',
        stepTitle: t('labels.canvasStep5'),
        stepLabel: t('actions.scriptTeamwork')
      });
    }

    steps.push({
      id: 'overview',
      label: `${steps.length + 1}`,
      stepIcon: 'collect',
      stepTitle: t('labels.canvasStep6'),
      stepLabel: t('labels.overview')
    });

    return steps;
  }, [isChatGPTEnabled, isLeonardoEnabled, t]);

  const getNextStep = useCallback(
    (currentStep: CanvasStepType): CanvasStepInterface<CanvasStepType> => {
      const currentIndex = stepList.findIndex((i) => i.id === currentStep);
      return stepList[currentIndex + 1];
    },
    [stepList]
  );

  const getPrevStep = useCallback(
    (currentStep: CanvasStepType): CanvasStepInterface<CanvasStepType> => {
      const currentIndex = stepList.findIndex((i) => i.id === currentStep);
      return stepList[currentIndex - 1];
    },
    [stepList]
  );

  useEffect(() => {
    canvasEditorStore.setCreated(new Date().toISOString());
    canvasEditorStore.initAndLoad(worldId, isChatGPTEnabled, isLeonardoEnabled);

    return () => {
      canvasEditorStore.resetModel();
    };
  }, [canvasEditorStore, worldId, isChatGPTEnabled, isLeonardoEnabled]);

  useEffect(() => {
    if (canvasObjectId) {
      Event3dEmitter.emit('FlyToObject', canvasObjectId);
      world3dStore?.handleClick(canvasObjectId);
    }
  }, [canvasObjectId, world3dStore]);

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
            stepList={stepList.map((step) => ({
              variant: step.id === activeStep ? 'active' : 'prev',
              ...step
            }))}
          />
        </styled.Steps>

        <styled.StepContent>
          <Frame>
            {activeStep === 'intro' && (
              <IntroStep
                isNewCanvas={!canvasObjectId}
                stepList={stepList}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
                onDelete={() => {
                  world3dStore?.openDeleteObjectDialog(canvasObjectId || '');
                }}
              />
            )}

            {activeStep === 'mission' && (
              <MissionStep
                isNewCanvas={!canvasObjectId}
                missionData={canvasEditorStore.missionData}
                onUpdate={canvasEditorStore.setMissionData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'questions' && (
              <QuestionsStep
                isNewCanvas={!canvasObjectId}
                nextStep={getNextStep('questions')}
                questionsData={canvasEditorStore.questionsData}
                onUpdate={canvasEditorStore.setQuestionsData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'script' && (
              <ScriptStep
                isNewCanvas={!canvasObjectId}
                prevStep={getPrevStep('script')}
                nextStep={getNextStep('script')}
                leonardoCosts={canvasEditorStore.leonardoCosts}
                scriptData={canvasEditorStore.scriptData}
                onUpdate={canvasEditorStore.setScriptData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'teamworkScript' && (
              <TeamworkScriptStep
                isNewCanvas={!canvasObjectId}
                prevStep={getPrevStep('teamworkScript')}
                nextStep={getNextStep('teamworkScript')}
                chatGPTCosts={canvasEditorStore.chatGPTCosts}
                teamworkScriptData={canvasEditorStore.teamworkScriptData}
                onUpdate={canvasEditorStore.setTeamworkScriptData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'overview' && (
              <OverviewStep
                isNewCanvas={!canvasObjectId}
                prevStep={getPrevStep('overview')}
                version={canvasEditorStore.version}
                created={canvasEditorStore.created}
                missionTitle={canvasEditorStore.missionData.missionTitle}
                chatGPTCosts={canvasEditorStore.chatGPTCosts}
                leonardoCosts={canvasEditorStore.leonardoCosts}
                isLeonardoEnabled={isLeonardoEnabled}
                isLeonardo={canvasEditorStore.scriptData.isLeonardo}
                isChatGPTEnabled={isChatGPTEnabled}
                isChatGPT={canvasEditorStore.teamworkScriptData.isChatGPT}
                contributionAmount={canvasEditorStore.contributionAmount}
                questionsData={canvasEditorStore.questionsData}
                setContributionAmount={canvasEditorStore.setContributionAmount}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
                onSpawnAndSubmit={async () => {
                  await canvasEditorStore.spawnAndSubmit(worldId);
                  await world3dStore?.fetchCanvasObject();
                  await world3dStore?.loadCanvasConfig();
                }}
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
