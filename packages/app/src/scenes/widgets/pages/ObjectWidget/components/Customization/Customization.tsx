import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, PositionEnum} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import {ContentViewer, NewOrEditForm} from './components';
import * as styled from './Customization.styled';

const Customization: FC = () => {
  const {universeStore, sessionStore, widgetManagerStore} = useStore();
  const {objectStore} = universeStore;
  const {objectContentStore} = objectStore;
  const {customizableContent} = objectContentStore;

  const canUserEdit = customizableContent.content?.claimed_by === sessionStore.userId;
  const canUserDelete = canUserEdit || universeStore.isMyWorld;

  const handleSignUp = () => {
    widgetManagerStore.closeAll();
    widgetManagerStore.open(WidgetEnum.LOGIN, PositionEnum.LEFT);
  };

  if (customizableContent.isLoading) {
    return <></>;
  }

  if (sessionStore.isGuest && !customizableContent.content) {
    return (
      <styled.NotAllowed>
        <div>
          To customize an object you need to be a member. Join Odyssey by connecting your wallet.
        </div>
        <div>
          <Button icon="astronaut" label="Sign Up now" onClick={handleSignUp} />
        </div>
      </styled.NotAllowed>
    );
  }

  return (
    <styled.Container data-testid="CustomViewer-test">
      {customizableContent.isNewOrEditForm && (
        <NewOrEditForm
          content={customizableContent.content}
          isPending={customizableContent.isPending}
          onCreateOrUpdate={async (form) => {
            if (await customizableContent.claimAndCustomize(form)) {
              customizableContent.setIsEditing(false);
              customizableContent.fetchContent();
            }
          }}
        />
      )}

      {customizableContent.isViewForm && !!customizableContent.content && (
        <ContentViewer
          content={customizableContent.content}
          onDelete={canUserDelete ? () => {} : undefined}
          onEdit={canUserEdit ? () => {} : undefined}
        />
      )}
    </styled.Container>
  );
};

export default observer(Customization);
