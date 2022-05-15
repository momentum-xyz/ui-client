import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useHistory} from 'react-router';

import {Button, Heading, Input, SectionPanel, Text, Toggle} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {SpaceSettingsInterface} from 'api/repositories/spaceRepository/spaceRepository.api.types';
import {useLeaveCollaborationSpace} from 'context/Collaboration/hooks/useCollaboration';
import {DeleteSpaceConfirmationDialog} from 'scenes/spaceAdmin/pages/SpaceAdminPage/components/organisms';
import {ROUTES} from 'core/constants';

import * as styled from './SpaceDetailsPanel.styled';

const SpaceDetailsPanel: FC = () => {
  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {spaceStore, spaceDetailsFormStore, deleteSpaceConfirmationDialog} = spaceManagerStore;

  const {space} = spaceStore;

  const history = useHistory();
  const leaveCollaborationSpace = useLeaveCollaborationSpace();

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
      name: space.name,
      secret: space.secret
    }
  });

  const formSubmitHandler: SubmitHandler<SpaceSettingsInterface> = (
    settings: SpaceSettingsInterface
  ) => {
    if (space.id) {
      spaceDetailsFormStore.saveDetails(settings, space.id).then(spaceStore.fetchSpaceInformation);
    }
  };

  const handleDelete = () => {
    if (space.id) {
      spaceDetailsFormStore
        .deleteSpace(space.id)
        .then(() => leaveCollaborationSpace(true))
        .then(() => {
          history.replace({pathname: ROUTES.base});
        });
    }
  };

  useEffect(() => {
    setValue('parentId', space.parentUUID ?? '');
    setValue('root', space.parentUUID === undefined);
  }, [space.parentUUID]);

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

  return (
    <SectionPanel title={t('spaceAdmin.spaceDetails.title')} isCustom>
      {deleteSpaceConfirmationDialog.isOpen && (
        <DeleteSpaceConfirmationDialog
          onConfirmation={handleDelete}
          onClose={deleteSpaceConfirmationDialog.close}
        />
      )}
      <styled.Body>
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
        {spaceStore.space.secret !== undefined && (
          <styled.Info>
            <Text
              text={t('spaceAdmin.spaceDetails.accessLabel')}
              weight="bold"
              transform="uppercase"
              size="xs"
              align="left"
            />
            <Controller name="secret" control={control} render={renderSecretInput} />
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
