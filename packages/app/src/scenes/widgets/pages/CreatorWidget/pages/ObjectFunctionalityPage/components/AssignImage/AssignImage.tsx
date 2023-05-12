import React, {FC, MutableRefObject} from 'react';
import {FileUploader} from '@momentum-xyz/ui-kit';
import {Frame} from '@momentum-xyz/ui-kit-storybook';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';

import {ImageObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './AssignImage.styled';

const MAX_ASSET_SIZE_MB = 8;
const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);

interface PropsInterface {
  actionRef: MutableRefObject<{doSave: () => void}>;
  objectId: string;
}

const AssignImage: FC<PropsInterface> = ({actionRef, objectId}) => {
  const {universeStore} = useStore();
  const {objectStore} = universeStore;
  const {assetStore} = objectStore;

  const {t} = useI18n();

  const {
    handleSubmit,
    control,
    formState: {errors}
  } = useForm<ImageObjectInterface>();

  const formSubmitHandler: SubmitHandler<ImageObjectInterface> = async (
    data: ImageObjectInterface
  ) => {
    if (!data.image) {
      return;
    }

    await assetStore.postNewImage(objectId, data.image);
  };

  // TEMP
  actionRef.current = {
    doSave: handleSubmit(formSubmitHandler)
  };

  return (
    <styled.Container data-testid="AssignImage-test">
      <styled.InfoContainer>
        <div>{t('labels.embedPicture')}</div>
        <span>{t('labels.embedPictureInfo')}</span>
      </styled.InfoContainer>
      <styled.ScrollableContainer>
        <Frame>
          <Controller
            control={control}
            name="image"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <styled.ImageUploadContainer
                className={cn(
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
                <FileUploader
                  label={t('actions.selectImage')}
                  dragActiveLabel={t('actions.dropItHere')}
                  maxSize={MAX_ASSET_SIZE_B}
                  fileType="image"
                  onFilesUpload={onChange}
                  enableDragAndDrop={false}
                />
              </styled.ImageUploadContainer>
            )}
          />
        </Frame>
      </styled.ScrollableContainer>
    </styled.Container>
  );
};

export default observer(AssignImage);
