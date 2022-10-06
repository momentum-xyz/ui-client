import React, {FC} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {t} from 'i18next';
import {toast} from 'react-toastify';
import {Dialog, Input, TextArea} from '@momentum/ui-kit';
import {SpaceTypeEnum} from '@momentum/core';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './LaunchInitiativeWidget.styled';

interface InitiativeInterface {
  name: string;
  description: string;
}

const LaunchInitiativeWidget: FC = () => {
  const {
    widgetStore,
    mainStore: {unityStore, worldStore}
  } = useStore();
  const {launchInitiativeStore} = widgetStore;
  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm<InitiativeInterface>({
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const formSumbitHandler: SubmitHandler<InitiativeInterface> = ({name, description}) => {
    launchInitiativeStore
      .create({
        name,
        description,
        currentWorldId: worldStore.worldId,
        spaceType: SpaceTypeEnum.CHALLENGE
      })
      .then(({isSuccess, spaceId}) => {
        if (isSuccess) {
          toast.info(
            <ToastContent
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('actions.launchInitiativeSuccess')}
            />
          );
        } else {
          toast.error(
            <ToastContent
              isDanger
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('messages.requestFailure', {action: t('actions.lunchingInitiative')})}
              showCloseButton
            />
          );
        }

        if (!spaceId) {
          throw new Error('Missing field "spaceId"');
        }

        return spaceId;
      })
      .then((spaceId) => {
        launchInitiativeStore.dialog.close();
        setTimeout(() => {
          unityStore.teleportToSpace(spaceId);
        }, 700);
      });
  };

  return (
    <Dialog
      title={t('launchInitiativeWidget.title')}
      onClose={launchInitiativeStore.dialog.close}
      approveInfo={{
        title: t('actions.launch'),
        onClick: () => {
          handleSubmit(formSumbitHandler)();
        }
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: launchInitiativeStore.dialog.close
      }}
      showCloseButton
      closeOnBackgroundClick
    >
      <styled.Body data-testid="LaunchInitiativeWidget-test">
        <styled.InitiativeDescription
          text={t('launchInitiativeWidget.description')}
          size="s"
          align="left"
        />
        <Controller
          control={control}
          name="name"
          render={({field: {onChange, value}}) => (
            <Input
              defaultValue={value}
              onChange={onChange}
              label={t('labels.nameOfInitiative')}
              isError={!!errors.name}
              errorMessage={errors.name?.message}
            />
          )}
          rules={{
            required: {
              value: true,
              message: t('launchInitiativeWidget.requiredFieldError', {field: t('fields.name')})
            },
            minLength: {
              value: 2,
              message: t('launchInitiativeWidget.minimumCharactersError', {length: 2})
            }
          }}
        />
        <Controller
          control={control}
          name="description"
          render={({field: {onChange, value}}) => (
            <TextArea
              name="description"
              defaultValue={value}
              onChange={onChange}
              label={t('fields.description')}
              isError={!!errors.description}
              errorMessage={errors.description?.message}
            />
          )}
          rules={{
            required: {
              value: true,
              message: t('launchInitiativeWidget.requiredFieldError', {
                field: t('fields.description')
              })
            }
          }}
        />
      </styled.Body>
    </Dialog>
  );
};

export default LaunchInitiativeWidget;
