import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Event3dEmitter} from '@momentum-xyz/core';
import {Frame, TabInterface, Tabs} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './CanvasViewer.styled';

interface PropsInterface {
  onClose: () => void;
}

type CanvasTabType = 'contributions' | 'mission' | 'team';

const TABS_LIST: TabInterface<CanvasTabType>[] = [
  {id: 'contributions', icon: 'person_idea', label: 'Contributions'},
  {id: 'mission', icon: 'rocket', label: 'Mission'},
  {id: 'team', icon: 'idea', label: 'Teamwork'}
];

const CanvasViewer: FC<PropsInterface> = ({onClose}) => {
  const {universeStore, sessionStore} = useStore();
  const {objectStore, world3dStore} = universeStore;
  const {objectContentStore} = objectStore;
  const {canvasContent} = objectContentStore;
  const {userId} = sessionStore;

  const [activeTab, setActiveTab] = useState<CanvasTabType>('contributions');

  useEffect(() => {
    if (world3dStore?.canvasObjectId) {
      canvasContent.loadConfig(world3dStore?.canvasObjectId || '');
      Event3dEmitter.emit('FlyToObject', world3dStore.canvasObjectId);
    }
    return () => {
      canvasContent.resetModel();
    };
  }, [canvasContent, world3dStore, userId]);

  if (canvasContent.isLoading) {
    return <></>;
  }

  return (
    <styled.Container data-testid="CanvasViewer-test">
      <Frame>
        <styled.Tabs>
          <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} />
        </styled.Tabs>
      </Frame>
    </styled.Container>
  );
};

export default observer(CanvasViewer);
