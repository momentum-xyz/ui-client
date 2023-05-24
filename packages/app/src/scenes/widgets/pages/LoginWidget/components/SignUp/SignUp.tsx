import {FC, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Frame, Input, Button, AvatarUpload} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {FieldErrorInterface} from 'api/interfaces';
import {SignUpFormInterface} from 'core/interfaces';

import * as styled from './SignUp.styled';

interface PropsInterface {
  fieldErrors: FieldErrorInterface[];
  isUpdating: boolean;
  onUpdate: (form: SignUpFormInterface) => void;
}

const SignUp: FC<PropsInterface> = ({isUpdating, fieldErrors, onUpdate}) => {
  const {t} = useI18n();

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<SignUpFormInterface>({
    mode: 'all'
  });

  const onUpdateProfile = handleSubmit(async (data: SignUpFormInterface) => {
    await onUpdate({...data});
  });

  useEffect(() => {
    fieldErrors.forEach(({fieldName, errorMessage}) => {
      setError(fieldName as keyof SignUpFormInterface, {type: 'duplicate', message: errorMessage});
    });
  }, [fieldErrors, setError]);

  const isSubmitDisabled = isUpdating || !isValid;

  return (
    <styled.Container data-testid="SignUp-test">
      <Frame title={t('login.createYourProfileTitle')}>
        <styled.Wrapper>
          <styled.Title>{t('login.nameInputLabel')}</styled.Title>
          <styled.InputContainer>
            <Controller
              name="name"
              control={control}
              rules={{required: true, maxLength: 32, minLength: 2}}
              render={({field: {onChange, value}}) => (
                <Input
                  wide
                  placeholder={t('login.nameInputPlaceholder')}
                  value={value || ''}
                  disabled={isUpdating}
                  onChange={onChange}
                />
              )}
            />
            {errors?.name && <span>{errors.name.message}</span>}

            <styled.Title>{t('login.chooseAnImageLabel')}</styled.Title>
            <Controller
              name="avatar"
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <AvatarUpload value={value} onChange={onChange} />
              )}
            />

            <styled.ReadyText>{t('login.areYouReadyText')}</styled.ReadyText>
            <Button
              wide
              icon="astro"
              variant="primary"
              label={t('login.startYourJourney')}
              disabled={isSubmitDisabled}
              onClick={onUpdateProfile}
            />
          </styled.InputContainer>
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default SignUp;
