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
  isNewCanvas: boolean;
  leonardoCosts: number;
  scriptData: ScriptDataModelInterface;
  onUpdate: (form: CanvasScriptFormInterface) => void;
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
}

const ScriptStep: FC<PropsInterface> = ({
  isNewCanvas,
  leonardoCosts,
  scriptData,
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
    formState: {isValid}
  } = useForm<CanvasScriptFormInterface>();

  useEffect(() => {
    if (scriptData) {
      setValue('script', scriptData.script, {shouldValidate: true});
      setValue('modelId', scriptData.modelId, {shouldValidate: true});
      setValue('isLeonardo', scriptData.isLeonardo, {shouldValidate: true});
    }
  }, [scriptData, setValue]);

  const [isLeonardo] = watch(['isLeonardo']);

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
            if (isNewCanvas) {
              handleSubmit(formSubmitHandler)();
            }
            setActiveStep('teamworkScript');
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
          name="isLeonardo"
          control={control}
          render={({field: {value, onChange}}) => (
            <styled.AIButtons>
              <ButtonRectangle
                active={value}
                imageSrc={leonardoImage}
                disabled={!isNewCanvas}
                title={t('actions.leonardo')}
                label={t('labels.maxAICredits', {count: leonardoCosts})}
                onClick={() => {
                  onChange(true);
                }}
              />
              <ButtonRectangle
                active={!value}
                icon="picture_upload"
                disabled={!isNewCanvas}
                title={t('actions.imageUpload')}
                label={t('labels.noAIAvailable')}
                onClick={() => {
                  onChange(false);
                  setValue('script', '');
                  setValue('modelId', null);
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
          rules={{required: isLeonardo}}
          render={({field: {value, onChange}}) => {
            return (
              <Textarea
                lines={12}
                value={value}
                disabled={!isLeonardo || !isNewCanvas}
                placeholder={t('placeholders.canvasScript')}
                onChange={onChange}
              />
            );
          }}
        />

        <Controller
          name="modelId"
          control={control}
          rules={{required: isLeonardo}}
          render={({field: {value, onChange}}) => (
            <Select
              wide
              isClearable
              value={value}
              isDisabled={!isLeonardo || !isNewCanvas}
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
