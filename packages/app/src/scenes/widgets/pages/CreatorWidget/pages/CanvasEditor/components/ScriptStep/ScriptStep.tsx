import {FC, ReactElement, useCallback, useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {ButtonRectangle, ButtonRound, Hexagon, Select, Textarea} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import {LEONARDO_MODEL_OPTIONS} from 'core/enums';
import {CanvasScriptFormInterface} from 'core/interfaces';
import {ScriptDataModelInterface} from 'scenes/widgets/stores/CreatorStore/models';
import scriptImage from 'static/images/script.png';
import leonardoImage from 'static/images/leonardo.jpeg';

import * as styled from './ScriptStep.styled';

interface PropsInterface {
  scriptData: ScriptDataModelInterface;
  onUpdate: (form: CanvasScriptFormInterface) => void;
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
}

const ScriptStep: FC<PropsInterface> = ({scriptData, onUpdate, onRenderActions, setActiveStep}) => {
  const {t} = useI18n();

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<CanvasScriptFormInterface>();

  useEffect(() => {
    if (scriptData) {
      setValue('script', scriptData.script);
      setValue('modelId', scriptData.modelId);
      setValue('isAIAvailable', scriptData.isAIAvailable);
    }
  }, [scriptData, setValue]);

  const [isAIAvailable] = watch(['isAIAvailable']);

  const formSubmitHandler: SubmitHandler<CanvasScriptFormInterface> = useCallback(
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
          onClick: () => setActiveStep('questions')
        }}
        nextProps={{
          icon: 'script',
          disabled: !isValid,
          label: t('actions.scriptTeamwork'),
          onClick: () => {
            handleSubmit(formSubmitHandler)();
            setActiveStep('teamwork');
          }
        }}
      />
    );
  }, [formSubmitHandler, handleSubmit, isValid, onRenderActions, setActiveStep, t]);

  return (
    <styled.Container data-testid="QuestionsStep-test">
      <styled.Grid>
        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="ai" />
          <span>{t('titles.createScriptForImage')}</span>
        </styled.Header>

        <styled.Description>
          <span>{t('descriptions.canvasStep4_One')}</span>
          <styled.Hexagon>
            <Hexagon type="primary-borderless" imageSrc={scriptImage} />
          </styled.Hexagon>
        </styled.Description>

        <styled.Separator />

        <Controller
          name="isAIAvailable"
          control={control}
          render={({field: {value, onChange}}) => (
            <styled.AIButtons>
              <ButtonRectangle
                active={value}
                imageSrc={leonardoImage}
                title={t('actions.leonardo')}
                label={t('labels.maxAICredits')}
                onClick={() => {
                  onChange(true);
                }}
              />
              <ButtonRectangle
                active={!value}
                icon="picture_upload"
                title={t('actions.imageUpload')}
                label={t('labels.noAIAvailable')}
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
          name="script"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Textarea
              lines={12}
              value={value}
              danger={!!errors.script}
              disabled={!isAIAvailable}
              placeholder={t('placeholders.canvasScript')}
              onChange={onChange}
            />
          )}
        />

        <Controller
          name="modelId"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Select
              wide
              isClearable
              value={value}
              isDisabled={!isAIAvailable}
              options={LEONARDO_MODEL_OPTIONS}
              placeholder={`${t('placeholders.selectModel')}*`}
              onSingleChange={onChange}
            />
          )}
        />
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(ScriptStep);
