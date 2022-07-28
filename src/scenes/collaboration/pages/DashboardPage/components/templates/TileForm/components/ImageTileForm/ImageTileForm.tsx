import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import cn from 'classnames';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {appVariables} from 'api/constants';
import {Button, FileUploader, Loader, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {TileInterface} from 'core/models';

import * as styled from './ImageTileForm.styled';

interface PropsInterface {
  currentTile?: TileInterface;
  spaceId: string;
  createTile: (spaceId: string, image: File) => void;
  updateTile: (tileId: string, image: File) => void;
  fetchDashboard: (spaceId: string) => void;
  createRequestPending?: boolean;
  updateRequestPending?: boolean;
  uploadRequestPending?: boolean;
}

const ImageTileForm: FC<PropsInterface> = ({
  currentTile,
  spaceId,
  createTile,
  updateTile,
  fetchDashboard,
  createRequestPending,
  updateRequestPending,
  uploadRequestPending
}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const [image, setImage] = useState<File>();
  const [imageError, setImageError] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!currentTile?.id) {
      if (!image) {
        setImageError(true);
        return;
      }
      const isSucceed = await createTile(spaceId, image);
      setImageError(false);

      // @ts-ignore
      if (isSucceed) {
        await fetchDashboard(spaceId);
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
      const isSucceed = await updateTile(currentTile?.id, image);
      setImageError(false);

      // @ts-ignore
      if (isSucceed) {
        await fetchDashboard(spaceId);
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
  };

  const handleImage = (file?: File) => {
    setImage(file);
    setImageError(false);
  };

  return (
    <styled.Container>
      {updateRequestPending || createRequestPending || uploadRequestPending ? (
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
