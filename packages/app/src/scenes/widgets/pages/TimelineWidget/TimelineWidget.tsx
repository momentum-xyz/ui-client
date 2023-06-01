import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Panel, PostCreator} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import * as styled from './TimelineWidget.styled';

const TimelineWidget: FC = () => {
  const {widgetManagerStore, sessionStore} = useStore();
  const {user} = sessionStore;

  const {t} = useI18n();

  if (!user) {
    return <></>;
  }

  return (
    <styled.Container data-testid="TimelineWidget-test">
      <Panel
        isFullHeight
        size="normal"
        variant="primary"
        icon="clock-two"
        title={t('labels.timeline')}
        onClose={() => widgetManagerStore.close(WidgetEnum.TIMELINE)}
      >
        <styled.Wrapper>
          {!sessionStore.isGuest && (
            <PostCreator
              author={{id: user.id, name: user.name, avatarSrc: user.avatarSrc}}
              onPublish={() => {}}
            />
          )}
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(TimelineWidget);
