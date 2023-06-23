import {FC, useState} from 'react';
import {
  Button,
  Input,
  Radio,
  FileUploader,
  ErrorsEnum,
  Loader,
  Textarea,
  Select
} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import cn from 'classnames';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './CustomSkyboxWithAI.styled';

interface SkyboxInfoInterface {
  name: string;
  artistName: string;
  type: 'COMMUNITY' | 'PRIVATE';
  file: File;
}

const MAX_ASSET_SIZE_MB = 8;
const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);

interface PropsInterface {
  onBack: () => void;
}

const CustomSkyboxWithAI: FC<PropsInterface> = ({onBack}) => {
  const {widgetStore, universeStore, sessionStore} = useStore();
  const {creatorStore} = widgetStore;
  const {skyboxSelectorStore} = creatorStore;
  const {uploadSkybox, isUploadPending} = skyboxSelectorStore;
  const {user} = sessionStore;
  const worldId = universeStore.worldId;

  const [mode, setMode] = useState<'prepare' | 'review'>('prepare');

  const {t} = useI18n();

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

  const options = [
    {value: 'COMMUNITY', label: 'Available for Community'},
    {value: 'PRIVATE', label: 'Private Asset'}
  ];

  const formSubmitHandler: SubmitHandler<SkyboxInfoInterface> = async ({
    file,
    name,
    artistName,
    type
  }) => {
    if (!user) {
      return;
    }
    const isUploadOK = await uploadSkybox(worldId, user.id, file, name, artistName);
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

  const handleUploadError = (err: Error): void => {
    console.log('File upload error:', err);
    const message =
      err.message === ErrorsEnum.FileSizeTooLarge
        ? t('assetsUploader.errorTooLargeFile', {size: MAX_ASSET_SIZE_MB})
        : t('assetsUploader.errorSave');

    toast.error(<ToastContent isDanger icon="alert" text={message} />);
    setError('file', {message: 'upload'});
  };

  return (
    <styled.Container data-testid="CreateCustomSkyboxWithAI-test">
      {mode === 'prepare' && (
        <>
          <styled.FormContainer>
            <h3>{t('messages.createCustomSkyboxTitle')}</h3>
            <p>{t('messages.createCustomSkyboxDescription')}</p>
            <Textarea
              placeholder={t('messages.createCustomSkyboxPlaceholder')}
              disabled={isUploadPending}
              onChange={() => {}}
            />
            <Select
              placeholder={t('messages.createCustomSkybixSelectArtStyle')}
              options={[
                {value: 'one', label: 'One'},
                {value: 'two', label: 'Two'}
              ]}
              value={null}
              isDisabled={isUploadPending}
              onSingleChange={() => {}}
            />
          </styled.FormContainer>
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
                // handleSubmit(formSubmitHandler)();
                alert('TODO');
              }}
            />
          </styled.ControlsRow>
        </>
      )}

      {mode === 'review' && (
        <>
          <styled.FormContainer>
            <Controller
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
            />
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
                name="artistName"
                control={control}
                render={({field: {value, onChange}}) => (
                  <Input
                    placeholder={'Name the Artist' || ''}
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
