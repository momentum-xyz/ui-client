import React, {FC, useCallback, useMemo} from 'react';
import {Dialog, Input, TextArea} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {TextObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './ChangeTextDialog.styled';

const ChangeTextDialog: FC = () => {
  const {universeStore, objectStore} = useStore();
  const {world3dStore} = universeStore;
  const {assetStore} = objectStore;
  const {changeTileDialog} = assetStore;

  const {t} = useI18n();

  const {objectId} = useParams<{objectId: string}>();

  const {
    handleSubmit,
    control,
    formState: {errors}
  } = useForm<TextObjectInterface>({
    defaultValues: {
      title: assetStore.content?.title,
      content: assetStore.content?.content
    }
  });

  const formSubmitHandler: SubmitHandler<TextObjectInterface> = async (
    data: TextObjectInterface
  ) => {
    await assetStore.postNewContent(objectId!, data);

    changeTileDialog.close();
  };

  const handleFocus = useCallback(() => {
    world3dStore?.changeKeyboardControl(false);
  }, [world3dStore]);

  const handleBlur = useCallback(() => {
    world3dStore?.changeKeyboardControl(true);
  }, [world3dStore]);

  const titleErrorMessage = useMemo(() => {
    switch (errors.title?.type) {
      case 'required':
        return t('errors.requiredField');
      default:
        return undefined;
    }
  }, [errors.title?.type, t]);

  const contentErrorMessage = useMemo(() => {
    switch (errors.content?.type) {
      case 'required':
        return t('errors.requiredField');
      default:
        return undefined;
    }
  }, [errors.content?.type, t]);

  return (
    <Dialog
      title={t('labels.changeText')}
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
          name="title"
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              value={value}
              label={t('fields.title')}
              isError={!!titleErrorMessage}
              errorMessage={titleErrorMessage}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="content"
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <TextArea
              value={value}
              name={t('fields.description')}
              isResizable
              isError={!!contentErrorMessage}
              errorMessage={contentErrorMessage}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={onChange}
              rows={10}
            />
          )}
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(ChangeTextDialog);
