import React, {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import cn from 'classnames';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {appVariables} from 'api/constants';
import {Button, Loader, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {TileInterface} from 'core/models';

import * as styled from './ImageTileForm.styled';

interface PropsInterface {
  currentTile?: TileInterface;
  spaceId: string;
  createTile: (spaceId: string, image: File) => Promise<boolean>;
  updateTile: (tileId: string, image: File) => Promise<boolean>;
  onComplete: () => void;
  pendingRequest?: boolean;
}

const ImageTileForm: FC<PropsInterface> = ({
  currentTile,
  spaceId,
  createTile,
  updateTile,
  onComplete,
  pendingRequest
}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const [image, setImage] = useState<File>();
  const [imageError, setImageError] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if (!currentTile?.id) {
      if (!image) {
        setImageError(true);
        return;
      }
      setImageError(false);
      if (await createTile(spaceId, image)) {
        onComplete();
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.tileCreateSuccess')}
            isCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      } else {
        toast.error(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.tileCreateError')}
            isDanger
            isCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      }
    } else {
      if (!image) {
        setImageError(true);
        return;
      }
      setImageError(false);
      if (await updateTile(currentTile?.id, image)) {
        onComplete();
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.tileUpdateSuccess')}
            isCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      } else {
        toast.error(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.tileUpdateError')}
            isDanger
            isCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      }
    }
  }, [createTile, currentTile?.id, image, onComplete, spaceId, t, updateTile]);

  const handleImage = (file?: File) => {
    setImage(file);
    setImageError(false);
  };

  return (
    <styled.Container>
      {pendingRequest ? (
        <styled.LoaderContainer>
          <Loader />
        </styled.LoaderContainer>
      ) : (
        <>
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
              <styled.CustomFileUploader
                label={image ? t('fileUploader.changeLabel') : t('fileUploader.uploadLabel')}
                dragActiveLabel={t('fileUploader.dragActiveLabel')}
                fileType="image"
                theme={theme}
                onFilesUpload={handleImage}
                buttonClassName="uplaod-button"
              />
            </styled.TileImageUpload>
          </styled.FileUploaderItem>
          <styled.ButtonWrapper>
            <Button
              label={currentTile?.id ? 'update tile' : 'create tile'}
              onClick={handleSubmit}
            />
          </styled.ButtonWrapper>
        </>
      )}
    </styled.Container>
  );
};

export default observer(ImageTileForm);
