import React, {FC} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {Button, Input, Loader, TextArea} from '@momentum/ui-kit';

import {TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {TileInterface} from 'core/models';
import {TextTileFormInterface} from 'api';

import * as styled from './TextTileForm.styled';

const TEXTAREA_LINES = 10;

interface PropsInterface {
  currentTile?: TileInterface;
  spaceId: string;
  createTile: (spaceId: string, data: TextTileFormInterface) => Promise<boolean>;
  updateTile: (tileId: string, data: TextTileFormInterface) => Promise<boolean>;
  onComplete: () => void;
  pendingRequest?: boolean;
}

const TextTileForm: FC<PropsInterface> = ({
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
  } = useForm<TextTileFormInterface>();

  const formSubmitHandler: SubmitHandler<TextTileFormInterface> = async (
    data: TextTileFormInterface
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
              name="text_title"
              control={control}
              defaultValue={currentTile?.content?.title ?? ''}
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <Input
                  label={t('dashboard.tileForm.textLabel')}
                  value={value}
                  onChange={onChange}
                  isError={!!errors.text_title}
                  placeholder={t('dashboard.tileForm.textPlaceholder')}
                />
              )}
            />
          </styled.TextItem>
          <styled.TextItem>
            <Controller
              name="text_description"
              control={control}
              defaultValue={currentTile?.content?.text ?? ''}
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <TextArea
                  name={t('dashboard.tileForm.descriptionLabel')}
                  value={value}
                  lines={TEXTAREA_LINES}
                  onChange={onChange}
                  placeholder={t('dashboard.tileForm.descriptionPlaceholder')}
                  isError={!!errors.text_description}
                  isResizable={true}
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

export default observer(TextTileForm);
