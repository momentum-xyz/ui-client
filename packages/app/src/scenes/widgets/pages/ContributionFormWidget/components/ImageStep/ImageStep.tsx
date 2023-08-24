import {FC, ReactElement, useCallback, useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {ButtonSquare} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {getImageAbsoluteUrl} from 'core/utils';
import {ContributionStepType} from 'core/types';
import {CanvasConfigInterface} from 'api/interfaces';
import {ContributionImageFormInterface} from 'core/interfaces';
import {ImageDataModelInterface} from 'scenes/widgets/stores/ContributionFormsStore';

import * as styled from './ImageStep.styled';

interface PropsInterface {
  config: CanvasConfigInterface;
  imageData: ImageDataModelInterface;
  setActiveStep: (step: ContributionStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onUpdate: (form: ContributionImageFormInterface) => void;
}

type ImageType = 'custom' | 'ai';

const ImageStep: FC<PropsInterface> = ({
  config,
  imageData,
  onRenderActions,
  setActiveStep,
  onUpdate
}) => {
  const [imageType, setImageType] = useState<ImageType>('ai');

  useEffect(() => {
    if (!config.isLeonardo || imageData.renderHash) {
      setImageType('custom');
    }
  }, [config, imageData]);

  const {t} = useI18n();

  const {
    //control,
    handleSubmit,
    formState: {isValid}
  } = useForm<ContributionImageFormInterface>({
    defaultValues: {
      fileUrl: getImageAbsoluteUrl(imageData.renderHash)
    }
  });

  const formSubmitHandler: SubmitHandler<ContributionImageFormInterface> = useCallback(
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
            setActiveStep('answers');
          }
        }}
        nextProps={{
          icon: 'person_idea',
          disabled: !isValid,
          label: t('actions.next'),
          onClick: () => {
            handleSubmit(formSubmitHandler)();
            setActiveStep('submit');
          }
        }}
      />
    );
  }, [formSubmitHandler, handleSubmit, isValid, onRenderActions, setActiveStep, t]);

  return (
    <styled.Container data-testid="ImageStep-test">
      <styled.Grid>
        <styled.Header>{t('titles.addImageToIdea')}</styled.Header>
        <styled.Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </styled.Description>

        <styled.Separator />

        <styled.ImageTypeSelector>
          <ButtonSquare
            icon="ai"
            isActive={imageType === 'ai'}
            isDisabled={!config.isLeonardo}
            label={t('actions.createAIImage')}
            onClick={() => setImageType('ai')}
          />

          <ButtonSquare
            icon="picture_upload"
            isActive={imageType === 'custom'}
            label={t('actions.uploadImage')}
            onClick={() => setImageType('custom')}
          />
        </styled.ImageTypeSelector>

        {imageType && <span>{imageType}</span>}

        {/*<Controller
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
        />*/}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(ImageStep);
