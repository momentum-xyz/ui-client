import {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import cn from 'classnames';
import {useI18n} from '@momentum-xyz/core';
import {
  Frame,
  Image,
  Input,
  Loader,
  Select,
  Button,
  IconSvg,
  Textarea,
  ButtonEllipse,
  ButtonRound,
  FileUploader,
  ImageSizeEnum,
  SelectOptionInterface,
  Warning
} from '@momentum-xyz/ui-kit';

import {LeonardoModelIdEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';
import {CustomizableObjectInterface} from 'api';
import {CustomizableObjectFormInterface} from 'core/interfaces';

import * as styled from './NewOrEditForm.styled';

interface PropsInterface {
  content?: CustomizableObjectInterface | null;
  isPending: boolean;
  isGenerating: boolean;
  generatedImages: string[];
  onGenerateImages: (prompt: string, modelId: LeonardoModelIdEnum) => void;
  onCreateOrUpdate: (form: CustomizableObjectFormInterface) => void;
  onClearGeneratedImages: () => void;
  onBack: () => void;
}

type ImageType = 'custom' | 'ai';

const MAX_ASSET_SIZE_MB = 8;
const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);

const MODEL_OPTIONS: SelectOptionInterface<LeonardoModelIdEnum>[] = [
  {
    label: 'Creative',
    value: LeonardoModelIdEnum.CREATIVE
  },
  {
    label: 'Select',
    value: LeonardoModelIdEnum.SELECT
  },
  {
    label: 'Signature',
    value: LeonardoModelIdEnum.SIGNATURE
  }
];

const NewOrEditForm: FC<PropsInterface> = ({
  content,
  isPending,
  isGenerating,
  generatedImages,
  onGenerateImages,
  onClearGeneratedImages,
  onCreateOrUpdate,
  onBack
}) => {
  const [selectedImageType, setSelectedImageType] = useState<ImageType | null>(null);
  const [modelId, setModelId] = useState<LeonardoModelIdEnum | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isClearConfirm, setIsClearConfirm] = useState(false);
  const [isImageCleared, setIsImageCleared] = useState(false);

  const {t} = useI18n();

  const {
    watch,
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
      if (isGenerating) {
        return;
      }

      if (imageType !== selectedImageType) {
        setPrompt(null);
        setModelId(null);
        setSelectedImageType(imageType);

        onClearGeneratedImages();

        setValue('image', undefined);
        setValue('imageAIUrl', undefined);
      }
    },
    [isGenerating, onClearGeneratedImages, selectedImageType, setValue]
  );

  const handleGenerateImages = useCallback(() => {
    if (prompt && modelId) {
      onGenerateImages(prompt, modelId);
    }
  }, [modelId, onGenerateImages, prompt]);

  const handleClearGeneratedImages = useCallback(() => {
    setValue('imageAIUrl', undefined);
    setIsClearConfirm(false);
    onClearGeneratedImages();
  }, [onClearGeneratedImages, setValue]);

  const handleCreateOrUpdate = handleSubmit((form: CustomizableObjectFormInterface) => {
    onCreateOrUpdate(form);
  });

  const [imageValue, imageAIUrlValue] = watch(['image', 'imageAIUrl']);

  return (
    <styled.Container data-testid="NewOrEditForm-test">
      <Frame>
        <styled.Title>What’s your Contribution?</styled.Title>
        <styled.Description>
          Please enter your idea and personalize the object with an image.
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
                lines={4}
                value={value}
                placeholder="Write your story here*"
                danger={!!errors.text}
                onChange={onChange}
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
            name="image"
            control={control}
            render={({field: {value, onChange}}) => {
              const imageUrl = value
                ? URL.createObjectURL(value)
                : getImageAbsoluteUrl(
                    !isImageCleared ? content?.image_hash : null,
                    ImageSizeEnum.S5
                  );

              return (
                <styled.CustomImage className={cn(!!errors.image && 'error')}>
                  <styled.Uploader>
                    <FileUploader
                      fileType="image"
                      enableDragAndDrop
                      label={!imageUrl ? 'Upload from computer' : undefined}
                      dragActiveLabel={t('actions.dropItHere')}
                      maxSize={MAX_ASSET_SIZE_B}
                      onFilesUpload={onChange}
                    >
                      {imageUrl ? (
                        <>
                          <styled.PreviewImage>
                            <Image src={imageUrl} height={278} />
                          </styled.PreviewImage>
                          <styled.ClearSelectedImage>
                            <ButtonRound
                              icon="close_large"
                              onClick={() => {
                                setIsImageCleared(true);
                                onChange(undefined);
                              }}
                            />
                          </styled.ClearSelectedImage>
                        </>
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
        {selectedImageType === 'ai' && (
          <styled.AIInputsContainer>
            {!isGenerating && generatedImages.length === 0 && (
              <styled.AIInputs>
                <Textarea
                  lines={4}
                  value={prompt}
                  placeholder="Enter prompt for AI Image here. Describe what you would like to see?*"
                  danger={!!errors.text}
                  onChange={setPrompt}
                />

                <Select
                  wide
                  isClearable
                  value={modelId}
                  options={MODEL_OPTIONS}
                  placeholder="Select a model*"
                  onSingleChange={setModelId}
                />

                <styled.CreateAIImagesButton>
                  <ButtonEllipse
                    icon="picture"
                    label="Create image"
                    disabled={!prompt || !modelId}
                    onClick={handleGenerateImages}
                  />
                </styled.CreateAIImagesButton>
              </styled.AIInputs>
            )}

            {isGenerating && (
              <styled.AIImagesContainer>
                <styled.Subtitle>Image is generating, please wait</styled.Subtitle>
                <styled.Loader>
                  <Loader />
                </styled.Loader>
              </styled.AIImagesContainer>
            )}

            {!isGenerating && generatedImages.length > 0 && (
              <>
                <Controller
                  name="imageAIUrl"
                  control={control}
                  render={({field: {value, onChange}}) => (
                    <styled.AIImagesContainer className={cn(isClearConfirm && 'withoutHeight')}>
                      {isClearConfirm && (
                        <styled.ClearConfirmContainer>
                          <styled.AlertIcon>
                            <IconSvg name="alert" isWhite />
                          </styled.AlertIcon>
                          <styled.ClearConfirmInner>
                            <div>Are you sure you want to remove these images and try again?</div>
                            <styled.ClearConfirmActions>
                              <ButtonEllipse
                                icon="close_large"
                                variant="thirty"
                                label={t('actions.cancel')}
                                onClick={() => setIsClearConfirm(false)}
                              />

                              <ButtonEllipse
                                icon="bin"
                                label={t('actions.delete')}
                                onClick={handleClearGeneratedImages}
                              />
                            </styled.ClearConfirmActions>
                          </styled.ClearConfirmInner>
                        </styled.ClearConfirmContainer>
                      )}

                      {!isClearConfirm && !value && (
                        <>
                          <styled.Subtitle>Choose an image</styled.Subtitle>
                          <styled.AIImagesGrid>
                            {generatedImages.map((url) => (
                              <Image
                                key={url}
                                src={url}
                                bordered
                                height={130}
                                errorIcon="ai"
                                onClick={() => onChange(url)}
                              />
                            ))}
                          </styled.AIImagesGrid>
                        </>
                      )}

                      {!isClearConfirm && !!value && (
                        <>
                          <styled.Subtitle>Choose an image</styled.Subtitle>
                          <styled.SelectedAIImage>
                            <Image bordered src={value} height={270} errorIcon="ai" />
                            <styled.ClearSelectedAIImage>
                              <ButtonRound icon="close_large" onClick={() => onChange(undefined)} />
                            </styled.ClearSelectedAIImage>
                          </styled.SelectedAIImage>
                        </>
                      )}
                    </styled.AIImagesContainer>
                  )}
                />

                <styled.ClearAIImagesButton>
                  <ButtonEllipse
                    icon="chevron_left"
                    label="Make new image"
                    onClick={() => setIsClearConfirm(true)}
                  />
                </styled.ClearAIImagesButton>
              </>
            )}
          </styled.AIInputsContainer>
        )}
      </Frame>

      <styled.Separator />

      {selectedImageType === 'ai' && generatedImages.length === 0 && !isGenerating && (
        <styled.Warning>
          <Warning message={t('errors.addImageBeforeContribution')} wide />
        </styled.Warning>
      )}

      <styled.Actions>
        <div>{!!content && <Button label={t('actions.back')} onClick={onBack} />}</div>
        <Button
          label="Contribute"
          onClick={handleCreateOrUpdate}
          disabled={
            !isValid ||
            isPending ||
            (!content && !imageValue && !imageAIUrlValue) ||
            (!!content && isImageCleared && !imageValue && !imageAIUrlValue)
          }
        />
      </styled.Actions>
    </styled.Container>
  );
};

export default observer(NewOrEditForm);
