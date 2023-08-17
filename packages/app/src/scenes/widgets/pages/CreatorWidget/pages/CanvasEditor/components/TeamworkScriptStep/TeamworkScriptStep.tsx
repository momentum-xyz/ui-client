import {FC, ReactElement, useCallback, useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {ButtonRectangle, ButtonRound, Hexagon, Input, Textarea} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import {CanvasTeamworkScriptFormInterface} from 'core/interfaces';
import {TeamworkScriptDataModelInterface} from 'scenes/widgets/stores/CreatorStore/models';
import aiProfileImage from 'static/images/ai_profile.jpeg';

import * as styled from './TeamworkScriptStep.styled';

interface PropsInterface {
  aiCreditsCount: number;
  teamworkScriptData: TeamworkScriptDataModelInterface;
  onUpdate: (form: CanvasTeamworkScriptFormInterface) => void;
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
}

const TeamworkScriptStep: FC<PropsInterface> = ({
  aiCreditsCount,
  teamworkScriptData,
  onUpdate,
  onRenderActions,
  setActiveStep
}) => {
  const {t} = useI18n();

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<CanvasTeamworkScriptFormInterface>();

  useEffect(() => {
    if (teamworkScriptData) {
      setValue('script', teamworkScriptData.script);
      setValue('scriptTitle', teamworkScriptData.scriptTitle);
      setValue('isAIAvailable', teamworkScriptData.isAIAvailable);
    }
  }, [teamworkScriptData, setValue]);

  const [isAIAvailable] = watch(['isAIAvailable']);

  const formSubmitHandler: SubmitHandler<CanvasTeamworkScriptFormInterface> = useCallback(
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
          onClick: () => setActiveStep('script')
        }}
        nextProps={{
          icon: 'collect',
          disabled: !isValid,
          label: t('labels.overview'),
          onClick: () => {
            handleSubmit(formSubmitHandler)();
            setActiveStep('overview');
          }
        }}
      />
    );
  }, [formSubmitHandler, handleSubmit, isValid, onRenderActions, setActiveStep, t]);

  return (
    <styled.Container data-testid="TeamworkScriptStep-test">
      <styled.Grid>
        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="script" />
          <span>{t('titles.createTeamworkScript')}</span>
        </styled.Header>

        <styled.Description>
          <span>{t('descriptions.canvasStep5_One')}</span>
        </styled.Description>

        <styled.Separator />

        <Controller
          name="isAIAvailable"
          control={control}
          render={({field: {value, onChange}}) => (
            <styled.AIButtons>
              <ButtonRectangle
                active={value}
                imageSrc={aiProfileImage}
                title={t('actions.chatGPT')}
                label={t('labels.maxAICredits', {count: aiCreditsCount})}
                onClick={() => {
                  onChange(true);
                }}
              />
              <ButtonRectangle
                active={!value}
                icon="close_small"
                title={t('actions.noTeamworkOutcome')}
                label={t('labels.skipAI')}
                onClick={() => {
                  onChange(false);
                }}
              />
            </styled.AIButtons>
          )}
        />

        <styled.SubTitle>
          <ButtonRound isLabel icon="script" />
          <span>{t('titles.enterScript')}</span>
        </styled.SubTitle>

        <Controller
          name="scriptTitle"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              wide
              value={value}
              disabled={!isAIAvailable}
              danger={!!errors.scriptTitle}
              placeholder={`${t('placeholders.whatIsProduct')}*`}
              onChange={onChange}
            />
          )}
        />

        <Controller
          name="script"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Textarea
              lines={12}
              value={value}
              danger={!!errors.script}
              disabled={!isAIAvailable}
              placeholder={t('placeholders.canvasTeamworkScript')}
              onChange={onChange}
            />
          )}
        />
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(TeamworkScriptStep);
