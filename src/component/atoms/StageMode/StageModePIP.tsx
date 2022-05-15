import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';

import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {useAgoraStageMode} from '../../../hooks/communication/useAgoraStageMode';
import {AgoraContext} from '../../../context/AgoraContext';

import StageModeStage from './StageModeStage';

const StageModePIP: React.FC = () => {
  const {collaborationState} = useCollaboration();
  // eslint-disable-next-line no-empty-pattern
  const {} = useContext(AgoraContext);
  const history = useHistory();
  const {isOnStage} = useAgoraStageMode();

  if (collaborationState.stageMode) {
    return (
      <div
        onClick={() => {
          history.push(ROUTES.stageMode);
        }}
        title="Click to go to stage-mode"
        className="absolute overflow-hidden bg-black-80 rounded bottom-5 opacity-80 hover:opacity-100 right-10.5 w-30 max-h-32 cursor-pointer"
      >
        <StageModeStage isOnStage={isOnStage} />
        <div className="bg-black-80 rounded-br p-.5 px-1 text-xs text-white-50 font-bold uppercase absolute left-0 top-0">
          On stage
        </div>
      </div>
    );
  }

  return null;
};

export default StageModePIP;
