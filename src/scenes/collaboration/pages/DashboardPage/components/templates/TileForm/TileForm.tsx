import React, {FC, useEffect, useState} from 'react';
import {useTheme} from 'styled-components';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import cn from 'classnames';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {
  Dialog,
  Dropdown,
  FileUploader,
  Heading,
  Input,
  TextArea,
  TOAST_COMMON_OPTIONS,
  ToastContent
} from 'ui-kit';
import {TileTypeEnum} from 'core/enums';
import {TileFormInterface} from 'api';
import {appVariables} from 'api/constants';

import * as styled from './TileForm.styled';

const TileForm: FC = () => {
  const theme = useTheme();
  const {collaborationStore} = useStore();
  const {dashboardManager, spaceStore} = collaborationStore;
  const {tileDialog, tileFormStore, dashboard} = dashboardManager;
  const {tileCreateRequest, tileUpdateRequest, currentTile} = tileFormStore;

  const [selectedType, setSelectedType] = useState<string | null>(null);
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
    if (currentTile?.id) {
      if (selectedType === TileTypeEnum.TILE_TYPE_MEDIA) {
        if (!image) {
          setImageError(true);
          return;
        }

        await tileFormStore.updateTile(currentTile?.id, image, data);
        setImageError(false);
      } else {
        await tileFormStore.updateTile(currentTile?.id, undefined, data);
      }
    } else {
      if (selectedType === TileTypeEnum.TILE_TYPE_MEDIA) {
        if (!image) {
          setImageError(true);
          return;
        }

        await tileFormStore.createTile(spaceStore.space.id, image, data);
        setImageError(false);
      } else {
        await tileFormStore.createTile(spaceStore.space.id, undefined, data);
      }
    }

    if (tileCreateRequest.isDone) {
      tileDialog.close();
      await dashboard.fetchDashboard(spaceStore.space.id);
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text="Your tile has been created successfully"
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else if (tileCreateRequest.isError) {
      tileDialog.close();
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text="There was a problem creating your tile"
          isDanger
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else if (tileUpdateRequest.isDone) {
      tileDialog.close();
      await dashboard.fetchDashboard(spaceStore.space.id);
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text="Your tile has been updated successfully"
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else if (tileUpdateRequest.isError) {
      tileDialog.close();
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text="There was a problem updating your tile"
          isDanger
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
    reset();
  };

  const handleImage = (file: File | undefined) => {
    setImage(file);
    setImageError(false);
  };

  return (
    <Dialog
      theme={theme}
      title="CREATE A NEW TILE"
      showCloseButton
      onClose={tileDialog.close}
      approveInfo={{
        title: currentTile?.id ? 'update tile' : 'create tile',
        onClick: handleSubmit(formSubmitHandler),
        disabled: selectedType === null
      }}
      hasBorder
      closeOnBackgroundClick={false}
    >
      <styled.Container>
        <styled.Div>
          <styled.DropDownContainer>
            <Heading type="h4" align="left" label="Tile type" transform="uppercase" isCustom />
            <Controller
              name="type"
              defaultValue={currentTile?.type ? currentTile?.type : ''}
              control={control}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  placeholder="Select a type"
                  value={value}
                  options={[
                    {
                      label: 'Text',
                      value: TileTypeEnum.TILE_TYPE_TEXT
                    },
                    {
                      label: 'Image',
                      value: TileTypeEnum.TILE_TYPE_MEDIA
                    },
                    {
                      label: 'Video',
                      value: TileTypeEnum.TILE_TYPE_VIDEO
                    }
                  ]}
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
            <styled.Item>
              <styled.TextItem>
                <Controller
                  name="youtube_url"
                  control={control}
                  defaultValue={currentTile ? currentTile?.content?.url : ''}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <Input
                      label="Youtube video url"
                      value={value}
                      onChange={onChange}
                      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      isError={!!errors.youtube_url}
                      isCustom
                    />
                  )}
                />
              </styled.TextItem>
            </styled.Item>
          )}
          {selectedType === TileTypeEnum.TILE_TYPE_TEXT && (
            <styled.Item>
              <styled.TextItem>
                <Controller
                  name="text_title"
                  control={control}
                  defaultValue={currentTile ? currentTile?.content?.title : ''}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <Input
                      label="Title"
                      value={value}
                      onChange={onChange}
                      isError={!!errors.text_title}
                      placeholder="Please choose a title"
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
                      name="description"
                      value={value}
                      onChange={onChange}
                      placeholder="Please write a description"
                      isError={!!errors.text_description}
                      isResizable={true}
                    />
                  )}
                />
              </styled.TextItem>
            </styled.Item>
          )}
          {selectedType === TileTypeEnum.TILE_TYPE_MEDIA && (
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
          )}
        </styled.Div>
      </styled.Container>
    </Dialog>
  );
};

export default observer(TileForm);
