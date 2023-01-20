import {FC, useEffect} from 'react';
import {
  Dialog,
  FileUploader
  // Input
} from '@momentum-xyz/ui-kit';
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
  const {odysseyCreatorStore, unityStore} = useStore();
  const {skyboxSelectorStore} = odysseyCreatorStore;
  const {uploadDialog, uploadSkybox, isUploadPending} = skyboxSelectorStore;
  const {unityInstanceStore} = unityStore;
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
    const isUploadOK = await uploadSkybox(worldId, file, name);
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
        {/* <Controller
          name="name"
          control={control}
          // rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              label={t('titles.name')}
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
        /> */}
        <Controller
          name="file"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <styled.ImageUploadContainer className={cn(!!errors.file && 'error')}>
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
      </styled.Container>
    </Dialog>
  );
};

export default observer(UploadSkyboxDialog);
