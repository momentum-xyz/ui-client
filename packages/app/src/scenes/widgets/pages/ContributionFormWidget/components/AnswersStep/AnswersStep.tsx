import {FC, ReactElement, useCallback, useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Round, Textarea} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {ContributionStepType} from 'core/types';
import {CanvasConfigInterface} from 'api/interfaces';
import {ContributionAnswersFormInterface} from 'core/interfaces';
import {AnswersDataModelInterface} from 'scenes/widgets/stores/ContributionFormsStore';

import * as styled from './AnswersStep.styled';

interface PropsInterface {
  config: CanvasConfigInterface;
  answersData: AnswersDataModelInterface;
  setActiveStep: (step: ContributionStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onUpdate: (form: ContributionAnswersFormInterface) => void;
}

const AnswersStep: FC<PropsInterface> = ({
  config,
  answersData,
  onRenderActions,
  setActiveStep,
  onUpdate
}) => {
  const {t} = useI18n();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<ContributionAnswersFormInterface>({
    defaultValues: {
      answerOne: answersData.answerOne,
      answerTwo: answersData.answerTwo,
      answerThree: answersData.answerThree,
      answerFour: answersData.answerFour
    }
  });

  const formSubmitHandler: SubmitHandler<ContributionAnswersFormInterface> = useCallback(
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
          onClick: () => {
            setActiveStep('start');
          }
        }}
        nextProps={{
          icon: 'picture',
          disabled: !isValid,
          label: t('actions.next'),
          onClick: () => {
            handleSubmit(formSubmitHandler)();
            setActiveStep('image');
          }
        }}
      />
    );
  }, [formSubmitHandler, handleSubmit, isValid, onRenderActions, setActiveStep, t]);

  return (
    <styled.Container data-testid="AnswersStep-test">
      <styled.Grid>
        <styled.Header>
          {t('titles.answerQuestionsCounted', {count: config.questionFour ? 4 : 3})}
        </styled.Header>
        <styled.Description>
          Please share your vision based on the questions. Your answers are the core of your
          contribution.
        </styled.Description>

        <styled.Separator />

        <styled.SubTitle>
          <Round label={1} />
          <span>{config.questionOne}</span>
        </styled.SubTitle>
        <Controller
          name="answerOne"
          control={control}
          rules={{required: true, maxLength: 80}}
          render={({field: {value, onChange}}) => (
            <Textarea
              lines={2}
              value={value}
              danger={!!errors.answerOne}
              placeholder={t('placeholders.shortTitleLimited')}
              onChange={onChange}
            />
          )}
        />

        <styled.SubTitle>
          <Round label={2} />
          <span>{config.questionTwo}</span>
        </styled.SubTitle>
        <Controller
          name="answerTwo"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Textarea
              lines={4}
              value={value}
              danger={!!errors.answerTwo}
              placeholder={t('placeholders.yourInput')}
              onChange={onChange}
            />
          )}
        />

        <styled.SubTitle>
          <Round label={3} />
          <span>{config.questionThree}</span>
        </styled.SubTitle>
        <Controller
          name="answerThree"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Textarea
              lines={4}
              value={value}
              danger={!!errors.answerThree}
              placeholder={t('placeholders.yourInput')}
              onChange={onChange}
            />
          )}
        />

        {!!config.questionFour && (
          <>
            <styled.SubTitle>
              <Round label={4} />
              <span>{config.questionFour}</span>
            </styled.SubTitle>
            <Controller
              name="answerFour"
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Textarea
                  lines={4}
                  value={value}
                  danger={!!errors.answerFour}
                  placeholder={t('placeholders.yourInput')}
                  onChange={onChange}
                />
              )}
            />
          </>
        )}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(AnswersStep);
