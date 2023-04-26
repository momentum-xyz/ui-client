import {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import {OnlineUsersList, CurrentWorld} from './components';
import * as styled from './WorldBasePage.styled';

const WorldBasePage: FC = () => {
  const {universeStore, widgetManagerStore, agoraStore} = useStore();
  const {isLeftWidgetShown, isRightWidgetShown} = widgetManagerStore;
  const {agoraVoiceChatStore} = agoraStore;
  const {world2dStore, world3dStore} = universeStore;

  console.log('[WORLD] Users are in VC: ', agoraVoiceChatStore.users.length);
  console.log('[WORLD] Remove users are in VC: ', agoraVoiceChatStore.agoraRemoteUsers.length);

  const onInviteToVoiceChat = useCallback((userId: string) => {
    console.log('Invite to the Voice chat: ', userId);
  }, []);

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
            onInviteToVoiceChat={onInviteToVoiceChat}
            onSendHighFive={onSendHighFive}
          />
        )}
      </styled.OnlineUsers>

      <styled.World>
        {!isRightWidgetShown && <CurrentWorld worldId={world2dStore?.worldId || ''} />}
      </styled.World>
    </styled.Container>
  );
};

export default observer(WorldBasePage);
