import {FC, ReactElement, useCallback, useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {ButtonRound, Hexagon, Input, Textarea} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import {CanvasMissionFormInterface} from 'core/interfaces';
import {MissionDataModelInterface} from 'scenes/widgets/stores/CreatorStore/models';

import * as styled from './MissionStep.styled';

interface PropsInterface {
  missionData: MissionDataModelInterface;
  onUpdate: (form: CanvasMissionFormInterface) => void;
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
}

const MissionStep: FC<PropsInterface> = ({
  missionData,
  onUpdate,
  onRenderActions,
  setActiveStep
}) => {
  const {t} = useI18n();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<CanvasMissionFormInterface>({
    defaultValues: {
      missionTitle: missionData.missionTitle,
      missionStory: missionData.missionStory
    }
  });

  const formSubmitHandler: SubmitHandler<CanvasMissionFormInterface> = useCallback(
    (form) => {
      onUpdate(form);
      setActiveStep('questions');
    },
    [onUpdate, setActiveStep]
  );

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        backProps={{
          label: t('actions.back'),
          onClick: () => setActiveStep('intro')
        }}
        nextProps={{
          icon: 'document_request',
          disabled: !isValid,
          label: t('actions.createEntry'),
          onClick: () => handleSubmit(formSubmitHandler)()
        }}
      />
    );
  }, [formSubmitHandler, handleSubmit, isValid, onRenderActions, setActiveStep, t]);

  return (
    <styled.Container data-testid="MissionStep-test">
      <styled.Grid>
        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="rocket" />
          <span>{t('titles.describeGoal')}</span>
        </styled.Header>

        <styled.Description>{t('descriptions.canvasStep2_One')}</styled.Description>

        <styled.Separator />

        <styled.SubTitle>
          <ButtonRound isLabel icon="rocket" />
          <span>{t('titles.missionTitle')}*</span>
        </styled.SubTitle>
        <Controller
          name="missionTitle"
          control={control}
          rules={{required: true, maxLength: 80}}
          render={({field: {value, onChange}}) => (
            <Input
              wide
              value={value}
              danger={!!errors.missionTitle}
              placeholder={t('placeholders.missionTitle')}
              onChange={onChange}
            />
          )}
        />

        <styled.SubTitle>
          <ButtonRound isLabel icon="rocket" />
          <span>{t('titles.whatIsMission')}*</span>
        </styled.SubTitle>
        <Controller
          name="missionStory"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Textarea
              lines={15}
              value={value}
              danger={!!errors.missionStory}
              placeholder={t('placeholders.missionStory')}
              onChange={onChange}
            />
          )}
        />
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(MissionStep);
