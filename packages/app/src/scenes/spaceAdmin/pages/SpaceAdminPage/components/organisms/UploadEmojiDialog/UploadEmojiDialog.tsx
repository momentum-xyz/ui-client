import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';
import cn from 'classnames';
import {observer} from 'mobx-react-lite';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Dialog, FileUploader, Input} from '@momentum-xyz/ui-kit';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {UploadEmojiRequest} from 'api';

import * as styled from './UploadEmojiDialog.styled';

interface PropsInterface {
  spaceId: string;
  existingEmojiId: string | undefined;
}

type FormType = Omit<UploadEmojiRequest, 'spaceId'>;

const UploadEmojiDialog: FC<PropsInterface> = ({spaceId, existingEmojiId}) => {
  const {uploadDialog, isUploadPending, uploadEmojiToSpace, deleteEmoji} =
    useStore().spaceAdminStore.manageEmojiStore;

  const theme = useTheme();
  const {t} = useTranslation();

  const {
    control,
    formState: {errors},
    handleSubmit,
    setError
  } = useForm<FormType>({
    defaultValues: {
      name: ''
    }
  });

  const formSubmitHandler: SubmitHandler<FormType> = async ({file, name}) => {
    if (existingEmojiId) {
      const isDeleteOK = await deleteEmoji(spaceId, existingEmojiId);
      if (!isDeleteOK) {
        setError('file', {
          type: 'delete'
        });
        toast.error(
          <ToastContent
            isDanger
            showCloseButton
            headerIconName="alert"
            text={t('spaceAdmin.manageEmoji.uploadDialog.errorDeleteOld')}
          />
        );
        return;
      }
    }

    const isUploadOK = await uploadEmojiToSpace(spaceId, file, name);
    if (!isUploadOK) {
      setError('file', {
        type: 'submit'
      });
      toast.error(
        <ToastContent
          isDanger
          showCloseButton
          headerIconName="alert"
          text={t('spaceAdmin.manageEmoji.uploadDialog.errorSave')}
        />
      );
      return;
    }

    uploadDialog.close();
  };

  return (
    <Dialog
      title={t('spaceAdmin.manageEmoji.uploadDialog.title')}
      hasBorder
      showCloseButton
      onClose={uploadDialog.close}
      approveInfo={{
        title: t('spaceAdmin.manageEmoji.uploadDialog.confirmButton'),
        onClick: handleSubmit(formSubmitHandler),
        disabled: isUploadPending
      }}
    >
      <styled.DialogContainer>
        <Controller
          name="name"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              label={t('spaceAdmin.manageEmoji.uploadDialog.emojiName')}
              type="text"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
              errorMessage={t('spaceAdmin.manageEmoji.uploadDialog.errorMissingName')}
              isError={!!errors.name}
              disabled={isUploadPending}
            />
          )}
        />
        <Controller
          name="file"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <styled.ImageUploadContainer className={cn(!!errors.file && 'error')}>
              {!!value && (
                <styled.PreviewImageHolder>
                  <styled.Image src={URL.createObjectURL(value)} alt="Preview emoji" />
                </styled.PreviewImageHolder>
              )}
              <FileUploader
                theme={theme}
                label={
                  value
                    ? t('spaceAdmin.manageEmoji.uploadDialog.changeImage')
                    : t('spaceAdmin.manageEmoji.uploadDialog.selectImage')
                }
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
      </styled.DialogContainer>
    </Dialog>
  );
};

export default observer(UploadEmojiDialog);
