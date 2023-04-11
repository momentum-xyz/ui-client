import {FC, useEffect} from 'react';
import {FrameText, Input, Button, AvatarUpload} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';
import {Controller, useForm} from 'react-hook-form';

import {SignUpFormInterface} from 'core/interfaces';
import {SignInStore} from 'scenes/widgets/stores';
import {useStore} from 'shared/hooks';

import * as styled from './SignUp.styled';

interface PropsInterface {
  onCreated: () => void;
}

const SignUp: FC<PropsInterface> = (props) => {
  const signInStore = SignInStore.create();
  const {fieldErrors, isUpdating, updateProfile} = signInStore;
  const {sessionStore} = useStore();
  const {user, isGuest, userImageUrl} = sessionStore;

  const {t} = useI18n();

  const isProfileCreated = !isGuest && !!user && !!user.name;
  const isProfileReady = isProfileCreated && !!user.profile.avatarHash;

  const frameTextTitle = isProfileCreated
    ? t('login.welcomeUser', {name: user.name})
    : t('login.createYourProfileTitle');
  const frameTextDescription = isProfileCreated
    ? undefined
    : t('login.createYourProfileDescription');

  const {onCreated} = props;

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<SignUpFormInterface>({
    mode: 'all'
  });

  const disabled = isUpdating;

  const onUpdateProfile = handleSubmit(async (data: SignUpFormInterface) => {
    const {avatar} = data;
    const name = isProfileCreated ? user.name : data.name;
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
      <FrameText title={frameTextTitle} line1={frameTextDescription} />
      {(!isProfileCreated || !isProfileReady) && (
        <>
          <styled.Separator />
          {!isProfileCreated && (
            <>
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
                {errors?.name && <span>{errors.name.message}</span>}
              </styled.InputContainer>
            </>
          )}
          <FrameText title={t('login.chooseAnImageLabel')} />
          <Controller
            name="avatar"
            control={control}
            render={({field: {value, onChange}}) => (
              <AvatarUpload value={value} onChange={onChange} />
            )}
          />
        </>
      )}
      {isProfileReady && (
        <styled.ProfileAvatarPreview style={{backgroundImage: `url(${userImageUrl})`}} />
      )}

      <styled.ReadyText>{t('login.areYouReadyText')}</styled.ReadyText>
      <Button
        icon="astro"
        wide
        variant="primary"
        label={t('login.startYourJourney')}
        disabled={disabled}
        onClick={() => (isProfileReady ? onCreated() : onUpdateProfile())}
      ></Button>
    </styled.Container>
  );
};

export default SignUp;
