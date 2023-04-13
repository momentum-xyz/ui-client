import React, {useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {Text} from '@momentum-xyz/ui-kit';
import {Frame, AvatarUpload, Input, Button, ButtonRound} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {ProfileFormInterface} from 'core/interfaces';
import {UserModelInterface} from 'core/models';
import {FieldErrorInterface} from 'api/interfaces';

import * as styled from './ProfileEditor.styled';

interface PropsInterface {
  user: UserModelInterface;
  formErrors: FieldErrorInterface[];
  isUpdating: boolean;
  onChangeKeyboardControl?: (value: boolean) => void;
  onUpdate: (form: ProfileFormInterface, previousImageHash?: string) => void;
  onCancel: () => void;
}

const ProfileEditor: React.FC<PropsInterface> = (props) => {
  const {user, formErrors, isUpdating, onUpdate, onCancel, onChangeKeyboardControl} = props;

  const {t} = useI18n();

  useEffect(() => {
    onChangeKeyboardControl?.(false);
    return () => {
      onChangeKeyboardControl?.(true);
    };
  }, [onChangeKeyboardControl]);

  const {
    control,
    setValue,
    handleSubmit,
    setError
    // formState: {errors} // TODO: error handling with new inputs?
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
        {/* AVATAR */}
        <Controller
          name="avatarFile"
          control={control}
          render={({field: {value, onChange}}) => (
            <styled.AvatarContainer
              style={!value && !!user.avatarSrc ? {backgroundImage: `url(${user.avatarSrc})`} : {}}
            >
              <AvatarUpload value={value} onChange={onChange} />
            </styled.AvatarContainer>
          )}
        />

        {/* NAME */}
        <styled.InputsContainer>
          <Controller
            control={control}
            name="name"
            rules={{required: true, maxLength: 32, minLength: 2}}
            render={({field: {value, onChange}}) => (
              <Input
                value={value}
                onChange={onChange}
                placeholder={t('fields.name') || ''}
                // errorMessage={
                //   errors?.name?.type !== 'duplicate'
                //     ? t('errors.nameConstraints')
                //     : errors.name.message
                // }
                // isError={!!errors.name}
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
              <Input // TODO: Add `TextArea` component to storybook and use it here
                // rows={3}
                placeholder={t('fields.bio') || ''}
                value={value}
                disabled={isUpdating}
                onChange={onChange}
                wide
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
                  placeholder={t('fields.link') || ''}
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

        {isUpdating && (
          <styled.IsUpdating>
            <Text size="xs" text={t('editProfileWidget.isUpdating')} align="center" />
          </styled.IsUpdating>
        )}
      </Frame>
    </styled.Container>
  );
};

export default observer(ProfileEditor);
