import {FC, MutableRefObject, useMemo} from 'react';
import {Input, TextArea} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';

import {TextObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './ChangeTextDialog.styled';

interface PropsInterface {
  actionRef: MutableRefObject<{doSave: () => void}>;
  objectId: string;
}

const ChangeTextDialog: FC<PropsInterface> = ({actionRef, objectId}) => {
  const {objectStore} = useStore();

  const {assetStore} = objectStore;
  const {changeTileDialog} = assetStore;

  const {t} = useI18n();

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
    await assetStore.postNewContent(objectId, data);

    changeTileDialog.close();
  };

  // TEMP
  actionRef.current = {
    doSave: handleSubmit(formSubmitHandler)
  };

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
            onChange={onChange}
            rows={10}
          />
        )}
      />
    </styled.Container>
  );
};

export default observer(ChangeTextDialog);
