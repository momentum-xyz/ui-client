import React, {FC} from 'react';
import {Button, IconSvg, InputDark, Text} from '@momentum-xyz/ui-kit';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import {Box} from 'ui-kit';
import {GuestLoginFormInterface} from 'core/interfaces';

import * as styled from './LoginGuest.styled';

interface PropsInterface {
  isPending: boolean;
  hasNonGuestAccount: boolean;
  onLogin: (form: GuestLoginFormInterface) => void;
}

const LoginGuest: FC<PropsInterface> = (props) => {
  const {isPending, hasNonGuestAccount, onLogin} = props;

  const {t} = useTranslation();

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm<GuestLoginFormInterface>({defaultValues: {name: ''}});

  const handleLogin = handleSubmit((data: GuestLoginFormInterface) => {
    onLogin(data);
  });

  return (
    <Box>
      <styled.Div>
        {hasNonGuestAccount ? (
          <Text
            size="m"
            text="Or do you want to look around. What should we call you?"
            align="left"
          />
        ) : (
          <Text size="m" text="Do you want to look around. What should we call you?" align="left" />
        )}
        <styled.ImageContainer>
          <IconSvg name="profile" size="large" />

          <Controller
            name="name"
            control={control}
            rules={{required: true, maxLength: 32, minLength: 2}}
            render={({field: {onChange, value}}) => (
              <InputDark
                variant="secondary"
                value={value || ''}
                isError={!!errors.name}
                placeholder="Choose your name"
                onChange={onChange}
                errorMessage={
                  errors?.name?.type !== 'duplicate'
                    ? t('errors.nameConstraints')
                    : errors.name.message
                }
              />
            )}
          />
        </styled.ImageContainer>

        <Text
          size="m"
          text="It's great that you want to experience the odysseys of other travellers."
          align="left"
        />
        <Button
          icon="astro"
          size="medium"
          label="Explore Odyssey"
          disabled={isPending}
          onClick={handleLogin}
        />
      </styled.Div>
    </Box>
  );
};

export default LoginGuest;
