import React, {useCallback, useContext, useRef, useState} from 'react';
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

  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({x: 0, y: 0});

  const onMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const onMouseMove = (event: MouseEvent) => {
        position.x += event.movementX;
        position.y += event.movementY;
        if (ref.current) {
          ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }
        setPosition(position);
      };
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [position, setPosition, ref]
  );

  if (collaborationState.stageMode) {
    return (
      <div
        ref={ref}
        onMouseDown={onMouseDown}
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
            history.push(ROUTES.collaboration.stageMode);
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
