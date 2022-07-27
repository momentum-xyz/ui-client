import React, {FC, useEffect, useState} from 'react';
import {useTheme} from 'styled-components';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {Dialog, Dropdown, Heading, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {TileTypeEnum} from 'core/enums';
import {TileFormInterface} from 'api';
import {TILES_DROPDOWN_OPTIONS} from 'core/constants';

import {ImageTileForm, TextTileForm, VideoTileForm} from './components';
import * as styled from './TileForm.styled';

const TileForm: FC = () => {
  const theme = useTheme();
  const {collaborationStore} = useStore();
  const {dashboardStore, spaceStore} = collaborationStore;
  const {tileDialog, tileFormStore, dashboard} = dashboardStore;
  const {currentTile} = tileFormStore;

  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageError, setImageError] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    resetField,
    reset
  } = useForm<TileFormInterface>();

  useEffect(() => {
    setSelectedType(currentTile?.type ?? '');
  }, [currentTile]);

  useEffect(() => {
    return () => tileFormStore.resetModel();
  }, []);

  const formSubmitHandler: SubmitHandler<TileFormInterface> = async (data: TileFormInterface) => {
    let isUpdateSucceed = false;
    let isCreateSucceed = false;
    if (currentTile?.id) {
      if (selectedType === TileTypeEnum.TILE_TYPE_MEDIA) {
        if (!image) {
          setImageError(true);
          return;
        }

        isUpdateSucceed = await tileFormStore.updateImageTile(currentTile?.id, image);
        setImageError(false);
      } else {
        isUpdateSucceed = await tileFormStore.updateTextOrVideoTile(currentTile?.id, data);
      }
      tileDialog.close();
      if (isUpdateSucceed) {
        await dashboard.fetchDashboard(spaceStore.space.id);
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
    } else {
      if (selectedType === TileTypeEnum.TILE_TYPE_MEDIA) {
        if (!image) {
          setImageError(true);
          return;
        }
        isCreateSucceed = await tileFormStore.createImageTile(spaceStore.space.id, image);
        setImageError(false);
      } else {
        isCreateSucceed = await tileFormStore.createTextOrVideoTile(spaceStore.space.id, data);
      }
      tileDialog.close();
      if (isCreateSucceed) {
        await dashboard.fetchDashboard(spaceStore.space.id);
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
    }
    reset();
  };

  return (
    <Dialog
      theme={theme}
      title={t('dashboard.tileForm.title')}
      showCloseButton
      onClose={tileDialog.close}
      approveInfo={{
        title: currentTile?.id
          ? t('dashboard.tileForm.updateTile')
          : t('dashboard.tileForm.createTile'),
        onClick: handleSubmit(formSubmitHandler),
        disabled: !selectedType
      }}
      hasBorder
      closeOnBackgroundClick={false}
    >
      <styled.Container>
        <styled.Div>
          <styled.DropDownContainer>
            <Heading
              type="h4"
              align="left"
              label={t('dashboard.tileForm.tileType')}
              transform="uppercase"
              isCustom
            />
            <Controller
              name="type"
              defaultValue={currentTile?.type ? currentTile?.type : ''}
              control={control}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  placeholder={t('dashboard.tileForm.typePlaceholder')}
                  value={value}
                  options={TILES_DROPDOWN_OPTIONS}
                  onOptionSelect={(option) => {
                    onChange(option.value);
                    resetField('text_title');
                    resetField('text_description');
                    resetField('youtube_url');
                    setSelectedType(option.value);
                    setImageError(false);
                    setImage(undefined);
                  }}
                  variant="secondary"
                />
              )}
            />
          </styled.DropDownContainer>
          {selectedType === TileTypeEnum.TILE_TYPE_VIDEO && (
            <VideoTileForm control={control} errors={errors} currentTile={currentTile} />
          )}
          {selectedType === TileTypeEnum.TILE_TYPE_TEXT && (
            <TextTileForm control={control} errors={errors} currentTile={currentTile} />
          )}
          {selectedType === TileTypeEnum.TILE_TYPE_MEDIA && (
            <ImageTileForm
              setImage={setImage}
              image={image}
              setImageError={setImageError}
              imageError={imageError}
              currentTile={currentTile}
            />
          )}
        </styled.Div>
      </styled.Container>
    </Dialog>
  );
};

export default observer(TileForm);
