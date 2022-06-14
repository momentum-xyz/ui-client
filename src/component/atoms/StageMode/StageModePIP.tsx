import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {ReactComponent as FullScreenIcon} from 'images/icons/expand-full.svg';

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

  const [isDragging, setIsDragging] = useState(false);
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerLeave = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleDragMove(e);
    }
  };

  const handleDragMove = (e: React.PointerEvent) => {
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY
    });
  };

  if (collaborationState.stageMode) {
    return (
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
        }}
        title="Click to go to stage-mode"
        className="absolute overflow-hidden bg-black-80 rounded bottom-5 opacity-80 hover:opacity-100 right-10.5 w-30 max-h-32 cursor-pointer"
      >
        <StageModeStage isOnStage={isOnStage} />

        <div className="bg-black-80 rounded-br p-.5 px-1 text-xs text-white-50 font-bold uppercase absolute left-0 top-0">
          On stage
        </div>
        <div
          className="bg-black-80 rounded-bl p-.5 px-1 text-xs text-white-50 hover:text-white-100 font-bold uppercase absolute right-0 top-0"
          onClick={() => {
            history.push(ROUTES.stageMode);
          }}
        >
          <FullScreenIcon className="w-1.5 h-1.5 " />
        </div>
      </div>
    );
  }

  return null;
};

export default StageModePIP;
