import {FC, MutableRefObject, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Input, Textarea} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {TextObjectInterface} from 'core/interfaces';
import { PluginIdEnum } from 'api/enums';

import * as styled from './AssignText.styled';

interface PropsInterface {
  objectId: string;
  actionRef: MutableRefObject<{doSave: () => void; doDelete: () => void}>;
}

const AssignText: FC<PropsInterface> = ({actionRef, objectId}) => {
  const {universeStore} = useStore();
  const {objectStore} = universeStore;
  const {assetStore} = objectStore;

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
  };

  // TEMP
  actionRef.current = {
    doSave: handleSubmit(formSubmitHandler),
    doDelete: async () => {
      await assetStore.deleteFunction(objectId, PluginIdEnum.TEXT);
    }
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
    <styled.Container data-testid="AssignText-test">
      <styled.Title>Embed Text</styled.Title>
      <styled.Description>
        By embedding text onto this object; users will also be able to see this text displayed when
        they select the object; regardless of its asset type.
      </styled.Description>

      <styled.Section>
        <Controller
          control={control}
          name="content"
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Textarea
              value={value}
              danger={!!contentErrorMessage}
              placeholder="Enter Text Here"
              //errorMessage={contentErrorMessage}
              onChange={onChange}
              lines={8}
            />
          )}
        />
      </styled.Section>

      <styled.Section>
        <Controller
          control={control}
          name="title"
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              wide
              value={value}
              danger={!!titleErrorMessage}
              placeholder="Name your Text"
              //errorMessage={titleErrorMessage}
              onChange={onChange}
            />
          )}
        />
      </styled.Section>
    </styled.Container>
  );
};

export default observer(AssignText);
