import React, {FC} from 'react';
import {Dialog, FileUploader} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {ImageObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './ChangeImageDialog.styled';

const ChangeVideoDialog: FC = () => {
  const {objectStore} = useStore();
  const {assetStore} = objectStore;
  const {changeTileDialog} = assetStore;

  const {t} = useI18n();

  const {objectId} = useParams<{objectId: string}>();

  const {handleSubmit, control} = useForm<ImageObjectInterface>();

  const formSubmitHandler: SubmitHandler<ImageObjectInterface> = async (
    data: ImageObjectInterface
  ) => {
    if (!data.image) {
      return;
    }

    await assetStore.postNewImage(objectId!, data.image);

    changeTileDialog.close();
  };

  return (
    <Dialog
      title={t('labels.changeImage')}
      approveInfo={{
        title: t('actions.change'),
        onClick: handleSubmit(formSubmitHandler)
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: changeTileDialog.close
      }}
      onClose={changeTileDialog.close}
      showCloseButton
      showBackground
      hasBorder
    >
      <styled.Container>
        <Controller
          control={control}
          name="image"
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <>
              {value ? (
                <styled.imagePreview src={URL.createObjectURL(value)} />
              ) : (
                assetStore.imageSrc && (
                  <styled.imagePreview src={assetStore.imageSrc ?? undefined} />
                )
              )}
              <FileUploader
                label={t('actions.selectImage')}
                dragActiveLabel={t('actions.dropItHere')}
                fileType="image"
                buttonSize="normal"
                onFilesUpload={onChange}
                enableDragAndDrop={false}
              />
            </>
          )}
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(ChangeVideoDialog);
