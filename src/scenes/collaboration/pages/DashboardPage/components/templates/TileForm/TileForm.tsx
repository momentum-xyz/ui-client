import React, {FC, useState} from 'react';
import {useTheme} from 'styled-components';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import cn from 'classnames';

import {useStore} from 'shared/hooks';
import {Dialog, Dropdown, FileUploader, Heading, Input, TextArea} from 'ui-kit';
import {TileTypeEnum} from 'core/enums';
import {TileFormInterface} from 'api';

import * as styled from './TileForm.styled';

const TileForm: FC = () => {
  const theme = useTheme();
  const {collaborationStore} = useStore();
  const {dashboardManager} = collaborationStore;
  const {tileDialog} = dashboardManager;

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageError, setImageError] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    resetField
  } = useForm<TileFormInterface>();

  const formSubmitHandler: SubmitHandler<TileFormInterface> = async (data: TileFormInterface) => {
    if (selectedType === TileTypeEnum.TILE_TYPE_MEDIA) {
      if (!image) {
        setImageError(true);
        return;
      }
      setImageError(false);
      console.info(image);
    } else {
      console.info(data);
    }
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
        title: 'create tile',
        onClick: handleSubmit(formSubmitHandler),
        disabled: selectedType === null
      }}
      hasBorder
    >
      <styled.Container>
        <styled.Div>
          <styled.DropDownContainer>
            <Heading type="h4" align="left" label="Tile type" transform="uppercase" isCustom />
            <Controller
              name="type"
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
                  {image && (
                    <styled.ImagePreview src={(image && URL.createObjectURL(image)) || undefined} />
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
