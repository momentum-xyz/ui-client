import {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {PositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {useNavigation, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import {OnlineUsersList, CurrentWorld} from './components';
import * as styled from './World2dPage.styled';

const World2dPage: FC = () => {
  const {universeStore, widgetManagerStore, agoraStore} = useStore();
  const {isLeftWidgetShown, isRightWidgetShown} = widgetManagerStore;
  const {agoraVoiceChatStore} = agoraStore;
  const {world2dStore, world3dStore} = universeStore;

  console.log('[WORLD] Users are in VC: ', agoraVoiceChatStore.users.length);
  console.log('[WORLD] Remove users are in VC: ', agoraVoiceChatStore.agoraRemoteUsers.length);

  const {goToOdysseyHome} = useNavigation();

  const onInviteToVoiceChat = (userId: string) => {
    console.log('Invite to the Voice chat: ', userId);
  };

  const onVisitWorld = (worldId: string) => {
    goToOdysseyHome(worldId);
  };

  const onStakeWorld = () => {
    widgetManagerStore.open(WidgetEnum.STAKING, PositionEnum.RIGHT);
  };

  const onOpenVisitors = () => {
    widgetManagerStore.open(WidgetEnum.WORLD_VISITORS, PositionEnum.RIGHT);
  };

  const onSendHighFive = useCallback(
    (userId: string) => {
      world3dStore?.sendHighFive(userId);
    },
    [world3dStore]
  );

  return (
    <styled.Container data-testid="World2dPage-test">
      <styled.OnlineUsers>
        {!isLeftWidgetShown && (
          <OnlineUsersList
            onlineUsers={world2dStore?.onlineUsersList || []}
            voiceChatUsers={agoraVoiceChatStore.users.map((u) => u.id)}
            onVisitWorld={onVisitWorld}
            onInviteToVoiceChat={onInviteToVoiceChat}
            onSendHighFive={onSendHighFive}
            onOpenVisitors={onOpenVisitors}
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

      {/*
      <styled.BottomCenteredDock>
        <EmojiAnimationDock />
      </styled.BottomCenteredDock>
      */}
    </styled.Container>
  );
};

export default observer(World2dPage);
