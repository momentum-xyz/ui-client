import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit-storybook';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import * as styled from './WorldDetailsWidget.styled';

const WorldDetailsWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {worldDetailsStore} = widgetStore;
  const {worldDetails} = worldDetailsStore;

  const {t} = useI18n();

  useEffect(() => {
    if (data?.id) {
      Universe3dEmitter.emit('WorldSelected', (data?.id || '').toString());
      worldDetailsStore.init(data.id.toString());
    }

    return () => {
      worldDetailsStore.resetModel();
    };
  }, [worldDetailsStore, data?.id]);

  if (!worldDetails) {
    return <></>;
  }

  return (
    <styled.Container data-testid="WorldDetailsWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="rabbit_fill"
        variant="primary"
        title={t('labels.odysseyOverview')}
        onClose={widgetManagerStore.closeAll}
      >
        <styled.Content>
          <div>{worldDetails.id}</div>

          {/* All required data are already available inside worldDetails model. */}
          {/* It doesn't need to make additional requests to BE. Just use. */}
          {/* Copy markup from ExploreWidget/components/WorldDetails */}
        </styled.Content>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldDetailsWidget);
