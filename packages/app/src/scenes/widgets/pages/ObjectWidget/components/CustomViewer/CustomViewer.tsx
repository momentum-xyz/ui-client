import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, PositionEnum} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import * as styled from './CustomViewer.styled';

const CustomViewer: FC = () => {
  const {universeStore, sessionStore, widgetManagerStore} = useStore();
  const {objectStore} = universeStore;
  const {objectContentStore} = objectStore;
  const {customizableContent} = objectContentStore;

  const canUserEdit = customizableContent.content?.owner_id === sessionStore.userId;
  const canUserDelete = canUserEdit || universeStore.isMyWorld;

  const handleSignUp = () => {
    widgetManagerStore.closeAll();
    widgetManagerStore.open(WidgetEnum.LOGIN, PositionEnum.LEFT);
  };

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
      {customizableContent.isNewOrEditForm && <div>EDIT</div>}

      {customizableContent.isViewForm && <div>VIEW {canUserDelete}</div>}
    </styled.Container>
  );
};

export default observer(CustomViewer);
