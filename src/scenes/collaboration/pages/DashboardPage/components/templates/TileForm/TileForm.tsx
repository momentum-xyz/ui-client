import React, {FC, useState} from 'react';
import {useTheme} from 'styled-components';
import {Controller, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {Dialog, Dropdown, FileUploader, Heading, Input, TextArea} from 'ui-kit';
import {TileTypeEnum} from 'core/enums';

import {ApplyTokenRuleInterface} from '../../../../../../../api';

import * as styled from './TileForm.styled';

const TileForm: FC = () => {
  const theme = useTheme();
  const {collaborationStore} = useStore();
  const {dashboardManager} = collaborationStore;
  const {tileDialog} = dashboardManager;

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [image, setImage] = useState<File | undefined>(undefined);

  const {control} = useForm<ApplyTokenRuleInterface>();

  const handleImage = (file: File | undefined) => {
    setImage(file);
  };

  return (
    <Dialog
      theme={theme}
      title="CREATE A NEW TILE"
      showCloseButton
      onClose={tileDialog.close}
      approveInfo={{
        title: 'create tile',
        onClick: () => console.info('test'),
        disabled: selectedType === null
      }}
      hasBorder
    >
      <styled.Container>
        <styled.Div>
          <styled.DropDownContainer>
            <Heading type="h4" align="left" label="Tile type" transform="uppercase" isCustom />
            <Controller
              name="role"
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
                    setSelectedType(option.value);
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
                <Input
                  label="Youtube video url"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  isCustom
                />
              </styled.TextItem>
            </styled.Item>
          )}
          {selectedType === TileTypeEnum.TILE_TYPE_TEXT && (
            <styled.Item>
              <styled.TextItem>
                <Input label="Title" placeholder="Please choose a title" isCustom />
              </styled.TextItem>
              <styled.TextItem>
                <TextArea
                  name="description"
                  placeholder="Please write a description"
                  isResizable={true}
                />
              </styled.TextItem>
            </styled.Item>
          )}
          {selectedType === TileTypeEnum.TILE_TYPE_MEDIA && (
            <styled.Item>
              <styled.FileUploaderItem>
                <styled.TileImageUpload>
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
