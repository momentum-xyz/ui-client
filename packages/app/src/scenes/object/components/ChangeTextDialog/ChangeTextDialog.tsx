import React, {FC, useCallback, useMemo} from 'react';
import {Dialog, Input} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {TextObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './ChangeTextDialog.styled';

const ChangeTextDialog: FC = () => {
  const {mainStore, objectStore} = useStore();
  const {unityStore} = mainStore;
  const {tileStore} = objectStore;
  const {changeTileDialog} = tileStore;

  const {t} = useTranslation();

  const {objectId} = useParams<{objectId: string}>();

  const {
    handleSubmit,
    control,
    formState: {errors}
  } = useForm<TextObjectInterface>({
    defaultValues: {
      title: tileStore.content?.title,
      content: tileStore.content?.content
    }
  });

  const formSubmitHandler: SubmitHandler<TextObjectInterface> = async (
    data: TextObjectInterface
  ) => {
    await tileStore.postNewContent(objectId, data);

    changeTileDialog.close();
  };

  const handleFocus = useCallback(() => {
    unityStore.changeKeyboardControl(false);
  }, [unityStore]);

  const handleBlur = useCallback(() => {
    unityStore.changeKeyboardControl(true);
  }, [unityStore]);

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
            <Input
              value={value}
              isError={!!contentErrorMessage}
              errorMessage={contentErrorMessage}
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

export default observer(ChangeTextDialog);