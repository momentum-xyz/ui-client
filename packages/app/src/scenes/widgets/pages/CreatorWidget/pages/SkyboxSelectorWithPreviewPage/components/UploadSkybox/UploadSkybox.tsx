/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, useEffect} from 'react';
import {FileUploader, Text, ErrorsEnum} from '@momentum-xyz/ui-kit';
import {Button, Input, Radio} from '@momentum-xyz/ui-kit-storybook';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import cn from 'classnames';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './UploadSkybox.styled';

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

const UploadSkybox: FC<PropsInterface> = ({onBack}) => {
  const {creatorStore, universeStore, sessionStore} = useStore();
  const {skyboxSelectorStore} = creatorStore;
  const {uploadSkybox, isUploadPending} = skyboxSelectorStore;
  const {world3dStore} = universeStore;
  const {user} = sessionStore;
  const worldId = universeStore.worldId;

  const {t} = useI18n();

  useEffect(() => {
    world3dStore?.changeKeyboardControl(false);
    return () => {
      world3dStore?.changeKeyboardControl(true);
    };
  }, [world3dStore]);

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
      toast.error(
        <ToastContent
          isDanger
          showCloseButton
          headerIconName="alert"
          title={t('labels.addCustomSkybox')}
          text={t('assetsUploader.errorSave')}
        />
      );
      return;
    } else {
      toast.info(
        <ToastContent
          showCloseButton
          headerIconName="alert"
          title={t('labels.addCustomSkybox')}
          text={t('assetsUploader.successMessage')}
        />
      );
    }
  };

  const handleUploadError = (err: Error): void => {
    console.log('File upload error:', err);
    const message =
      err.message === ErrorsEnum.FileSizeTooLarge
        ? t('assetsUploader.errorTooLargeFile', {size: MAX_ASSET_SIZE_MB})
        : t('assetsUploader.errorSave');

    toast.error(
      <ToastContent
        isDanger
        showCloseButton
        headerIconName="alert"
        title={t('labels.addCustomSkybox')}
        text={message}
      />
    );
    setError('file', {message: 'upload'});
  };

  return (
    <styled.Container>
      <styled.FormContainer>
        <Controller
          name="file"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <styled.ImageUploadContainer
              className={cn(!!errors.file && 'error', value && 'has-image', 'testttt')}
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
              <FileUploader
                label={value ? t('actions.changeImage') : t('actions.selectImage')}
                dragActiveLabel={t('fileUploader.dragActiveLabel')}
                maxSize={MAX_ASSET_SIZE_B}
                onFilesUpload={(file) => {
                  onChange(file || null);
                }}
                onError={handleUploadError}
                fileType="image"
              />
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
      <styled.ControlsRow>
        <Button label="Go Back" variant="secondary" onClick={onBack} />
        <Button
          label="Publish"
          onClick={() => {
            handleSubmit(formSubmitHandler)();
          }}
        />
      </styled.ControlsRow>
    </styled.Container>
  );
};

export default observer(UploadSkybox);
