import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';
import cn from 'classnames';

import {Dialog, FileUploader, Input, ToastContent} from 'ui-kit';

import * as styled from './UploadEmojiDialog.styled';

interface PropsInterface {
  fileType?: string;
  onSave: (file: File, name: string) => Promise<void>;
  onClose: () => void;
}

const UploadEmojiDialog: FC<PropsInterface> = ({fileType = '.png', onSave, onClose}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);

      await onSave(image, name);
    } catch (err) {
      console.error(err);
      toast.error(
        <ToastContent
          isDanger
          showCloseButton
          headerIconName="alert"
          // title={t('titles.alert')}
          text={t('spaceAdmin.manageEmoji.uploadDialog.title')}
        />
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      title={t('spaceAdmin.manageEmoji.uploadDialog.title')}
      hasBorder
      showCloseButton
      onClose={onClose}
      approveInfo={{
        title: t('spaceAdmin.manageEmoji.uploadDialog.confirmButton'),
        onClick: handleSubmit,
        disabled: isLoading
      }}
    >
      <styled.DialogContainer>
        <Input
          label={t('spaceAdmin.manageEmoji.uploadDialog.emojiName')}
          type="text"
          onChange={setName}
          errorMessage={t('spaceAdmin.manageEmoji.uploadDialog.errorMissingName')}
          isError={nameError}
          disabled={isLoading}
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
              console.log('On upload', file, typeof file);
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

export default UploadEmojiDialog;
