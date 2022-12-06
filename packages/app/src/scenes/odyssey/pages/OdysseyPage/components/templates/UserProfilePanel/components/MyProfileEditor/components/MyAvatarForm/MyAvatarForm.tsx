import React, {FC, useState} from 'react';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';
import {Dialog} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './MyAvatarForm.styled';

const MyAvatarForm: FC = () => {
  const {userProfileStore} = useStore().odysseyStore;
  const {userProfile} = userProfileStore;

  const theme = useTheme();

  const [image, setImage] = useState<File>();
  const [imageError, setImageError] = useState(false);

  const {t} = useTranslation();

  const handleImage = (file?: File) => {
    setImage(file);
    setImageError(false);
  };

  const handleSubmit = () => {
    if (image) {
      userProfileStore.setImage(image);
      userProfileStore.editAvatarDialog.close();
    } else {
      setImageError(true);
    }
  };

  return (
    <Dialog
      theme={theme}
      title={t('editProfileWidget.changeAvatar')}
      showCloseButton
      onClose={userProfileStore.editAvatarDialog.close}
      approveInfo={{
        title: t('editProfileWidget.upload'),
        onClick: handleSubmit
      }}
      hasBorder
      closeOnBackgroundClick={false}
    >
      <styled.Wrapper>
        <styled.FileUploaderItem>
          <styled.AvatarImageUpload className={cn(imageError && 'error')}>
            {image && <styled.ImagePreview src={URL.createObjectURL(image)} />}
            {!image && !!userProfile?.profile?.avatarHash && (
              <styled.ImagePreview src={userProfile.avatarSrc} />
            )}
            <styled.CustomFileUploader
              theme={theme}
              label={image ? t('fileUploader.changeLabel') : t('fileUploader.uploadLabel')}
              fileType="image"
              dragActiveLabel={t('fileUploader.dragActiveLabel')}
              onFilesUpload={handleImage}
              buttonClassName="upload-button"
            />
          </styled.AvatarImageUpload>
        </styled.FileUploaderItem>
      </styled.Wrapper>
    </Dialog>
  );
};

export default MyAvatarForm;
