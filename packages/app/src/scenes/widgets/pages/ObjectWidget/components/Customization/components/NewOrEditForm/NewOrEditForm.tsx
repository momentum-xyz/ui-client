import {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import cn from 'classnames';
import {useI18n} from '@momentum-xyz/core';
import {
  Button,
  ButtonRound,
  FileUploader,
  Frame,
  IconSvg,
  ImageSizeEnum,
  Input,
  Textarea
} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {CustomizableObjectInterface} from 'api';
import {CustomizableObjectFormInterface} from 'core/interfaces';

import * as styled from './NewOrEditForm.styled';

interface PropsInterface {
  content?: CustomizableObjectInterface | null;
  isPending: boolean;
  onCreateOrUpdate: (form: CustomizableObjectFormInterface) => void;
  onBack: () => void;
}

type ImageType = 'custom' | 'ai';

const MAX_ASSET_SIZE_MB = 8;
const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);

const NewOrEditForm: FC<PropsInterface> = ({content, isPending, onCreateOrUpdate, onBack}) => {
  const [selectedImageType, setSelectedImageType] = useState<ImageType | null>(null);

  const {t} = useI18n();

  const {
    control,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<CustomizableObjectFormInterface>();

  useEffect(() => {
    if (content) {
      setValue('title', content.title);
      setValue('text', content.text);
      setSelectedImageType('custom');
    }
  }, [content, setValue]);

  const handleImageType = useCallback(
    (imageType: ImageType) => {
      if (imageType !== selectedImageType) {
        setSelectedImageType(imageType);
        setValue('image', undefined);
      }
    },
    [selectedImageType, setValue]
  );

  const handleCreateOrUpdate = handleSubmit((form: CustomizableObjectFormInterface) => {
    onCreateOrUpdate(form);
  });

  return (
    <styled.Container data-testid="NewOrEditForm-test">
      <Frame>
        <styled.Title>What’s your Contribution?</styled.Title>
        <styled.Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </styled.Description>
      </Frame>

      <styled.Separator />

      <Frame>
        <styled.InputsContainer>
          <styled.Subtitle>Add your message*</styled.Subtitle>

          {/* TITLE */}
          <Controller
            name="title"
            control={control}
            rules={{required: true, minLength: 2}}
            render={({field: {value, onChange}}) => (
              <Input
                wide
                value={value}
                placeholder="Name the object*"
                danger={!!errors.title}
                onChange={onChange}
              />
            )}
          />

          {/* TEXT */}
          <Controller
            name="text"
            control={control}
            rules={{required: true, minLength: 2}}
            render={({field: {value, onChange}}) => (
              <Textarea
                value={value}
                placeholder="Write your story here*"
                danger={!!errors.text}
                onChange={onChange}
                lines={8}
              />
            )}
          />
        </styled.InputsContainer>
      </Frame>

      <Frame>
        <styled.Subtitle>
          <span>Add an image*</span>
          {selectedImageType && (
            <styled.ImageTypeButtons>
              <ButtonRound
                icon="picture_upload"
                isActive={selectedImageType === 'custom'}
                onClick={() => handleImageType('custom')}
              />
              <ButtonRound
                icon="ai"
                isActive={selectedImageType === 'ai'}
                onClick={() => handleImageType('ai')}
              />
            </styled.ImageTypeButtons>
          )}
        </styled.Subtitle>

        {/* SELECT IMAGE TYPE */}
        {!selectedImageType && (
          <styled.ImageTypeSelector>
            <styled.ImageType onClick={() => handleImageType('custom')}>
              <IconSvg name="picture_upload" size="xll" isWhite />
              <span>Upload an image</span>
            </styled.ImageType>

            <styled.ImageType onClick={() => handleImageType('ai')}>
              <IconSvg name="ai" size="xll" isWhite />
              <span>Create an AI image</span>
            </styled.ImageType>
          </styled.ImageTypeSelector>
        )}

        {/* CUSTOM IMAGE */}
        {selectedImageType === 'custom' && (
          <Controller
            control={control}
            name="image"
            rules={{required: true}}
            render={({field: {value, onChange}}) => {
              const imageUrl = value
                ? URL.createObjectURL(value)
                : getImageAbsoluteUrl(content?.image_hash, ImageSizeEnum.S5);

              return (
                <styled.CustomImage className={cn(!!errors.image && 'error')}>
                  <styled.Uploader>
                    <FileUploader
                      fileType="image"
                      enableDragAndDrop
                      label="Upload from computer"
                      dragActiveLabel={t('actions.dropItHere')}
                      maxSize={MAX_ASSET_SIZE_B}
                      onFilesUpload={onChange}
                    >
                      {imageUrl ? (
                        <styled.PreviewImage style={{backgroundImage: `url(${imageUrl})`}} />
                      ) : (
                        <styled.DragAndDropPrompt>
                          <span>{t('messages.uploadAssetPictureDescription')}</span>
                          <span>{t('labels.or')}</span>
                        </styled.DragAndDropPrompt>
                      )}
                    </FileUploader>
                  </styled.Uploader>
                </styled.CustomImage>
              );
            }}
          />
        )}

        {/* AI IMAGE */}
        {selectedImageType === 'ai' && <div>ai</div>}
      </Frame>

      <styled.Separator />

      <styled.Actions>
        <div>{!!content && <Button label={t('actions.back')} onClick={onBack} />}</div>
        <Button
          label="Contribute"
          onClick={handleCreateOrUpdate}
          disabled={!isValid || isPending}
        />
      </styled.Actions>
    </styled.Container>
  );
};

export default observer(NewOrEditForm);
