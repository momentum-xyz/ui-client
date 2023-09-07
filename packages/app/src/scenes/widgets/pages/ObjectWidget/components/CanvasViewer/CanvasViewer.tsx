import {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Event3dEmitter, useI18n} from '@momentum-xyz/core';
import {Button, Frame, Panel, PositionEnum, TabInterface, Tabs} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import {Contributions, MissionInfo} from './components';
import * as styled from './CanvasViewer.styled';

interface PropsInterface {
  onClose: () => void;
}

type CanvasTabType = 'contributions' | 'mission';

const TABS_LIST: TabInterface<CanvasTabType>[] = [
  {id: 'contributions', icon: 'person_idea', label: 'Contributions'},
  {id: 'mission', icon: 'rocket', label: 'Mission'}
];

const CanvasViewer: FC<PropsInterface> = ({onClose}) => {
  const {universeStore, sessionStore, widgetManagerStore} = useStore();
  const {objectStore, world3dStore} = universeStore;
  const {objectContentStore} = objectStore;
  const {canvasContent} = objectContentStore;
  const {userId} = sessionStore;

  const [activeTab, setActiveTab] = useState<CanvasTabType>('contributions');

  const {t} = useI18n();

  useEffect(() => {
    if (world3dStore?.canvasObjectId) {
      Event3dEmitter.emit('FlyToObject', world3dStore.canvasObjectId);
    }
    return () => {
      canvasContent.resetModel();
    };
  }, [canvasContent, world3dStore, userId]);

  const handleFlyToObject = useCallback(
    (objectId: string) => {
      Event3dEmitter.emit('FlyToObject', objectId);
      widgetManagerStore.open(WidgetEnum.OBJECT, PositionEnum.RIGHT, {id: objectId});
    },
    [widgetManagerStore]
  );

  const handleContribute = useCallback(() => {
    widgetManagerStore.open(WidgetEnum.CONTRIBUTION_FORM, PositionEnum.RIGHT);
  }, [widgetManagerStore]);

  if (canvasContent.isLoading || !world3dStore?.canvasConfig) {
    return <></>;
  }

  return (
    <Panel
      icon="idea"
      size="large"
      isFullHeight
      variant="primary"
      title={t('labels.contributionOverview')}
      onClose={onClose}
      bottomComponent={
        activeTab === 'mission' ? (
          <styled.BottomActions>
            <div />
            <Button
              wide
              icon="person_idea"
              variant="secondary"
              label={t('labels.contribute')}
              onClick={handleContribute}
            />
          </styled.BottomActions>
        ) : null
      }
    >
      <styled.Container data-testid="CanvasViewer-test">
        <Frame>
          <styled.Tabs>
            <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} />
          </styled.Tabs>

          <styled.Content>
            {activeTab === 'contributions' && (
              <Contributions
                contributions={canvasContent.contributions}
                onFlyToObject={handleFlyToObject}
                onContribute={handleContribute}
              />
            )}

            {activeTab === 'mission' && <MissionInfo config={world3dStore.canvasConfig} />}
          </styled.Content>
        </Frame>
      </styled.Container>
    </Panel>
  );
};

export default observer(CanvasViewer);
