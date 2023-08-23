import {FC, useCallback, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import {Textarea} from '@momentum-xyz/ui-kit';
// import {useI18n} from '@momentum-xyz/core';

import {TextObjectInterface} from 'core/interfaces';
import {ObjectAttribute} from 'core/models';
import {PluginIdEnum} from 'api/enums';

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

// TODO remove
const AssignText: FC<PropsInterface> = ({
  initialTitle,
  initialText,
  isEditing,
  isPending,
  onSave,
  onDelete,
  onBack
}) => {
  return <styled.Container data-testid="AssignText-test"></styled.Container>;
};

export const useAssignText = ({
  objectId
}: {
  objectId: string;
}): {
  content: JSX.Element;
  isModified: boolean;
  save: () => Promise<void>;
  discardChanges: () => void;
  remove: () => Promise<void>;
} => {
  const attribute = useMemo(() => {
    const attribute = ObjectAttribute.create({
      objectId,
      pluginId: PluginIdEnum.TEXT
    });
    attribute.load();
    return attribute;
  }, [objectId]);

  const initialText = attribute.valueAs<TextObjectInterface>()?.content || '';

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, dirtyFields}
  } = useForm<TextObjectInterface>();

  const save = useCallback(async () => {
    await handleSubmit(async (data) => {
      const {content} = data;

      if (content === undefined) {
        return;
      }

      await attribute.set({
        content
      });
    })();
  }, [attribute, handleSubmit]);

  const remove = useCallback(async () => {
    await attribute.delete();
  }, [attribute]);

  const content = (
    <styled.Container data-testid="AssignText-test">
      <Controller
        name="content"
        control={control}
        // rules={{required: true}}
        render={({field: {value, onChange}}) => (
          <Textarea
            value={value ?? initialText}
            danger={!!errors.content}
            placeholder="Enter Text Here"
            onChange={onChange}
            lines={8}
          />
        )}
      />
    </styled.Container>
  );

  return {
    content,
    isModified: Object.keys(dirtyFields).length > 0,
    save,
    discardChanges: reset,
    remove
  };
};

export default observer(AssignText);
