import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router';
import {generatePath} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {SectionPanel} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {
  AdminListItem,
  DeleteSpaceConfirmationDialog
} from 'scenes/spaceAdmin/pages/SpaceAdminPage/components';

import {AddSubSpaceDialog} from './components';
import * as styled from './SubSpacesPanel.styled';

const SubSpacesPanel: FC = () => {
  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {removeSubSpaceConfirmationDialog, addSubSpaceDialog, space} = spaceManagerStore;

  const [selectedSpace, setSelectedSpace] = useState<{id: string; name?: string}>();

  const history = useHistory();
  const {t} = useTranslation();

  const handleSubSpaceEdit = (spaceId: string) => {
    history.push(generatePath(ROUTES.spaceAdmin.base, {spaceId}));
  };

  const handleSubSpaceRemove = (spaceId: string, name: string) => {
    setSelectedSpace({id: spaceId, name});
    removeSubSpaceConfirmationDialog.open();
  };

  const removeSubSpace = () => {
    if (!selectedSpace) {
      return;
    }

    spaceManagerStore.deleteSubSpace(selectedSpace.id).then(() => {
      removeSubSpaceConfirmationDialog.close();
      space?.fetchSpaceInformation();
    });
  };

  return (
    <SectionPanel title={t('spaceAdmin.subSpaces.title')} onAdd={addSubSpaceDialog.open}>
      <styled.List className="noScrollIndicator" data-testid="SubSpacesPanel-test">
        {removeSubSpaceConfirmationDialog.isOpen && (
          <DeleteSpaceConfirmationDialog
            onConfirmation={removeSubSpace}
            onClose={removeSubSpaceConfirmationDialog.close}
          />
        )}
        {addSubSpaceDialog.isOpen && space && (
          <AddSubSpaceDialog
            parentId={space.id}
            onClose={addSubSpaceDialog.close}
            allowedSubSpaceTypes={space.allowedSpaceTypes}
          />
        )}
        {space?.subSpaces.map((subSpace) => (
          <AdminListItem
            key={subSpace.id}
            name={subSpace.name}
            userId={subSpace.id}
            onEdit={handleSubSpaceEdit}
            onRemove={handleSubSpaceRemove}
          />
        ))}
      </styled.List>
    </SectionPanel>
  );
};

export default observer(SubSpacesPanel);
