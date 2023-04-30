import {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {PositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {WidgetEnum} from 'core/enums';

import {OnlineUsersList, CurrentWorld} from './components';
import * as styled from './WorldBasePage.styled';

const WorldBasePage: FC = () => {
  const {universeStore, widgetManagerStore, agoraStore} = useStore();
  const {isLeftWidgetShown, isRightWidgetShown} = widgetManagerStore;
  const {agoraVoiceChatStore} = agoraStore;
  const {world2dStore, world3dStore} = universeStore;

  console.log('[WORLD] Users are in VC: ', agoraVoiceChatStore.users.length);
  console.log('[WORLD] Remove users are in VC: ', agoraVoiceChatStore.agoraRemoteUsers.length);

  const navigate = useNavigate();

  const onInviteToVoiceChat = (userId: string) => {
    console.log('Invite to the Voice chat: ', userId);
  };

  const onVisitWorld = (worldId: string) => {
    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
  };
  const onStakeWorld = () => {
    widgetManagerStore.open(WidgetEnum.STAKING, PositionEnum.RIGHT);
  };

  const onSendHighFive = useCallback(
    (userId: string) => {
      world3dStore?.sendHighFive(userId);
    },
    [world3dStore]
  );

  return (
    <styled.Container data-testid="WorldBasePage-test">
      <styled.OnlineUsers>
        {!isLeftWidgetShown && (
          <OnlineUsersList
            onlineUsers={world2dStore?.onlineUsersList || []}
            voiceChatUsers={agoraVoiceChatStore.users.map((u) => u.id)}
            onVisitWorld={onVisitWorld}
            onInviteToVoiceChat={onInviteToVoiceChat}
            onSendHighFive={onSendHighFive}
          />
        )}
      </styled.OnlineUsers>

      <styled.World>
        {!isRightWidgetShown && (
          <>
            {world2dStore?.worldDetails?.world && (
              <CurrentWorld world={world2dStore.worldDetails.world} onStakeWorld={onStakeWorld} />
            )}
          </>
        )}
      </styled.World>
    </styled.Container>
  );
};

export default observer(WorldBasePage);
