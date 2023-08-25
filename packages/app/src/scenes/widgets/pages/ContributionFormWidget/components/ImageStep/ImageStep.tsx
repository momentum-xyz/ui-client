import {FC, ReactElement, useCallback, useEffect, useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import cn from 'classnames';
import {
  ButtonEllipse,
  ButtonRound,
  ButtonSquare,
  FileUploader,
  IconSvg,
  Image,
  ProgressBar,
  Textarea
} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {getImageAbsoluteUrl} from 'core/utils';
import {ContributionStepType} from 'core/types';
import {CanvasConfigInterface} from 'api/interfaces';
import {ContributionImageFormInterface} from 'core/interfaces';
import {ImageDataModelInterface} from 'scenes/widgets/stores/ContributionFormsStore';

import * as styled from './ImageStep.styled';

interface PropsInterface {
  config: CanvasConfigInterface;
  imageData: ImageDataModelInterface;
  isGenerating: boolean;
  generatedImages: string[];
  onGenerateImages: (prompt: string) => void;
  onClearGeneratedImages: () => void;
  setActiveStep: (step: ContributionStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onUpdate: (form: ContributionImageFormInterface) => void;
}

type ImageType = 'custom' | 'ai';

const MAX_ASSET_SIZE_MB = 8;
const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);
const MAX_GENERATION_COUNT = 2;

const ImageStep: FC<PropsInterface> = ({
  config,
  imageData,
  isGenerating,
  generatedImages,
  onClearGeneratedImages,
  onGenerateImages,
  onRenderActions,
  setActiveStep,
  onUpdate
}) => {
  const [generationCount, setGenerationCount] = useState(0);
  const [isClearConfirm, setIsClearConfirm] = useState(false);
  const [imageType, setImageType] = useState<ImageType>('ai');
  const [prompt, setPrompt] = useState<string>('');

  const {t} = useI18n();

  const {control, setValue, handleSubmit, watch} = useForm<ContributionImageFormInterface>({
    defaultValues: {
      fileUrlOrHash: getImageAbsoluteUrl(imageData.fileUrlOrHash),
      file: imageData.file
    }
  });

  useEffect(() => {
    if (!config.isLeonardo || imageData.file) {
      setImageType('custom');
    } else if (imageData.fileUrlOrHash) {
      setImageType('ai');
    }
  }, [config, imageData]);

  useEffect(() => {
    if (config.leonardoScript) {
      setPrompt(config.leonardoScript);
    }
  }, [config]);

  const [fileUrlOrHash, file] = watch(['fileUrlOrHash', 'file']);

  const formSubmitHandler: SubmitHandler<ContributionImageFormInterface> = useCallback(
    (form) => {
      onUpdate(form);
    },
    [onUpdate]
  );

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        backProps={{
          label: t('actions.back'),
          onClick: () => {
            setActiveStep('answers');
          }
        }}
        nextProps={{
          icon: 'person_idea',
          disabled: (imageType === 'ai' && !fileUrlOrHash) || (imageType === 'custom' && !file),
          label: t('actions.next'),
          onClick: () => {
            handleSubmit(formSubmitHandler)();
            setActiveStep('submit');
          }
        }}
      />
    );
  }, [imageType, fileUrlOrHash, file, onRenderActions]);

  return (
    <styled.Container data-testid="ImageStep-test">
      <styled.Grid>
        <styled.Header>{t('titles.addImageToIdea')}</styled.Header>
        <styled.Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </styled.Description>

        <styled.Separator />

        <styled.ImageTypeSelector>
          <ButtonSquare
            icon="ai"
            isActive={imageType === 'ai'}
            isDisabled={!config.isLeonardo}
            label={t('actions.createAIImage')}
            onClick={() => {
              setValue('file', null);
              setImageType('ai');
            }}
          />

          <ButtonSquare
            icon="picture_upload"
            isActive={imageType === 'custom'}
            label={t('actions.uploadImage')}
            onClick={() => {
              setValue('fileUrlOrHash', null);
              setImageType('custom');
            }}
          />
        </styled.ImageTypeSelector>

        {/* AI IMAGE */}
        {imageType === 'ai' && (
          <Controller
            name="fileUrlOrHash"
            control={control}
            render={({field: {value, onChange}}) => (
              <styled.AIContainer className={cn(isClearConfirm && 'no-height')}>
                {!isGenerating && generatedImages.length === 0 && (
                  <>
                    <styled.AITitle>Image Prompt based on your input</styled.AITitle>
                    <Textarea
                      lines={11}
                      value={prompt}
                      placeholder="Enter prompt for AI Image here. Describe what you would like to see?*"
                      onChange={setPrompt}
                    />
                    <styled.AIActions>
                      <div />
                      <ButtonEllipse
                        icon="ai"
                        disabled={!prompt}
                        label={t('actions.generateImage')}
                        onClick={() => {
                          onGenerateImages(prompt);
                          setGenerationCount(generationCount + 1);
                        }}
                      />
                    </styled.AIActions>
                  </>
                )}

                {isGenerating && (
                  <>
                    <styled.AITitle>Image is Generating, Please Wait</styled.AITitle>
                    <styled.AIProgress>
                      <styled.Progress>
                        <ProgressBar simulateProgress withLogo />
                      </styled.Progress>
                    </styled.AIProgress>
                    <styled.AIActions>
                      <ButtonEllipse icon="layout" label={t('actions.overview')} disabled />
                      <ButtonEllipse icon="adjust" label={t('actions.changeImage')} disabled />
                    </styled.AIActions>
                  </>
                )}

                {!isGenerating && generatedImages.length > 0 && (
                  <>
                    <styled.AITitle>Select your image</styled.AITitle>

                    {!value && !isClearConfirm && (
                      <styled.AIImagesGrid>
                        {generatedImages.map((url) => (
                          <Image
                            key={url}
                            src={url}
                            bordered
                            height={120}
                            errorIcon="ai"
                            onClick={() => onChange(url)}
                          />
                        ))}
                      </styled.AIImagesGrid>
                    )}

                    {!!value && !isClearConfirm && (
                      <Image bordered src={value} height={260} errorIcon="ai" />
                    )}

                    {isClearConfirm && (
                      <styled.ClearConfirmContainer>
                        <styled.AlertIcon>
                          <IconSvg name="alert" isWhite />
                        </styled.AlertIcon>
                        <styled.ClearConfirmInner>
                          <div>
                            Are you sure you want to remove these images and try again? There is a
                            maximum amount of 2 changes you can use.
                          </div>
                          <styled.ClearConfirmActions>
                            <ButtonEllipse
                              icon="close_large"
                              variant="thirty"
                              label={t('actions.cancel')}
                              onClick={() => setIsClearConfirm(false)}
                            />

                            <ButtonEllipse
                              icon="bin"
                              label={t('actions.remove')}
                              onClick={() => {
                                onChange(null);
                                onClearGeneratedImages();
                                setIsClearConfirm(false);
                              }}
                            />
                          </styled.ClearConfirmActions>
                        </styled.ClearConfirmInner>
                      </styled.ClearConfirmContainer>
                    )}

                    <styled.AIActions>
                      <ButtonEllipse
                        icon="layout"
                        disabled={!value}
                        label={t('actions.overview')}
                        onClick={() => onChange(null)}
                      />
                      <ButtonEllipse
                        icon="adjust"
                        isActive={isClearConfirm}
                        label={t('actions.Change image')}
                        disabled={!!value || generationCount === MAX_GENERATION_COUNT}
                        onClick={() => {
                          setIsClearConfirm(true);
                        }}
                      />
                    </styled.AIActions>
                  </>
                )}
              </styled.AIContainer>
            )}
          />
        )}

        {/* CUSTOM IMAGE */}
        {imageType === 'custom' && (
          <Controller
            name="file"
            control={control}
            render={({field: {value, onChange}}) => {
              const imageUrl = value ? URL.createObjectURL(value) : null;

              return (
                <styled.CustomImage>
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
                            <Image src={imageUrl} height={258} />
                          </styled.PreviewImage>
                          <styled.ClearSelectedImage>
                            <ButtonRound
                              icon="close_large"
                              onClick={() => {
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
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(ImageStep);
