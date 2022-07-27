import React, {FC} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';

import {Button, Input, TextArea, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {TileInterface} from 'core/models';
import {TextTileFormInterface} from 'api';

import * as styled from './TextTileForm.styled';

interface PropsInterface {
  currentTile: TileInterface | null;
  spaceId: string;
  createTile: (spaceId: string, data: TextTileFormInterface) => void;
  updateTile: (spaceId: string, data: TextTileFormInterface) => void;
  onClose: () => void;
  fetchDashboard: (spaceId: string) => void;
}

const TextTileForm: FC<PropsInterface> = ({
  currentTile,
  spaceId,
  createTile,
  updateTile,
  onClose,
  fetchDashboard
}) => {
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
      const isSucceed = await createTile(spaceId, data);
      onClose();
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
      const isSucceed = await updateTile(currentTile.id, data);
      onClose();
      // @ts-ignore
      if (isSucceed) {
        await fetchDashboard(spaceId);
        if (isSucceed) {
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
    }

    reset();
  };

  return (
    <styled.Item>
      <styled.TextItem>
        <Controller
          name="text_title"
          control={control}
          defaultValue={currentTile ? currentTile?.content?.title : ''}
          rules={{required: true}}
          render={({field: {onChange, value}}) => (
            <Input
              label={t('dashboard.tileForm.textLabel')}
              value={value}
              onChange={onChange}
              isError={!!errors.text_title}
              placeholder={t('dashboard.tileForm.textPlaceholder')}
              isCustom
            />
          )}
        />
      </styled.TextItem>
      <styled.TextItem>
        <Controller
          name="text_description"
          control={control}
          defaultValue={currentTile ? currentTile?.content?.text : ''}
          rules={{required: true}}
          render={({field: {onChange, value}}) => (
            <TextArea
              name={t('dashboard.tileForm.descriptionLabel')}
              value={value}
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
    </styled.Item>
  );
};

export default observer(TextTileForm);
