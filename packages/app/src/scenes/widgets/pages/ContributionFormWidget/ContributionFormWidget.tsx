import {FC, ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Event3dEmitter, useI18n} from '@momentum-xyz/core';
import {Panel, StepInterface, Steps, Frame, PositionEnum} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {ContributionStepType} from 'core/types';

import {StartStep, AnswersStep, ImageStep, SubmitStep} from './components';
import * as styled from './ContributionFormWidget.styled';

const STEP_LIST: StepInterface<ContributionStepType>[] = [
  {id: 'start', label: '0'},
  {id: 'answers', label: '1'},
  {id: 'image', label: '2'},
  {id: 'submit', label: '3'}
];

const ContributionFormWidget: FC = () => {
  const {widgetManagerStore, widgetStore, sessionStore, universeStore} = useStore();
  const {contributionFormsStore} = widgetStore;
  const {world3dStore} = universeStore;
  const {isGuest} = sessionStore;

  const ref = useRef<HTMLDivElement>(null);
  const [stepActions, setStepActions] = useState<ReactElement>();
  const [activeStep, setActiveStep] = useState<ContributionStepType>('start');

  const {t} = useI18n();

  useEffect(() => {
    if (world3dStore?.canvasObjectId) {
      contributionFormsStore.loadConfig(world3dStore.canvasObjectId);
      Event3dEmitter.emit('FlyToObject', world3dStore.canvasObjectId);
    }

    return () => {
      contributionFormsStore.resetModel();
    };
  }, [contributionFormsStore, world3dStore?.canvasObjectId]);

  const handleSetActiveStep = useCallback((stepType: ContributionStepType) => {
    setActiveStep(stepType);

    // Reset the scroll position during step changes
    if (ref.current?.parentElement) {
      ref.current.parentElement.scrollTop = 0;
    }
  }, []);

  if (!contributionFormsStore.config) {
    return <></>;
  }

  return (
    <Panel
      size="normal"
      isFullHeight
      variant="primary"
      icon="person_idea"
      title={t('labels.contribute')}
      bottomComponent={stepActions}
      onClose={() => widgetManagerStore.close(WidgetEnum.CONTRIBUTION_FORM)}
    >
      <styled.Container ref={ref} data-testid="ContributionFormWidget-test">
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
            {activeStep === 'start' && (
              <StartStep
                isGuest={isGuest}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
                onSignIn={() => {
                  widgetManagerStore.closeAll();
                  widgetManagerStore.open(WidgetEnum.LOGIN, PositionEnum.LEFT);
                }}
              />
            )}

            {activeStep === 'answers' && (
              <AnswersStep
                config={contributionFormsStore.config}
                answersData={contributionFormsStore.answersData}
                onUpdate={contributionFormsStore.setAnswersData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'image' && (
              <ImageStep
                config={contributionFormsStore.config}
                imageData={contributionFormsStore.imageData}
                isGenerating={contributionFormsStore.isGenerating}
                generatedImages={contributionFormsStore.generatedImages}
                onGenerateImages={contributionFormsStore.generateAIImages}
                onClearGeneratedImages={contributionFormsStore.clearGeneratedImages}
                onUpdate={contributionFormsStore.setImageData}
                setActiveStep={handleSetActiveStep}
                onRenderActions={setStepActions}
              />
            )}

            {activeStep === 'submit' && (
              <SubmitStep
                config={contributionFormsStore.config}
                imageData={contributionFormsStore.imageData}
                answersData={contributionFormsStore.answersData}
                isSubmitting={false}
                onSubmit={() => {}}
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

export default observer(ContributionFormWidget);
