import React, {FC, MutableRefObject} from 'react';
import {FileUploader} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';

import {ImageObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './ChangeImageDialog.styled';

interface PropsInterface {
  actionRef: MutableRefObject<{doSave: () => void}>;
  objectId: string;
}

const ChangeVideoDialog: FC<PropsInterface> = ({actionRef, objectId}) => {
  const {objectStore} = useStore();
  const {assetStore} = objectStore;
  const {changeTileDialog} = assetStore;

  const {t} = useI18n();

  const {handleSubmit, control} = useForm<ImageObjectInterface>();

  const formSubmitHandler: SubmitHandler<ImageObjectInterface> = async (
    data: ImageObjectInterface
  ) => {
    if (!data.image) {
      return;
    }

    await assetStore.postNewImage(objectId, data.image);

    changeTileDialog.close();
  };

  // TEMP
  actionRef.current = {
    doSave: handleSubmit(formSubmitHandler)
  };

  return (
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
              assetStore.imageSrc && <styled.imagePreview src={assetStore.imageSrc ?? undefined} />
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
  );
};

export default observer(ChangeVideoDialog);
