import {observer} from 'mobx-react-lite';
import React from 'react';

import {useStore} from 'shared/hooks';

import {useStageModePopupQueueContext} from '../../../context/StageMode/StageModePopupQueueContext';

import StageModePopup from './StageModePopup';

const StageModePopupQueueComponent: React.FC = () => {
  const {popups} = useStageModePopupQueueContext();
  const {agoraStore} = useStore().mainStore;

  return (
    <div className="flex flex-col space-y-2 h-full overflow-y-auto">
      {popups.map((info) => (
        <StageModePopup
          info={info}
          key={'stagepop-up:' + info.userId}
          canEnterStage={agoraStore.canEnterStage}
        />
      ))}
    </div>
  );
};

export default observer(StageModePopupQueueComponent);
