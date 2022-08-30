import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useHistory} from 'react-router';

import {Button, Heading, Input, SectionPanel, Text, Toggle} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {SpaceSettingsInterface} from 'api/repositories/spaceRepository/spaceRepository.api.types';
import {DeleteSpaceConfirmationDialog} from 'scenes/spaceAdmin/pages/SpaceAdminPage/components/organisms';
import {ROUTES} from 'core/constants';

import * as styled from './SpaceDetailsPanel.styled';

const SpaceDetailsPanel: FC = () => {
  const {spaceAdminStore} = useStore();
  const {spaceManagerStore} = spaceAdminStore;
  const {space, spaceDetailsFormStore, deleteSpaceConfirmationDialog} = spaceManagerStore;
  const history = useHistory();

  const parentClicked = (id: string) => {
    history.push({pathname: '/space/' + id + '/admin'});
  };

  const {
    control,
    formState: {errors, isDirty},
    handleSubmit,
    setValue
  } = useForm<SpaceSettingsInterface>({
    defaultValues: {
      name: space?.name,
      secret: space?.secret
    }
  });

  const formSubmitHandler: SubmitHandler<SpaceSettingsInterface> = (
    settings: SpaceSettingsInterface
  ) => {
    if (space) {
      spaceDetailsFormStore.saveDetails(settings, space.id).then(space.fetchSpaceInformation);
    }
  };

  const handleDelete = () => {
    if (space) {
      spaceDetailsFormStore.deleteSpace(space.id).then(() => {
        history.replace({pathname: ROUTES.base});
      });
    }
  };

  useEffect(() => {
    setValue('parentId', space?.parentUUID ?? '');
    setValue('root', space?.parentUUID === undefined);
  }, [space?.parentUUID]);

  useEffect(() => {
    if (space) {
      setValue('name', space.name ?? '');
      setValue('description', space.description ?? '');
      setValue('secret', space.secret ?? 0);
    }
  }, [space]);

  // @ts-ignore: FIX
  const renderSecretInput = ({field: {onChange, value}}) => (
    <styled.Access>
      <Text text={t('spaceAdmin.spaceDetails.privateSpaceText')} size="xs" />
      <Toggle checked={!!value} onChange={(checked) => onChange(checked ? 1 : 0)} />
    </styled.Access>
  );

  // @ts-ignore: FIX
  const renderNameInput = ({field: {onChange, value}}) => (
    <Input
      defaultValue={value}
      label={t('spaceAdmin.spaceDetails.spaceNameLabel')}
      type="text"
      onChange={onChange}
      errorMessage={t('spaceAdmin.spaceDetails.spaceNameError')}
      isError={!!errors.name}
    />
  );

  if (!space) {
    return null;
  }

  return (
    <SectionPanel title={t('spaceAdmin.spaceDetails.title')}>
      {deleteSpaceConfirmationDialog.isOpen && (
        <DeleteSpaceConfirmationDialog
          onConfirmation={handleDelete}
          onClose={deleteSpaceConfirmationDialog.close}
        />
      )}
      <styled.Body data-testid="SpaceDetailsPanel-test">
        <styled.BreadCrumbsContainer>
          {space.adminAncestors?.map((ancestor) => (
            <styled.BreadcrumbContainer key={ancestor.id}>
              <styled.Breadcrumb onClick={() => parentClicked(ancestor.id)}>
                <Heading label={ancestor.name} type="h3" />
                {ancestor.isSelected && <styled.BreadcrumbUnderline />}
              </styled.Breadcrumb>
            </styled.BreadcrumbContainer>
          ))}
        </styled.BreadCrumbsContainer>
        {space.type && (
          <styled.Info>
            <Text
              text={t('spaceAdmin.spaceDetails.typeLabel')}
              weight="bold"
              transform="uppercase"
              size="xs"
              align="left"
            />
            <Text text={space.type} size="xs" align="left" />
          </styled.Info>
        )}
        {space.secret !== undefined && (
          <styled.Info>
            <Text
              text={t('spaceAdmin.spaceDetails.accessLabel')}
              weight="bold"
              transform="uppercase"
              size="xs"
              align="left"
            />
            <styled.Info className="row">
              <Controller name="secret" control={control} render={renderSecretInput} />
              <Text text={t('spaceAdmin.spaceDetails.accessWarning')} size="xxs" align="left" />
            </styled.Info>
          </styled.Info>
        )}
        <styled.Info>
          <Controller
            name="name"
            control={control}
            render={renderNameInput}
            rules={{required: true}}
          />
        </styled.Info>
        <styled.Buttons>
          <Button
            label={t('spaceAdmin.spaceDetails.deleteSpaceLabel')}
            onClick={deleteSpaceConfirmationDialog.open}
            variant="danger"
          />
          <Button
            label={t('spaceAdmin.spaceDetails.saveDetailsLabel')}
            /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
            onClick={handleSubmit(formSubmitHandler)}
            variant="primary"
            disabled={!isDirty}
          />
        </styled.Buttons>
      </styled.Body>
    </SectionPanel>
  );
};

export default observer(SpaceDetailsPanel);
