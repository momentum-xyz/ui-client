import {FC, MutableRefObject, useEffect, useState} from 'react';
import {Frame, Input, FileUploader} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';

import {ImageObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';
import {PluginIdEnum} from 'api/enums';

import * as styled from './AssignImage.styled';

const MAX_ASSET_SIZE_MB = 8;
const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);

interface PropsInterface {
  actionRef: MutableRefObject<{doSave: () => void; doDelete: () => void}>;
  objectId: string;
}

const AssignImage: FC<PropsInterface> = ({actionRef, objectId}) => {
  const {universeStore} = useStore();
  const {objectStore} = universeStore;
  const {assetStore} = objectStore;

  const [hasImage, setHasImage] = useState<boolean>(!!assetStore.imageSrc);

  const {t} = useI18n();

  const {
    handleSubmit,
    control,
    formState: {errors},
    setValue
  } = useForm<ImageObjectInterface>({});

  useEffect(() => {
    const sameValues = hasImage && !!assetStore.imageSrc;
    if (sameValues) {
      return;
    }
    setHasImage(!!assetStore.imageSrc);
  }, [assetStore.imageSrc, setHasImage]);

  useEffect(() => {
    if (assetStore.title) {
      setValue('title', assetStore.title);
    }
  }, [assetStore.title]);

  const formSubmitHandler: SubmitHandler<ImageObjectInterface> = async (
    data: ImageObjectInterface
  ) => {
    if (!data.image) {
      return;
    }

    await assetStore.postNewImage(objectId, data.image, data.title);
  };

  // TEMP
  actionRef.current = {
    doSave: handleSubmit(formSubmitHandler),
    doDelete: async () => {
      await assetStore.deleteFunction(objectId, PluginIdEnum.IMAGE);
    }
  };

  return (
    <styled.Container data-testid="AssignImage-test">
      <styled.InfoContainer>
        <div>{t('labels.embedPicture')}</div>
        <span>{t('labels.embedPictureInfo')}</span>
      </styled.InfoContainer>
      <styled.Wrapper>
        <Frame>
          <Controller
            control={control}
            name="image"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <styled.ImageUploadContainer
                className={cn(
                  'test',
                  !!errors.image && 'error',
                  (value || assetStore.imageSrc) && 'has-image'
                )}
              >
                {value ? (
                  <styled.PreviewImageHolder
                    style={{backgroundImage: `url(${URL.createObjectURL(value)})`}}
                  />
                ) : (
                  assetStore.imageSrc && (
                    <styled.PreviewImageHolder
                      style={{backgroundImage: `url(${assetStore.imageSrc ?? undefined})`}}
                    />
                  )
                )}
                {!(value || assetStore.imageSrc) && (
                  <styled.DragAndDropPrompt>
                    <span>{t('messages.uploadAssetPictureDescription')}</span>
                    <span>{t('labels.or')}</span>
                  </styled.DragAndDropPrompt>
                )}
                <FileUploader
                  label={t('actions.uploadYourAsset')}
                  dragActiveLabel={t('actions.dropItHere')}
                  maxSize={MAX_ASSET_SIZE_B}
                  fileType="image"
                  onFilesUpload={(d) => {
                    setHasImage(true);
                    onChange(d);
                  }}
                  enableDragAndDrop={true}
                />
              </styled.ImageUploadContainer>
            )}
          />
        </Frame>

        <styled.InputContainer>
          <Controller
            control={control}
            name="title"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <Input
                wide
                placeholder={t('placeholders.nameYourImage')}
                value={value}
                onChange={(value: string) => {
                  onChange(value);
                }}
                disabled={!hasImage}
              />
            )}
          />
        </styled.InputContainer>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(AssignImage);
