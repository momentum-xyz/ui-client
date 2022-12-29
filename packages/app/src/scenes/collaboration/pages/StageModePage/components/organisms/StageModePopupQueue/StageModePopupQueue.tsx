import {observer} from 'mobx-react-lite';
import React from 'react';

import {useStore} from 'shared/hooks';
import {StageModePopup} from 'scenes/collaboration/pages/StageModePage/components';

import * as styled from './StageModePopupQueue.styled';

const StageModePopupQueue: React.FC = () => {
  const {mainStore, collaborationStore} = useStore();
  const {stageModeStore} = collaborationStore;
  const {agoraStageModeStore} = mainStore.agoraStore_OLD;

  return (
    <styled.Container data-testid="StageModePopupQueue-test">
      {stageModeStore.popups.map((info) => (
        <StageModePopup
          info={info}
          key={info.userId}
          isStageFull={agoraStageModeStore.isStageFull}
        />
      ))}
    </styled.Container>
  );
};

export default observer(StageModePopupQueue);
