import React, {FC} from 'react';
import {Dialog, FileUploader} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {ImageObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './ChangeImageDialog.styled';

const ChangeVideoDialog: FC = () => {
  const {objectStore} = useStore();
  const {tileStore} = objectStore;
  const {changeTileDialog} = tileStore;

  const {t} = useTranslation();

  const {objectId} = useParams<{objectId: string}>();

  const {handleSubmit, control} = useForm<ImageObjectInterface>();

  const formSubmitHandler: SubmitHandler<ImageObjectInterface> = async (
    data: ImageObjectInterface
  ) => {
    if (!data.image) {
      return;
    }

    await tileStore.postNewImage(objectId, data.image);

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
                tileStore.imageSrc && <styled.imagePreview src={tileStore.imageSrc ?? undefined} />
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
