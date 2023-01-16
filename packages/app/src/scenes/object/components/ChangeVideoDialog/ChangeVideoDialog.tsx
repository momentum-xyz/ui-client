import React, {FC, useCallback, useMemo} from 'react';
import {Dialog, Input} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {VideoObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './ChangeVideoDialog.styled';

const ChangeVideoDialog: FC = () => {
  const {unityStore, objectStore} = useStore();
  const {unityInstanceStore} = unityStore;
  const {assetStore} = objectStore;
  const {changeTileDialog} = assetStore;

  const {t} = useTranslation();

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
    await assetStore.postNewContent(objectId, data);

    changeTileDialog.close();
  };

  const handleFocus = useCallback(() => {
    unityInstanceStore.changeKeyboardControl(false);
  }, [unityInstanceStore]);

  const handleBlur = useCallback(() => {
    unityInstanceStore.changeKeyboardControl(true);
  }, [unityInstanceStore]);

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
