import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import {Button, Input, SoundUpload} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {SoundFormInterface} from 'core/interfaces';

import * as styled from './MusicFileForm.styled';

interface PropsInterface {
  isPending: boolean;
  onPublish: (form: SoundFormInterface) => void;
  onCancel: () => void;
}

const MusicFileForm: FC<PropsInterface> = ({isPending, onPublish, onCancel}) => {
  const {t} = useI18n();

  const {
    control,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<SoundFormInterface>();

  const handlePublish = handleSubmit((data: SoundFormInterface) => {
    onPublish(data);
  });

  return (
    <styled.Container data-testid="MusicFileForm-test">
      <styled.Wrapper>
        <Controller
          name="trackFile"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => {
            return (
              <SoundUpload
                value={value}
                onChange={(file) => {
                  onChange(file);
                  setValue('name', file ? file.name : '');
                }}
              />
            );
          }}
        />

        <Controller
          name="name"
          control={control}
          rules={{required: true, minLength: 2}}
          render={({field: {value, onChange}}) => (
            <Input
              wide
              value={value}
              onChange={onChange}
              placeholder={`${t('fields.nameOfSound')}*`}
              danger={!!errors.name}
            />
          )}
        />

        <styled.Actions>
          <Button
            wide
            variant="secondary"
            disabled={isPending}
            label={t('actions.cancel')}
            onClick={onCancel}
          />
          <Button
            wide
            variant="primary"
            label={t('actions.publish')}
            disabled={!isValid || isPending}
            onClick={handlePublish}
          />
        </styled.Actions>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(MusicFileForm);
