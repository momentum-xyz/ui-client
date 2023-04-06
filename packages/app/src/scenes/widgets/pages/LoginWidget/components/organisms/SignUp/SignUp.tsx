import {FC, useEffect} from 'react';
import {FrameText, Input, Button} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';
import {Controller, useForm} from 'react-hook-form';

import {SignUpFormInterface} from 'core/interfaces';
import {SignInStore} from 'scenes/widgets/stores';

import {FileUpload} from '../FileUpload';

import * as styled from './SignUp.styled';

interface PropsInterface {
  onCreated: () => void;
}

const SignUp: FC<PropsInterface> = (props) => {
  const signInStore = SignInStore.create();
  const {fieldErrors, isUpdating, updateProfile} = signInStore;

  const {onCreated} = props;

  const {t} = useI18n();

  const {control, setError, handleSubmit} = useForm<SignUpFormInterface>({
    mode: 'all'
  });

  const disabled = isUpdating;

  const onUpdateProfile = handleSubmit(async (data: SignUpFormInterface) => {
    const {name, avatar} = data;
    const isDone = await updateProfile({name, avatar});
    if (isDone) {
      onCreated();
    }
  });

  useEffect(() => {
    fieldErrors.forEach(({fieldName, errorMessage}) => {
      setError(fieldName as keyof SignUpFormInterface, {type: 'duplicate', message: errorMessage});
    });
  }, [fieldErrors, setError]);

  return (
    <styled.Container>
      <FrameText
        title={t('login.createYourProfileTitle')}
        line1={t('login.createYourProfileDescription')}
      />
      <styled.Separator />
      <FrameText title={t('login.nameInputLabel')} />
      <styled.InputContainer>
        <Controller
          name="name"
          control={control}
          rules={{required: true, maxLength: 32, minLength: 2}}
          render={({field: {onChange, value}}) => (
            <Input
              placeholder={t('login.nameInputPlaceholder')}
              value={value || ''}
              disabled={disabled}
              onChange={onChange}
            />
          )}
        />
      </styled.InputContainer>
      <FrameText title={t('login.chooseAnImageLabel')} />
      <Controller
        name="avatar"
        control={control}
        render={({field: {value, onChange}}) => <FileUpload value={value} onChange={onChange} />}
      />

      <styled.ReadyText>{t('login.areYouReadyText')}</styled.ReadyText>
      <Button
        icon="astro"
        wide
        variant="primary"
        label={t('login.startYourJourney')}
        disabled={disabled}
        onClick={onUpdateProfile}
      ></Button>
    </styled.Container>
  );
};

export default SignUp;
