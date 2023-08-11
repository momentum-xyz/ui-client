import {FC} from 'react';
import {Button, Input, FileUploader, Radio, ErrorsEnum} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import cn from 'classnames';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {SkyboxInfoFormInterface} from 'core/interfaces';

import * as styled from './UploadSkybox.styled';

const MAX_ASSET_SIZE_MB = 8;
const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);

interface PropsInterface {
  onBack: () => void;
}

const UploadSkybox: FC<PropsInterface> = ({onBack}) => {
  const {widgetStore, universeStore, sessionStore} = useStore();
  const {creatorStore} = widgetStore;
  const {skyboxSelectorStore} = creatorStore;
  const {isUploadPending} = skyboxSelectorStore;
  const {user} = sessionStore;
  const worldId = universeStore.worldId;

  const {t} = useI18n();

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<SkyboxInfoFormInterface>({
    defaultValues: {
      name: '',
      type: 'PRIVATE'
    }
  });

  const options = [
    {value: 'COMMUNITY', label: 'Available for Community'},
    {value: 'PRIVATE', label: 'Private Asset'}
  ];

  const formSubmitHandler: SubmitHandler<SkyboxInfoFormInterface> = async (form) => {
    if (!user) {
      return;
    }
    const isUploadOK = await skyboxSelectorStore.uploadSkybox(worldId, user.id, form);

    if (!isUploadOK) {
      setError('file', {type: 'submit'});
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
    <styled.Container data-testid="UploadSkybox-test">
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
                placeholder="Name your Asset*"
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
                placeholder="Name the Artist"
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
                variant="horizontal"
                onChange={onChange}
                options={options}
                disabled={isUploadPending}
              />
            )}
          />
        </styled.InputsContainer>
      </styled.FormContainer>

      <styled.ControlsRow>
        <Button
          label={t('actions.goBack')}
          disabled={isUploadPending}
          variant="secondary"
          onClick={onBack}
        />
        <Button
          label="Publish"
          disabled={isUploadPending}
          onClick={() => {
            handleSubmit(formSubmitHandler)();
          }}
        />
      </styled.ControlsRow>
    </styled.Container>
  );
};

export default observer(UploadSkybox);
