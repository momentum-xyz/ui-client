import {FC, useEffect, useState} from 'react';
import {
  Button,
  Input,
  Radio,
  // FileUploader,
  // ErrorsEnum,
  Loader,
  Textarea,
  Select,
  Image
} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {useSkyboxPreview} from '@momentum-xyz/core3d';
// import cn from 'classnames';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {BlockadeLabs, ToastContent} from 'ui-kit';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {SkyboxGenerationStatusInterface} from 'api';
import {BLOCKADE_LABS_ARTIST_NAME} from 'core/constants';

import * as styled from './CustomSkyboxWithAI.styled';

interface SkyboxInfoInterface {
  name: string;
  type: 'COMMUNITY' | 'PRIVATE';
}

interface AIParamsInterface {
  styleId?: number;
  prompt: string;
}

interface PropsInterface {
  onBack: () => void;
}

const CustomSkyboxWithAI: FC<PropsInterface> = ({onBack}) => {
  const {widgetStore, universeStore, sessionStore} = useStore();
  const {creatorStore} = widgetStore;
  const {skyboxSelectorStore} = creatorStore;
  const {
    uploadSkybox,
    isUploadPending,
    fetchAIStyles,
    AIStyles,
    generateAISkybox,
    generatedSkyboxFile,
    updateSkyboxGenerationStatus,
    isSkyboxGenerationPending,
    isSkyboxGenerationComplete,
    skyboxGenerationError
  } = skyboxSelectorStore;
  const {user} = sessionStore;
  const worldId = universeStore.worldId;

  const [mode, setMode] = useState<'prepare' | 'review'>('prepare');

  console.log('CustomSkyboxWithAI', {
    mode,
    AIStyles,
    isSkyboxGenerationPending,
    isSkyboxGenerationComplete,
    skyboxGenerationError
  });

  const {t} = useI18n();

  useEffect(() => {
    if (AIStyles?.length === 0) {
      fetchAIStyles();
    }
  }, [AIStyles, fetchAIStyles]);

  // useEffect(() => {
  //   setMode('review');

  //   updateSkyboxGenerationStatus({
  //     thumb_url:
  //       'https://blockade-platform-production.s3.amazonaws.com/thumbs/imagine/thumb_vibrant_microdetailed_digital_art_detailed_digital_vr_painting_sky__c24586a3c27d4396__6667781_c.jpg?ver=1',
  //     pusher_event: 'status_update',
  //     created_at: {},
  //     file_url:
  //       'https://blockade-platform-production.s3.amazonaws.com/images/imagine/vibrant_microdetailed_digital_art_detailed_digital_vr_painting_sky__c24586a3c27d4396__6667781_c.jpg?ver=1',
  //     type: 'skybox',
  //     prompt: 'sky',
  //     remix_imagine_id: null,
  //     title: 'World #6667781',
  //     status: 'complete',
  //     error_message: null,
  //     skybox_id: 5,
  //     skybox_style_id: 5,
  //     depth_map_url: '',
  //     id: 6667781,
  //     skybox_name: 'Digital Painting',
  //     negative_text: null,
  //     obfuscated_id: 'a2c345493364a169a76277aa719ce4db',
  //     remix_obfuscated_id: null,
  //     seed: 631854419,
  //     isMyFavorite: false,
  //     user_id: 2436,
  //     username: 'cs@odyssey.org',
  //     pusher_channel: 'status_update_a2c345493364a169a76277aa719ce4db',
  //     queue_position: 0,
  //     updated_at: {},
  //     message: null,
  //     skybox_style_name: 'Digital Painting'
  //   } as any);
  // }, []);

  usePosBusEvent('attribute-value-changed', ({attribute_name, value}) => {
    console.log('GAGA space-attribute-changed', {attribute_name, value});
    if (attribute_name === 'skybox_ai' && skyboxSelectorStore.pendingGenerationId) {
      const data = value?.[skyboxSelectorStore.pendingGenerationId];
      if (data) {
        updateSkyboxGenerationStatus(data as SkyboxGenerationStatusInterface);
      }
    }
  });

  const {skipRestoringPreviousSkybox} = useSkyboxPreview({
    url: skyboxSelectorStore.generatedSkyboxPreviewUrl
  });

  const {
    control: controlAI,
    handleSubmit: handleSubmitAI,
    getValues,
    formState: {errors: errorsAI},
    setError: setErrorAI
  } = useForm<AIParamsInterface>({
    defaultValues: {
      prompt: ''
    }
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    setError
  } = useForm<SkyboxInfoInterface>({
    defaultValues: {
      name: '',
      type: 'COMMUNITY'
    }
  });
  console.log('CustomSkyboxWithAI errors', {errors, errorsAI});

  const options = [
    {value: 'COMMUNITY', label: 'Community Library'},
    {value: 'PRIVATE', label: 'Private Library'}
  ];

  const formSubmitHandler: SubmitHandler<SkyboxInfoInterface> = async ({name, type}) => {
    if (!user || !generatedSkyboxFile) {
      return;
    }
    // TODO type
    const isUploadOK = await uploadSkybox(
      worldId,
      user.id,
      generatedSkyboxFile,
      name,
      BLOCKADE_LABS_ARTIST_NAME
    );
    if (!isUploadOK) {
      setError('root', {
        type: 'submit'
      });
      toast.error(<ToastContent isDanger icon="alert" text={t('assetsUploader.errorSave')} />);
      return;
    } else {
      toast.info(<ToastContent icon="alert" text={t('assetsUploader.successMessage')} />);
      skipRestoringPreviousSkybox();
      onBack();
    }
  };

  const formSubmitHandlerAI: SubmitHandler<AIParamsInterface> = async ({styleId, prompt}) => {
    console.log('formSubmitHandlerAI', styleId, prompt);
    try {
      await generateAISkybox(worldId, prompt, styleId);
      setMode('review');
    } catch (e) {
      setErrorAI('root', {
        type: 'submit'
      });
      toast.error(
        <ToastContent isDanger icon="alert" text={t('skyboxGenerator.errorGenerating')} />
      );
    }
  };

  // const handleUploadError = (err: Error): void => {
  //   console.log('File upload error:', err);
  //   const message =
  //     err.message === ErrorsEnum.FileSizeTooLarge
  //       ? t('assetsUploader.errorTooLargeFile', {size: MAX_ASSET_SIZE_MB})
  //       : t('assetsUploader.errorSave');

  //   toast.error(<ToastContent isDanger icon="alert" text={message} />);
  //   setError('file', {message: 'upload'});
  // };

  return (
    <styled.Container data-testid="CreateCustomSkyboxWithAI-test">
      <styled.Header>{t('messages.createCustomSkyboxTitle')}</styled.Header>
      {mode === 'prepare' && (
        <>
          <styled.Description>{t('messages.createCustomSkyboxDescription')}</styled.Description>
          <Controller
            name="prompt"
            control={controlAI}
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <Textarea
                placeholder={t('messages.createCustomSkyboxPlaceholder')}
                onChange={onChange}
                value={value}
                danger={!!errorsAI.prompt}
              />
            )}
          />
          <Controller
            name="styleId"
            control={controlAI}
            key={AIStyles?.length}
            render={({field: {value, onChange}}) => (
              <Select
                placeholder={t('messages.createCustomSkybixSelectArtStyle')}
                options={
                  AIStyles?.map((style) => ({
                    value: style.id,
                    label: style.name
                  })) || []
                }
                value={value}
                wide
                isDisabled={isUploadPending}
                onSingleChange={onChange}
              />
            )}
          />
          <br />
          <styled.ControlsRow>
            <Button label={t('actions.goBack')} variant="secondary" onClick={onBack} />
            <Button
              label={t('messages.createCustomSkyboxGenerateSkybox')}
              onClick={() => {
                handleSubmitAI(formSubmitHandlerAI)();
              }}
            />
          </styled.ControlsRow>
        </>
      )}

      {mode === 'review' && (
        <>
          <styled.PromptReview>
            <styled.PromptReviewLabel>Prompt:</styled.PromptReviewLabel>
            <styled.PromptReviewValue>"{getValues().prompt}"</styled.PromptReviewValue>
            <styled.PromptReviewLabel>Art Style:</styled.PromptReviewLabel>
            <div>{AIStyles?.find((style) => style.id === getValues().styleId)?.name}</div>
          </styled.PromptReview>

          {isSkyboxGenerationComplete && (
            <>
              {skyboxSelectorStore.generatedSkyboxThumbUrl && (
                <styled.PreviewImageHolder>
                  <Image src={skyboxSelectorStore.generatedSkyboxThumbUrl} height={240} bordered />

                  <BlockadeLabs small bottomRightAbsolute />
                </styled.PreviewImageHolder>
              )}
              <styled.FormContainer>
                <styled.InputsContainer>
                  <Controller
                    name="name"
                    control={control}
                    rules={{required: true}}
                    render={({field: {value, onChange}}) => (
                      <Input
                        placeholder={'Name your Skybox*' || ''}
                        value={value}
                        wide
                        onChange={(value: string) => {
                          onChange(value);
                        }}
                        disabled={isUploadPending}
                      />
                    )}
                  />
                  {/* TODO implement disabled prop for Radio */}
                  {!isUploadPending && (
                    <Controller
                      name="type"
                      control={control}
                      render={({field: {value, onChange}}) => (
                        <Radio
                          name="type"
                          value={value}
                          onChange={(value: string) => {
                            onChange(value);
                          }}
                          options={options}
                          // disabled={isUploadPending}
                        />
                      )}
                    />
                  )}
                </styled.InputsContainer>
              </styled.FormContainer>
            </>
          )}
          {isSkyboxGenerationPending && (
            <styled.SkyboxGenerationLoaderContainer>
              <styled.Separator />
              <div>Skybox is Generating, Please Wait</div>
              <Loader />
            </styled.SkyboxGenerationLoaderContainer>
          )}
          {isUploadPending && <Loader />}
          <styled.ControlsRow>
            <Button
              label={t('actions.goBack')}
              disabled={isUploadPending}
              variant="secondary"
              onClick={() => setMode('prepare')}
            />
            <Button
              label="Save skybox"
              disabled={isUploadPending}
              onClick={() => {
                handleSubmit(formSubmitHandler)();
              }}
            />
          </styled.ControlsRow>
        </>
      )}

      <BlockadeLabs withLicense bottomRightFlex />
    </styled.Container>
  );
};

export default observer(CustomSkyboxWithAI);
