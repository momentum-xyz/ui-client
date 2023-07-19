import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Input, Textarea} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {TextObjectInterface} from 'core/interfaces';

import * as styled from './AssignText.styled';

interface PropsInterface {
  initialTitle: string | undefined;
  initialText: string | undefined;
  isEditing: boolean;
  isPending: boolean;
  onDelete: () => void;
  onSave: (title: string, text: string) => void;
  onBack: () => void;
}

const AssignText: FC<PropsInterface> = ({
  initialTitle,
  initialText,
  isEditing,
  isPending,
  onSave,
  onDelete,
  onBack
}) => {
  const {t} = useI18n();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<TextObjectInterface>({
    defaultValues: {
      title: initialTitle,
      content: initialText
    }
  });

  const formSubmitHandler: SubmitHandler<TextObjectInterface> = async (data) => {
    await onSave(data.title, data.content);
  };

  return (
    <styled.Container data-testid="AssignText-test">
      <styled.Title>Embed Text</styled.Title>
      <styled.Description>
        By embedding text onto this object; users will also be able to see this text displayed when
        they select the object; regardless of its asset type.
      </styled.Description>

      <styled.Section>
        <Controller
          name="content"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Textarea
              value={value}
              danger={!!errors.content}
              placeholder="Enter Text Here"
              onChange={onChange}
              lines={8}
            />
          )}
        />
      </styled.Section>

      <styled.Section>
        <Controller
          name="title"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              wide
              value={value}
              danger={!!errors.title}
              placeholder="Name your Text"
              onChange={onChange}
            />
          )}
        />
      </styled.Section>

      <styled.ActionBar>
        <Button
          variant="secondary"
          label={t('actions.back')}
          disabled={isPending}
          onClick={onBack}
        />

        {isEditing && (
          <Button
            variant="secondary"
            label={t('actions.delete')}
            disabled={isPending}
            onClick={onDelete}
          />
        )}

        <Button
          label={isEditing ? t('actions.edit') : t('actions.embed')}
          disabled={!isValid || isPending}
          onClick={() => handleSubmit(formSubmitHandler)()}
        />
      </styled.ActionBar>
    </styled.Container>
  );
};

export default observer(AssignText);
