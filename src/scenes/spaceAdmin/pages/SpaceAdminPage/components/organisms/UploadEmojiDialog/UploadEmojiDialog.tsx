import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';
import cn from 'classnames';
import {observer} from 'mobx-react-lite';

import {Dialog, FileUploader, Input, ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './UploadEmojiDialog.styled';

interface PropsInterface {
  spaceId: string;
  existingEmojiId: string | undefined;
}

const UploadEmojiDialog: FC<PropsInterface> = ({spaceId, existingEmojiId}) => {
  const {uploadDialog, isUploadPending, uploadEmojiToSpace, deleteEmoji} =
    useStore().spaceAdminStore.manageEmojiStore;

  const theme = useTheme();
  const {t} = useTranslation();

  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = async () => {
    if (!image) {
      setImageError(true);
      return;
    }
    if (!name) {
      setNameError(true);
      return;
    }

    try {
      setImageError(false);
      setNameError(false);

      if (existingEmojiId) {
        await deleteEmoji(spaceId, existingEmojiId);
      }
      await uploadEmojiToSpace(spaceId, image, name);
      uploadDialog.close();
    } catch (err) {
      console.error(err);
      toast.error(
        <ToastContent
          isDanger
          showCloseButton
          headerIconName="alert"
          text={t('spaceAdmin.manageEmoji.uploadDialog.errorSave')}
        />
      );
    }
  };

  return (
    <Dialog
      title={t('spaceAdmin.manageEmoji.uploadDialog.title')}
      hasBorder
      showCloseButton
      onClose={uploadDialog.close}
      approveInfo={{
        title: t('spaceAdmin.manageEmoji.uploadDialog.confirmButton'),
        onClick: handleSubmit,
        disabled: isUploadPending
      }}
    >
      <styled.DialogContainer>
        <Input
          label={t('spaceAdmin.manageEmoji.uploadDialog.emojiName')}
          type="text"
          onChange={setName}
          errorMessage={t('spaceAdmin.manageEmoji.uploadDialog.errorMissingName')}
          isError={nameError}
          disabled={isUploadPending}
        />
        <styled.ImageUploadContainer className={cn(imageError && 'error')}>
          {!!image && (
            <styled.PreviewImageHolder>
              <styled.Image src={URL.createObjectURL(image)} alt="Preview emoji" />
            </styled.PreviewImageHolder>
          )}
          <FileUploader
            theme={theme}
            label={
              image
                ? t('spaceAdmin.manageEmoji.uploadDialog.changeImage')
                : t('spaceAdmin.manageEmoji.uploadDialog.selectImage')
            }
            dragActiveLabel={t('fileUploader.dragActiveLabel')}
            onFilesUpload={(file) => {
              setImageError(false);
              setImage(file || null);
            }}
            onError={(err) => {
              console.log('File upload error:', err);
              setImageError(true);
            }}
            fileType="image"
          />
        </styled.ImageUploadContainer>
      </styled.DialogContainer>
    </Dialog>
  );
};

export default observer(UploadEmojiDialog);
