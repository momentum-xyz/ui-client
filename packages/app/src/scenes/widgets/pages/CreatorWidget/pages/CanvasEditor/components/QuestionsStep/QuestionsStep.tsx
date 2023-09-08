import {FC, ReactElement, useCallback, useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Hexagon, Input, Round, Textarea} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import {CanvasQuestionsFormInterface} from 'core/interfaces';
import {QuestionsDataModelInterface} from 'scenes/widgets/stores/CreatorStore/models';

import {CanvasStepInterface} from '../../CanvasEditor';

import * as styled from './QuestionsStep.styled';

interface PropsInterface {
  isNewCanvas: boolean;
  nextStep: CanvasStepInterface<CanvasStepType>;
  questionsData: QuestionsDataModelInterface;
  onUpdate: (form: CanvasQuestionsFormInterface) => void;
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
}

const QuestionsStep: FC<PropsInterface> = ({
  isNewCanvas,
  nextStep,
  questionsData,
  onUpdate,
  onRenderActions,
  setActiveStep
}) => {
  const {t} = useI18n();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<CanvasQuestionsFormInterface>({
    defaultValues: {
      questionOne: questionsData.questionOne,
      questionTwo: questionsData.questionTwo,
      questionThree: questionsData.questionThree,
      questionFour: questionsData.questionFour
    }
  });

  const formSubmitHandler: SubmitHandler<CanvasQuestionsFormInterface> = useCallback(
    (form) => {
      onUpdate(form);
    },
    [onUpdate]
  );

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        backProps={{
          label: t('actions.back'),
          onClick: () => setActiveStep('mission')
        }}
        nextProps={{
          icon: nextStep.stepIcon,
          disabled: !isValid,
          label: nextStep.stepLabel || '',
          onClick: () => {
            if (isNewCanvas) {
              handleSubmit(formSubmitHandler)();
            }
            setActiveStep(nextStep.id);
          }
        }}
      />
    );
  }, [
    isNewCanvas,
    formSubmitHandler,
    handleSubmit,
    isValid,
    onRenderActions,
    setActiveStep,
    t,
    nextStep
  ]);

  return (
    <styled.Container data-testid="QuestionsStep-test">
      <styled.Grid>
        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="document_request" />
          <span>{t('titles.makeContributionEntry')}</span>
        </styled.Header>

        <styled.Description>{t('descriptions.canvasStep3_One')}</styled.Description>

        <styled.Separator />

        <styled.SubTitle>
          <Round label={1} />
          <span>{t('titles.canvasQuestion1')}*</span>
        </styled.SubTitle>
        <Controller
          name="questionOne"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              wide
              value={value}
              disabled={!isNewCanvas}
              danger={!!errors.questionOne}
              placeholder={t('placeholders.canvasQuestion1')}
              onChange={onChange}
            />
          )}
        />

        <styled.SubTitle>
          <Round label={2} />
          <span>{t('titles.question')}*</span>
        </styled.SubTitle>
        <Controller
          name="questionTwo"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Textarea
              lines={3}
              value={value}
              disabled={!isNewCanvas}
              danger={!!errors.questionTwo}
              placeholder={t('placeholders.canvasQuestion2')}
              onChange={onChange}
            />
          )}
        />

        <styled.SubTitle>
          <Round label={3} />
          <span>{t('titles.question')}*</span>
        </styled.SubTitle>
        <Controller
          name="questionThree"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Textarea
              lines={3}
              value={value}
              disabled={!isNewCanvas}
              danger={!!errors.questionThree}
              placeholder={t('placeholders.canvasQuestion3')}
              onChange={onChange}
            />
          )}
        />

        <styled.SubTitle>
          <Round label={4} />
          <span>{t('titles.question')}</span>
        </styled.SubTitle>
        <Controller
          name="questionFour"
          control={control}
          render={({field: {value, onChange}}) => (
            <Textarea
              lines={3}
              value={value}
              disabled={!isNewCanvas}
              placeholder={t('placeholders.canvasQuestion4')}
              onChange={onChange}
            />
          )}
        />
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(QuestionsStep);
