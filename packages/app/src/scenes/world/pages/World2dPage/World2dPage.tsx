import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useParams} from 'react-router-dom';
import {PositionEnum} from '@momentum-xyz/ui-kit';

import {PosBusService} from 'shared/services';
import {useNavigation, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import {OnlineUsersList, CurrentWorld} from './components';
import * as styled from './World2dPage.styled';

const World2dPage: FC = () => {
  const {universeStore, widgetManagerStore, widgetStore, agoraStore} = useStore();
  const {isLeftWidgetShown, isRightWidgetShown} = widgetManagerStore;
  const {agoraVoiceChatStore} = agoraStore;
  const {world2dStore, world3dStore} = universeStore;
  const {timelineStore} = widgetStore;

  console.log('[World2d] Users are in VC: ', agoraVoiceChatStore.users.length);
  console.log('[World2d] Remove users are in VC: ', agoraVoiceChatStore.agoraRemoteUsers.length);

  const {goToOdysseyHome} = useNavigation();
  const {worldId} = useParams<{worldId: string}>();

  useEffect(() => {
    if (worldId) {
      universeStore.enterWorld(worldId);
      agoraStore.initUsers(worldId);
      timelineStore.subscribe(worldId);
    }
    return () => {
      universeStore.leaveWorld();
      agoraStore.leaveVoiceChat();
      widgetManagerStore.closeAll();
      timelineStore.unsubscribe();
      PosBusService.leaveWorld();
    };
  }, [worldId, timelineStore, agoraStore, universeStore, widgetManagerStore]);

  const onInviteToVoiceChat = (userId: string) => {
    console.log('Invite to the Voice chat: ', userId);
  };

  const onVisitWorld = (worldId: string) => {
    goToOdysseyHome(worldId);
  };

  const onViewWorld = () => {
    widgetManagerStore.open(WidgetEnum.WORLD_PROFILE, PositionEnum.RIGHT);
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
            key={worldId}
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
              <CurrentWorld
                world={world2dStore.worldDetails.world}
                onViewWorld={onViewWorld}
                onStakeWorld={onStakeWorld}
              />
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
