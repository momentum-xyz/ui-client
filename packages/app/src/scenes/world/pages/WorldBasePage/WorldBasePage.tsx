import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import {OnlineUsersList, CurrentWorld} from './components';
import * as styled from './WorldBasePage.styled';

const WorldBasePage: FC = () => {
  const {universeStore, widgetManagerStore} = useStore();
  const {isLeftWidgetShown, isRightWidgetShown} = widgetManagerStore;
  const {world2dStore} = universeStore;

  return (
    <styled.Container data-testid="WorldBasePage-test">
      <styled.OnlineUsers>
        {!isLeftWidgetShown && (
          <OnlineUsersList onlineUsers={world2dStore?.onlineUsersList || []} />
        )}
      </styled.OnlineUsers>

      <styled.World>
        {!isRightWidgetShown && <CurrentWorld worldId={world2dStore?.worldId || ''} />}
      </styled.World>
    </styled.Container>
  );
};

export default observer(WorldBasePage);
