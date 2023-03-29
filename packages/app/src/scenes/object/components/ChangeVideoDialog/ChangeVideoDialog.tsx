import React, {FC, useCallback, useMemo} from 'react';
import {Dialog, Input} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {VideoObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './ChangeVideoDialog.styled';

const ChangeVideoDialog: FC = () => {
  const {universeStore, objectStore} = useStore();
  const {instance3DStore} = universeStore;
  const {assetStore} = objectStore;
  const {changeTileDialog} = assetStore;

  const {t} = useI18n();

  const {objectId} = useParams<{objectId: string}>();

  const {
    handleSubmit,
    control,
    formState: {errors}
  } = useForm<VideoObjectInterface>({
    defaultValues: {
      youtube_url: assetStore.content?.youtube_url ?? ''
    }
  });

  const formSubmitHandler: SubmitHandler<VideoObjectInterface> = async (
    data: VideoObjectInterface
  ) => {
    await assetStore.postNewContent(objectId!, data);

    changeTileDialog.close();
  };

  const handleFocus = useCallback(() => {
    instance3DStore.changeKeyboardControl(false);
  }, [instance3DStore]);

  const handleBlur = useCallback(() => {
    instance3DStore.changeKeyboardControl(true);
  }, [instance3DStore]);

  const errorMessage = useMemo(() => {
    switch (errors.youtube_url?.type) {
      case 'required':
        return t('errors.requiredField');
      default:
        return undefined;
    }
  }, [errors.youtube_url?.type, t]);

  return (
    <Dialog
      title={t('labels.changeVideo')}
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
          name="youtube_url"
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              value={value}
              isError={!!errorMessage}
              errorMessage={errorMessage}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={onChange}
            />
          )}
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(ChangeVideoDialog);
