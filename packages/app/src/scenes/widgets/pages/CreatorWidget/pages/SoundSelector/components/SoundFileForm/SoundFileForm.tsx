import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import {Button, Input, SoundUpload} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {SoundFormInterface} from 'core/interfaces';

import * as styled from './SoundFileForm.styled';

interface PropsInterface {
  isPending: boolean;
  onPublish: (form: SoundFormInterface) => void;
  onCancel: () => void;
}

const SoundFileForm: FC<PropsInterface> = ({isPending, onPublish, onCancel}) => {
  const {t} = useI18n();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<SoundFormInterface>();

  const handlePublish = handleSubmit((data: SoundFormInterface) => {
    onPublish(data);
  });

  return (
    <styled.Container data-testid="SoundFileForm-test">
      <styled.Wrapper>
        <Controller
          name="trackFile"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => {
            return <SoundUpload value={value} onChange={onChange} />;
          }}
        />

        <Controller
          name="name"
          control={control}
          rules={{required: true, maxLength: 32, minLength: 2}}
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

export default observer(SoundFileForm);
