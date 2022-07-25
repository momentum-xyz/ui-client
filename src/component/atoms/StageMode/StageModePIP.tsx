import React, {useCallback, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
import {ReactComponent as FullScreenIcon} from 'images/icons/expand-full.svg';
import {useStore} from 'shared/hooks';

import StageModeStage from './StageModeStage';

const StageModePIP: React.FC = () => {
  const {mainStore} = useStore();
  const {agoraStore} = mainStore;
  const history = useHistory();

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

  if (agoraStore.isStageMode) {
    return (
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        title="Click to go to stage-mode"
        className="absolute overflow-hidden bg-black-80 rounded bottom-5 opacity-80 hover:opacity-100 right-10.5 w-30 max-h-32 cursor-pointer"
      >
        <StageModeStage />

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

export default observer(StageModePIP);
