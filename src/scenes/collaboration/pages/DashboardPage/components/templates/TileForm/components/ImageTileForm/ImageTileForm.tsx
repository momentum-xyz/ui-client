import React, {Dispatch, FC, SetStateAction} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import cn from 'classnames';

import {appVariables} from 'api/constants';
import {FileUploader} from 'ui-kit';
import {TileInterface} from 'core/models';

import * as styled from './ImageTileForm.styled';

interface PropsInterface {
  setImage: Dispatch<SetStateAction<File | undefined>>;
  image: File | undefined;
  setImageError: Dispatch<SetStateAction<boolean>>;
  imageError: boolean;
  currentTile: TileInterface | null;
}

const ImageTileForm: FC<PropsInterface> = ({
  setImage,
  image,
  imageError,
  setImageError,
  currentTile
}) => {
  const theme = useTheme();

  const handleImage = (file: File | undefined) => {
    setImage(file);
    setImageError(false);
  };

  return (
    <styled.Item>
      <styled.FileUploaderItem>
        <styled.TileImageUpload className={cn(imageError && 'error')}>
          {(image || currentTile?.hash) && (
            <styled.ImagePreview
              src={
                (image && URL.createObjectURL(image)) ||
                (currentTile?.hash &&
                  `${appVariables.RENDER_SERVICE_URL}/get/${currentTile?.hash}`) ||
                undefined
              }
            />
          )}
          <FileUploader
            label={image ? t('fileUploader.changeLabel') : t('fileUploader.uploadLabel')}
            dragActiveLabel={t('fileUploader.dragActiveLabel')}
            fileType="image"
            theme={theme}
            onFilesUpload={handleImage}
            buttonIsCustom
          />
        </styled.TileImageUpload>
      </styled.FileUploaderItem>
    </styled.Item>
  );
};

export default observer(ImageTileForm);
