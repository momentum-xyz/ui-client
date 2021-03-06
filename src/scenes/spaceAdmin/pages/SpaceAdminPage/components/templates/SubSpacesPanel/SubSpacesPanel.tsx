import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {useHistory} from 'react-router';

import {SectionPanel} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {
  AdminListItem,
  DeleteSpaceConfirmationDialog
} from 'scenes/spaceAdmin/pages/SpaceAdminPage/components';

import {AddSubSpaceDialog} from './components';
import * as styled from './SubSpacesPanel.styled';

const SubSpacesPanel: FC = () => {
  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {removeSubSpaceConfirmationDialog, addSubSpaceDialog, space} = spaceManagerStore;

  const history = useHistory();

  const [selectedSpace, setSelectedSpace] = useState<{id: string; name?: string}>();

  const handleSubSpaceEdit = (spaceId: string) => {
    history.push({pathname: '/space/' + spaceId + '/admin'});
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

  const handleAddSubSpace = () => {
    if (space) {
      addSubSpaceDialog.open();
    }
  };

  return (
    <SectionPanel title={t('spaceAdmin.subSpaces.title')} isCustom onAdd={handleAddSubSpace}>
      <styled.List className="noScrollIndicator">
        {removeSubSpaceConfirmationDialog.isOpen && (
          <DeleteSpaceConfirmationDialog
            onConfirmation={removeSubSpace}
            onClose={removeSubSpaceConfirmationDialog.close}
          />
        )}
        {addSubSpaceDialog.isOpen && space && space.allowedSpaceTypesRequest.isDone && (
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
