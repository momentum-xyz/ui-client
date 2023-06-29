import {FC, useEffect, useState} from 'react';
import {
  Button,
  Input,
  Radio,
  // FileUploader,
  // ErrorsEnum,
  Loader,
  Textarea,
  Select
} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
// import cn from 'classnames';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {ToastContent} from 'ui-kit';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {SkyboxGenerationStatusInterface} from 'api';

import * as styled from './CustomSkyboxWithAI.styled';

interface SkyboxInfoInterface {
  name: string;
  type: 'COMMUNITY' | 'PRIVATE';
  file: File;
}

interface AIParamsInterface {
  styleId?: number;
  prompt: string;
}

// const MAX_ASSET_SIZE_MB = 8;
// const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);

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

  usePosBusEvent('attribute-value-changed', ({attribute_name, value}) => {
    console.log('GAGA space-attribute-changed', {attribute_name, value});
    if (attribute_name === 'skybox_ai' && skyboxSelectorStore.pendingGenerationId) {
      const data = value?.[skyboxSelectorStore.pendingGenerationId];
      if (data) {
        updateSkyboxGenerationStatus(data as SkyboxGenerationStatusInterface);
      }
    }
  });

  const {
    control: controlAI,
    handleSubmit: handleSubmitAI,
    formState: {errors: errorsAI}
    // setError
  } = useForm<AIParamsInterface>({
    defaultValues: {
      prompt: ''
    }
  });

  const {
    control,
    handleSubmit,
    // formState: {errors},
    setError
  } = useForm<SkyboxInfoInterface>({
    defaultValues: {
      name: '',
      type: 'COMMUNITY'
    }
  });

  const options = [
    {value: 'COMMUNITY', label: 'Available for Community'},
    {value: 'PRIVATE', label: 'Private Asset'}
  ];

  const formSubmitHandler: SubmitHandler<SkyboxInfoInterface> = async ({file, name, type}) => {
    if (!user) {
      return;
    }
    const isUploadOK = await uploadSkybox(worldId, user.id, file, name);
    if (!isUploadOK) {
      setError('file', {
        type: 'submit'
      });
      toast.error(<ToastContent isDanger icon="alert" text={t('assetsUploader.errorSave')} />);
      return;
    } else {
      toast.info(<ToastContent icon="alert" text={t('assetsUploader.successMessage')} />);
      onBack();
    }
  };

  const formSubmitHandlerAI: SubmitHandler<AIParamsInterface> = async ({styleId, prompt}) => {
    console.log('formSubmitHandlerAI', styleId, prompt);
    try {
      await generateAISkybox(worldId, prompt, styleId);
      setMode('review');
    } catch (e) {
      // toast.info(<ToastContent icon="alert" text={t('assetsUploader.successMessage')} />);

      // setErrorAI('file', {
      //   type: 'submit'
      // });
      toast.error(<ToastContent isDanger icon="alert" text={t('assetsUploader.errorSave')} />);
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
      {mode === 'prepare' && (
        <>
          {/* <styled.FormContainer> */}
          <styled.Header>{t('messages.createCustomSkyboxTitle')}</styled.Header>
          <styled.Description>{t('messages.createCustomSkyboxDescription')}</styled.Description>
          <Controller
            name="prompt"
            control={controlAI}
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <Textarea
                placeholder={t('messages.createCustomSkyboxPlaceholder')}
                // disabled={isUploadPending}
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
          {/* </styled.FormContainer> */}
          {/* {isUploadPending && <Loader />} */}
          <br />
          <styled.ControlsRow>
            <Button
              label={t('actions.goBack')}
              disabled={isUploadPending}
              variant="secondary"
              onClick={onBack}
            />
            <Button
              label={t('messages.createCustomSkyboxGenerateSkybox')}
              disabled={isUploadPending}
              onClick={() => {
                handleSubmitAI(formSubmitHandlerAI)();
              }}
            />
          </styled.ControlsRow>
        </>
      )}

      {mode === 'review' && (
        <>
          {skyboxSelectorStore.generatedSkyboxThumbUrl && (
            // <styled.PreviewImageHolder
            //   // style={{backgroundImage: `url(${URL.createObjectURL(value)})`}}
            //   // style={{backgroundImage: `url(${skyboxSelectorStore.generatedSkyboxThumbUrl})`}}
            // >
            // </styled.PreviewImageHolder>
            <div style={{width: '100%', minHeight: 300, border: 'red 1px solid'}}>
              <img src={skyboxSelectorStore.generatedSkyboxThumbUrl} />
            </div>
          )}
          <styled.FormContainer>
            {/* <Controller
              name="file"
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <styled.ImageUploadContainer
                  className={cn(!!errors.file && 'error', value && 'has-image')}
                >
                  {!value && (
                    <styled.SkyboxInformation>
                      <h1>{t('messages.uploadCustomSkyboxInfoTitle')}</h1>
                      <span>{t('messages.uploadCustomSkyboxInfoDescription')}</span>
                    </styled.SkyboxInformation>
                  )}
                  {!!value && (
                    <styled.PreviewImageHolder
                      style={{backgroundImage: `url(${URL.createObjectURL(value)})`}}
                    />
                  )}
                  {!isUploadPending && (
                    <FileUploader
                      label={value ? t('actions.changeImage') : t('actions.uploadYourAsset')}
                      dragActiveLabel={t('fileUploader.dragActiveLabel')}
                      maxSize={MAX_ASSET_SIZE_B}
                      onFilesUpload={(file) => {
                        onChange(file || null);
                      }}
                      onError={handleUploadError}
                      fileType="image"
                    />
                  )}
                </styled.ImageUploadContainer>
              )}
            /> */}
            <styled.InputsContainer>
              <Controller
                name="name"
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <Input
                    placeholder={'Name your Asset*' || ''}
                    value={value}
                    wide
                    onChange={(value: string) => {
                      onChange(value);
                    }}
                    disabled={isUploadPending}
                  />
                )}
              />
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
                  />
                )}
              />
            </styled.InputsContainer>
          </styled.FormContainer>
          {isUploadPending && <Loader />}
          <styled.ControlsRow>
            <Button
              label={t('actions.goBack')}
              disabled={isUploadPending}
              variant="secondary"
              onClick={() => setMode('prepare')}
            />
            <Button
              label="Publish"
              disabled={isUploadPending}
              onClick={() => {
                handleSubmit(formSubmitHandler)();
              }}
            />
          </styled.ControlsRow>
        </>
      )}
    </styled.Container>
  );
};

export default observer(CustomSkyboxWithAI);
