import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import cn from 'classnames';

import {Dialog, FileUploader, Input} from 'ui-kit';

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
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleUpload = async () => {
    if (image && name) {
      try {
        setImageError(false);
        await onSave(image, name);
      } catch (err) {
        console.error(err);
        setImageError(true);
      }
    }
  };

  return (
    <Dialog
      title={t('spaceAdmin.manageEmoji.uploadEmoji')}
      showCloseButton
      hasBorder
      isBodyExtendingToEdges
      onClose={onClose}
      approveInfo={
        image && name
          ? {
              title: t('spaceAdmin.manageEmoji.uploadEmoji'),
              onClick: handleUpload
            }
          : undefined
      }
    >
      <styled.DialogContainer className={cn(imageError && 'error')}>
        <Input
          label="Name"
          type="text"
          onChange={(val) => setName(val)}
          errorMessage="omg"
          isError={false}
        />
        {!!image && (
          <styled.PreviewImageHolder>
            <styled.Image src={URL.createObjectURL(image)} alt="Preview emoji" />
          </styled.PreviewImageHolder>
        )}
        <styled.ImageUploadContainer>
          <FileUploader
            theme={theme}
            label={image ? t('fileUploader.changeLabel') : t('fileUploader.uploadLabel')}
            dragActiveLabel={t('fileUploader.dragActiveLabel')}
            onFilesUpload={(file) => {
              console.log('On upload', file, typeof file);
              setImage(file || null);
            }}
            fileType="image"
          />
        </styled.ImageUploadContainer>
      </styled.DialogContainer>
    </Dialog>
  );
};

export default UploadEmojiDialog;
