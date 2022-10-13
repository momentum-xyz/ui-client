import React, {FC} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {Button, Input, Loader} from '@momentum-xyz/ui-kit';

import {VideoTileFormInterface} from 'api';
import {TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {YOUTUBE_URL_PLACEHOLDER} from 'core/constants';
import {TileInterface} from 'core/models';

import * as styled from './VideoTileForm.styled';

interface PropsInterface {
  currentTile?: TileInterface;
  spaceId: string;
  createTile: (spaceId: string, data: VideoTileFormInterface) => Promise<boolean>;
  updateTile: (tileId: string, data: VideoTileFormInterface) => Promise<boolean>;
  onComplete: () => void;
  pendingRequest?: boolean;
}

const VideoTileForm: FC<PropsInterface> = ({
  currentTile,
  spaceId,
  createTile,
  updateTile,
  onComplete,
  pendingRequest
}) => {
  const {t} = useTranslation();

  const {
    control,
    formState: {errors},
    handleSubmit,
    reset
  } = useForm<VideoTileFormInterface>();

  const formSubmitHandler: SubmitHandler<VideoTileFormInterface> = async (
    data: VideoTileFormInterface
  ) => {
    if (!currentTile?.id) {
      if (await createTile(spaceId, data)) {
        onComplete();
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.tileCreateSuccess')}
            showCloseButton
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
            showCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      }
    } else {
      if (await updateTile(currentTile.id, data)) {
        onComplete();
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.tileUpdateSuccess')}
            showCloseButton
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
            showCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      }
    }

    reset();
  };

  return (
    <styled.Container>
      {pendingRequest ? (
        <styled.LoaderContainer>
          <Loader />
        </styled.LoaderContainer>
      ) : (
        <>
          <styled.TextItem>
            <Controller
              name="youtube_url"
              control={control}
              defaultValue={currentTile?.content?.url ?? ''}
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <Input
                  label={t('dashboard.tileForm.videoLabel')}
                  value={value}
                  onChange={onChange}
                  placeholder={YOUTUBE_URL_PLACEHOLDER}
                  isError={!!errors.youtube_url}
                />
              )}
            />
          </styled.TextItem>
          <styled.ButtonWrapper>
            <Button
              label={currentTile?.id ? 'update tile' : 'create tile'}
              onClick={handleSubmit(formSubmitHandler)}
            />
          </styled.ButtonWrapper>
        </>
      )}
    </styled.Container>
  );
};

export default observer(VideoTileForm);
