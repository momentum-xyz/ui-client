import {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Panel} from '@momentum-xyz/ui-kit';

import {useNavigation, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import {Visitor} from './components';
import * as styled from './WorldVisitorsWidget.styled';

const WorldVisitorsWidget: FC = () => {
  const {universeStore, widgetManagerStore} = useStore();
  const {world2dStore, world3dStore} = universeStore;

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

  const onVisitWorld = (worldId: string) => {
    goToOdysseyHome(worldId);
  };

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
    <styled.Container data-testid="WorldVisitorsWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="group"
        variant="primary"
        title={t('labels.visitors')}
        onClose={() => widgetManagerStore.close(WidgetEnum.WORLD_VISITORS)}
      >
        <styled.Content>
          <styled.ScrollableContainer>
            {world2dStore?.onlineUsersList.map((userDetails) => (
              <Visitor
                key={userDetails.userId}
                userDetails={userDetails}
                onVisitWorld={onVisitWorld}
                onSendHighFive={onSendHighFive}
                onInviteToVoiceChat={onInviteToVoiceChat}
              />
            ))}
          </styled.ScrollableContainer>
        </styled.Content>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldVisitorsWidget);
