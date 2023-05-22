import {FC, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Frame, Image, Input, Button, AvatarUpload, ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {getImageAbsoluteUrl} from 'core/utils';
import {SignUpFormInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './SignUp.styled';

interface PropsInterface {
  onCreated: () => void;
}

const SignUp: FC<PropsInterface> = ({onCreated}) => {
  const {sessionStore, widgetStore} = useStore();
  const {user, isGuest} = sessionStore;
  const {signInStore} = widgetStore;
  const {fieldErrors, isUpdating, updateProfile} = signInStore;

  const {t} = useI18n();

  const isProfileCreated = !isGuest && !!user && !!user.name;
  const isProfileReady = isProfileCreated && !!user.profile.avatarHash;

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<SignUpFormInterface>({
    mode: 'all'
  });

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
    <styled.Container data-testid="SignUp-test">
      {isProfileReady ? (
        <Frame title={t('login.welcomeUser', {name: user.name})}>
          <Image
            height={200}
            errorIcon="astronaut"
            src={getImageAbsoluteUrl(user?.profile.avatarHash, ImageSizeEnum.S5)}
          />
          <styled.ReadyText>{t('login.areYouReadyText')}</styled.ReadyText>
          <Button
            wide
            icon="astro"
            variant="primary"
            label={t('login.startYourJourney')}
            onClick={onCreated}
          />
        </Frame>
      ) : (
        <>
          <Frame title={t('login.createYourProfileTitle')}>
            {t('login.createYourProfileDescription')}
          </Frame>

          {!isProfileCreated && (
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
                  disabled={isUpdating}
                  onClick={onUpdateProfile}
                />
              </styled.InputContainer>
            </styled.Wrapper>
          )}
        </>
      )}
    </styled.Container>
  );
};

export default SignUp;
