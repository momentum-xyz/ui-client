import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {AvatarUpload, Button, ButtonRound, Input, Textarea} from '@momentum-xyz/ui-kit-storybook';

import {WorldModelInterface} from 'core/models';
import {FieldErrorInterface} from 'api/interfaces';
import {WorldFormInterface} from 'core/interfaces';
import {ProfileInfo, StakersList, StakingAmount, StakingComment} from 'ui-kit';

import * as styled from './WorldEditor.styled';

interface PropsInterface {
  world: WorldModelInterface;
  formErrors: FieldErrorInterface[];
  isUpdating: boolean;
  onSelectUser: (userId: string) => void;
  onEditWorld: (form: WorldFormInterface, previousImageHash?: string | null) => void;
  onCancel: () => void;
}

const WorldEditor: FC<PropsInterface> = ({
  world,
  formErrors,
  isUpdating,
  onEditWorld,
  onSelectUser,
  onCancel
}) => {
  const {t} = useI18n();

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<WorldFormInterface>();

  useEffect(() => {
    setValue('name', world.name);
    setValue('description', world.description || '');
    setValue('website_link', world.website_link || '');
  }, [world, setValue]);

  useEffect(() => {
    formErrors.forEach(({fieldName, errorMessage}) => {
      setError(fieldName as keyof WorldFormInterface, {
        type: 'duplicate',
        message: errorMessage
      });
    });
  }, [formErrors, setError]);

  const formSubmitHandler = handleSubmit(async (form: WorldFormInterface) => {
    await onEditWorld(form, world.avatarHash);
  });

  return (
    <styled.Container data-testid="WorldProfileWidget-test">
      {/* AVATAR */}
      <Controller
        name="avatarFile"
        control={control}
        render={({field: {value, onChange}}) => (
          <styled.AvatarContainer
            style={
              !value && !!world.imageLargeSrc
                ? {backgroundImage: `url(${world.imageLargeSrc})`}
                : {}
            }
          >
            <AvatarUpload value={value} onChange={onChange} />
          </styled.AvatarContainer>
        )}
      />

      <styled.GeneralScrollable>
        <styled.InputsContainer>
          {/* NAME */}
          <Controller
            control={control}
            name="name"
            rules={{required: true, maxLength: 32, minLength: 2}}
            render={({field: {value, onChange}}) => (
              <Input
                value={value}
                onChange={onChange}
                placeholder={t('fields.name')}
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

          {/* DESCRIPTION */}
          <Controller
            control={control}
            name="description"
            render={({field: {value, onChange}}) => (
              <Textarea
                placeholder={t('fields.description')}
                value={value}
                disabled={isUpdating}
                onChange={onChange}
              />
            )}
          />

          {/* WEBSITE */}
          <styled.InputIconRow>
            <ButtonRound variant="primary" isLabel icon="link" />
            <Controller
              control={control}
              name="website_link"
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

        <ProfileInfo joinDate={world.createdAt} />
        <StakingAmount stakedAmount={world.momStaked} tokenSymbol="MOM" />
        {!!world.last_staking_comment && <StakingComment comment={world.last_staking_comment} />}
        <StakersList stakers={world.stakers} onSelectUser={onSelectUser} />
      </styled.GeneralScrollable>
    </styled.Container>
  );
};

export default observer(WorldEditor);
