import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit-storybook';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import * as styled from './UserDetailsWidget.styled';

const UserDetailsWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {userDetailsStore} = widgetStore;
  const {userDetails} = userDetailsStore;

  const {t} = useI18n();

  useEffect(() => {
    if (data?.id) {
      Universe3dEmitter.emit('UserSelected', (data?.id || '').toString());
      userDetailsStore.init(data.id.toString());
    }
    return () => {
      userDetailsStore.resetModel();
    };
  }, [userDetailsStore, data?.id]);

  if (!userDetails) {
    return <></>;
  }

  return (
    <styled.Container data-testid="UserDetailsWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="astronaut"
        variant="primary"
        title={t('labels.memberProfile')}
        onClose={widgetManagerStore.closeAll}
      >
        <styled.Content>
          <div>{userDetails.user.name}</div>
          <div>{userDetails.user.id}</div>

          {/* All required data are already available inside userDetails model. */}
          {/* It doesn't need to make additional requests to BE. Just use. */}
          {/* Copy markup from ExploreWidget/components/UserDetails */}
        </styled.Content>
      </Panel>
    </styled.Container>
  );
};

export default observer(UserDetailsWidget);
