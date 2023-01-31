import {FC, useEffect} from 'react';
import {Dialog, FileUploader, Input, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
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

const UploadSkyboxDialog: FC = () => {
  const {odysseyCreatorStore, unityStore, sessionStore} = useStore();
  const {skyboxSelectorStore} = odysseyCreatorStore;
  const {uploadDialog, uploadSkybox, isUploadPending} = skyboxSelectorStore;
  const {unityInstanceStore} = unityStore;
  const {user} = sessionStore;
  const worldId = unityStore.worldId;

  const {t} = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    unityInstanceStore.changeKeyboardControl(false);
    return () => {
      unityInstanceStore.changeKeyboardControl(true);
    };
  }, [unityInstanceStore]);

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
          text={t('assetsUploader.errorSave')}
        />
      );
      return;
    } else {
      toast.info(
        <ToastContent
          showCloseButton
          headerIconName="alert"
          text={t('assetsUploader.successMessage')}
        />
      );
    }

    uploadDialog.close();
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
                <styled.PreviewImageHolder>
                  <styled.Image src={URL.createObjectURL(value)} alt="Preview image" />
                </styled.PreviewImageHolder>
              )}
              <FileUploader
                theme={theme}
                label={value ? t('actions.changeImage') : t('actions.selectImage')}
                dragActiveLabel={t('fileUploader.dragActiveLabel')}
                onFilesUpload={(file) => {
                  onChange(file || null);
                }}
                onError={(err) => {
                  console.log('File upload error:', err);
                  setError('file', {message: 'upload'});
                }}
                fileType="image"
              />
            </styled.ImageUploadContainer>
          )}
        />
        <Controller
          name="name"
          control={control}
          // rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              placeholder={t('labels.skyboxName')}
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
