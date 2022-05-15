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
  const {removeSubSpaceConfirmationDialog, addSubSpaceDialog, spaceStore} = spaceManagerStore;
  const {space, allowedSpaceTypesRequest, allowedSpaceTypes} = spaceStore;

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
    if (!selectedSpace) {return;}

    spaceManagerStore.deleteSubSpace(selectedSpace.id).then(() => {
      removeSubSpaceConfirmationDialog.close();
      spaceStore.fetchSpaceInformation();
    });
  };

  const handleAddSubSpace = () => {
    if (space.id) {
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
        {addSubSpaceDialog.isOpen && spaceStore.space.id && allowedSpaceTypesRequest.isDone && (
          <AddSubSpaceDialog
            parentId={spaceStore.space.id}
            onClose={addSubSpaceDialog.close}
            allowedSubSpaceTypes={allowedSpaceTypes}
          />
        )}
        {space.subSpaces.map((subSpace) => (
          <AdminListItem
            key={subSpace.uuid}
            name={subSpace.name}
            userId={subSpace.uuid}
            onEdit={handleSubSpaceEdit}
            onRemove={handleSubSpaceRemove}
          />
        ))}
      </styled.List>
    </SectionPanel>
  );
};

export default observer(SubSpacesPanel);
