import {FC, useEffect} from 'react';
import {Dialog, FileUploader, Input, Text, ErrorsEnum} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import cn from 'classnames';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './UploadSkyboxDialog.styled';

interface SkyboxInfoInterface {
  name: string;
  file: File;
}

const MAX_ASSET_SIZE_MB = 8;
const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);

const UploadSkyboxDialog: FC = () => {
  const {odysseyCreatorStore, universeStore, sessionStore} = useStore();
  const {skyboxSelectorStore} = odysseyCreatorStore;
  const {uploadDialog, uploadSkybox, isUploadPending} = skyboxSelectorStore;
  const {world3dStore} = universeStore;
  const {user} = sessionStore;
  const worldId = universeStore.worldId;

  const {t} = useI18n();
  const theme = useTheme();

  useEffect(() => {
    world3dStore?.changeKeyboardControl(false);
    return () => {
      world3dStore?.changeKeyboardControl(true);
    };
  }, [world3dStore]);

  const {
    control,
    formState: {errors},
    handleSubmit,
    setError
  } = useForm<SkyboxInfoInterface>({
    defaultValues: {
      name: ''
    }
  });

  const formSubmitHandler: SubmitHandler<SkyboxInfoInterface> = async ({file, name}) => {
    if (!user) {
      return;
    }
    const isUploadOK = await uploadSkybox(worldId, user.id, file, name);
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

    uploadDialog.close();
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
    <Dialog
      title={t('labels.addCustomSkybox')}
      hasBorder
      showCloseButton
      onClose={uploadDialog.close}
      approveInfo={{
        title: t('actions.addSkybox'),
        onClick: handleSubmit(formSubmitHandler),
        disabled: isUploadPending
      }}
      declineInfo={{
        title: t('actions.cancel'),
        variant: 'danger',
        onClick: uploadDialog.close
      }}
    >
      <styled.Container>
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
                  <Text
                    size="m"
                    weight="bold"
                    text={t('messages.uploadCustomSkyboxInfoTitle')}
                    className="text"
                    transform="uppercase"
                    align="left"
                  />
                  <Text
                    size="xs"
                    text={t('messages.uploadCustomSkyboxInfoLine1')}
                    className="text"
                    align="left"
                  />
                  <Text
                    size="xs"
                    text={t('messages.uploadCustomSkyboxInfoLine2')}
                    className="text"
                    align="left"
                  />
                </styled.SkyboxInformation>
              )}
              {!!value && (
                <styled.PreviewImageHolder
                  style={{backgroundImage: `url(${URL.createObjectURL(value)})`}}
                />
              )}
              <FileUploader
                theme={theme}
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
        <Controller
          name="name"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              placeholder={t('labels.skyboxName') || ''}
              type="text"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
              errorMessage={t('errors.requiredField')}
              isError={!!errors.name}
              disabled={isUploadPending}
            />
          )}
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(UploadSkyboxDialog);
