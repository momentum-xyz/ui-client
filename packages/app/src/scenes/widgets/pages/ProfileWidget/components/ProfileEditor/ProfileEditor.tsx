import {FC, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {signUpDateString, useI18n} from '@momentum-xyz/core';
import {
  Frame,
  AvatarUpload,
  Input,
  Button,
  ButtonRound,
  Textarea,
  ProfileLine,
  WalletHash
} from '@momentum-xyz/ui-kit';

import {UserModelInterface} from 'core/models';
import {FieldErrorInterface} from 'api/interfaces';
import {ProfileFormInterface} from 'core/interfaces';

import * as styled from './ProfileEditor.styled';

interface PropsInterface {
  user: UserModelInterface;
  defaultWalletId: string;
  formErrors: FieldErrorInterface[];
  isUpdating: boolean;
  onUpdate: (form: ProfileFormInterface, previousImageHash?: string) => void;
  onCancel: () => void;
}

const ProfileEditor: FC<PropsInterface> = ({
  user,
  defaultWalletId,
  formErrors,
  isUpdating,
  onUpdate,
  onCancel
}) => {
  const {t} = useI18n();

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<ProfileFormInterface>();

  useEffect(() => {
    formErrors.forEach(({fieldName, errorMessage}) => {
      setError(fieldName as keyof ProfileFormInterface, {
        type: 'duplicate',
        message: errorMessage
      });
    });
  }, [formErrors, setError]);

  useEffect(() => {
    if (user?.profile) {
      setValue('name', user.name);
      setValue('bio', user.profile.bio);
      setValue('profileLink', user.profile.profileLink);
    }
  }, [user?.name, user?.profile, setValue]);

  const formSubmitHandler = handleSubmit(async (form: ProfileFormInterface) => {
    await onUpdate(form, user.profile.avatarHash);
  });

  return (
    <styled.Container data-testid="ProfileEditor-test">
      <Frame>
        <styled.InputsContainer>
          {/* AVATAR */}
          <Controller
            name="avatarFile"
            control={control}
            render={({field: {value, onChange}}) => (
              <styled.AvatarContainer
                style={
                  !value && !!user.avatarLargeSrc
                    ? {backgroundImage: `url(${user.avatarLargeSrc})`}
                    : {}
                }
              >
                <AvatarUpload value={value} onChange={onChange} />
              </styled.AvatarContainer>
            )}
          />

          {/* NAME */}
          <Controller
            control={control}
            name="name"
            rules={{required: true, maxLength: 32, minLength: 2}}
            render={({field: {value, onChange}}) => (
              <Input
                value={value}
                onChange={onChange}
                placeholder={t('fields.profileName')}
                // errorMessage={
                //   errors?.name?.type !== 'duplicate'
                //     ? t('errors.nameConstraints')
                //     : errors.name.message
                // }
                danger={!!errors.name}
                disabled={isUpdating}
                wide
              />
            )}
          />

          {/* BIO */}
          <Controller
            control={control}
            name="bio"
            render={({field: {value, onChange}}) => (
              <Textarea
                placeholder={t('fields.shortBio')}
                value={value}
                disabled={isUpdating}
                onChange={onChange}
              />
            )}
          />

          {/* LINK */}
          <styled.InputIconRow>
            <ButtonRound variant="primary" isLabel icon="link" />
            <Controller
              control={control}
              name="profileLink"
              render={({field: {value, onChange}}) => (
                <Input
                  placeholder={t('fields.linkToWeb') || ''}
                  value={value}
                  disabled={isUpdating}
                  onChange={onChange}
                  wide
                />
              )}
            />
          </styled.InputIconRow>
        </styled.InputsContainer>

        <styled.Actions>
          <Button variant="secondary" label={t('actions.cancel')} onClick={onCancel} />
          <Button label={t('actions.save')} disabled={isUpdating} onClick={formSubmitHandler} />
        </styled.Actions>

        <styled.Info>
          <ProfileLine
            icon="astro"
            label={`${t('actions.joined')} ${signUpDateString(user.createdAt)}`}
          />

          <WalletHash icon="talisman" hash={defaultWalletId} />
        </styled.Info>
      </Frame>
    </styled.Container>
  );
};

export default observer(ProfileEditor);
