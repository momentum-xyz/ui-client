import React from 'react';

import {useStageModePopupQueueContext} from '../../../context/StageMode/StageModePopupQueueContext';
import {useAgoraStageMode} from '../../../hooks/communication/useAgoraStageMode';

import StageModePopup from './StageModePopup';

const StageModePopupQueueComponent: React.FC = () => {
  const {popups} = useStageModePopupQueueContext();
  const {canEnterStage} = useAgoraStageMode();

  return (
    <div className="flex flex-col space-y-2 h-full">
      {popups.map((info) => (
        <StageModePopup
          info={info}
          key={'stagepop-up:' + info.userId}
          canEnterStage={canEnterStage()}
        />
      ))}
    </div>
  );
};

export default StageModePopupQueueComponent;
