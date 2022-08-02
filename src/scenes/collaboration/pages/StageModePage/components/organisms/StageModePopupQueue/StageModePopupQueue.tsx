import {observer} from 'mobx-react-lite';
import React from 'react';

import {useStore} from 'shared/hooks';
import {StageModePopup} from 'scenes/collaboration/pages/StageModePage/components';

const StageModePopupQueue: React.FC = () => {
  const {mainStore, collaborationStore} = useStore();
  const {stageModeStore} = collaborationStore;
  const {agoraStageModeStore} = mainStore.agoraStore;

  return (
    <div className="flex flex-col space-y-2 h-full overflow-y-auto">
      {stageModeStore.popups.map((info) => (
        <StageModePopup
          info={info}
          key={'stagepop-up:' + info.userId}
          canEnterStage={agoraStageModeStore.canEnterStage}
        />
      ))}
    </div>
  );
};

export default observer(StageModePopupQueue);
