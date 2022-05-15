import {Transition} from '@headlessui/react';
import React, {useCallback, useEffect, useState} from 'react';

import {usePrevious} from 'ui-kit/hooks';

import CollaborationSpace from '../../context/Collaboration/CollaborationTypes';
import useCollaboration, {
  useJoinCollaborationSpace
} from '../../context/Collaboration/hooks/useCollaboration';
import Button from '../atoms/Button';

export interface InFlightControlLayerProps {}

const InFlightControlLayer: React.FC<InFlightControlLayerProps> = () => {
  const {collaborationState} = useCollaboration();
  const joinCollaborationSpace = useJoinCollaborationSpace();

  const prevCollaborationSpace = usePrevious(collaborationState.collaborationSpace);

  const [leftCollaborationSpace, setLeftCollaborationSpace] = useState<CollaborationSpace>();

  // @ts-ignore
  useEffect(() => {
    if (!!prevCollaborationSpace && !collaborationState.collaborationSpace) {
      setLeftCollaborationSpace(prevCollaborationSpace);
      const timeout = setTimeout(() => setLeftCollaborationSpace(undefined), 15000);
      return () => clearTimeout(timeout);
    }
    if (collaborationState.collaborationSpace) {
      setLeftCollaborationSpace(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborationState.collaborationSpace]);

  const rejoin = useCallback(() => {
    if (leftCollaborationSpace) {
      joinCollaborationSpace(leftCollaborationSpace);
    }
  }, [joinCollaborationSpace, leftCollaborationSpace]);

  return (
    <>
      <Transition
        show={!!leftCollaborationSpace && !collaborationState.removedCollaborationSpace}
        enter="transition-opacity delay-500 duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed z-unity-interface top-2 right-23"
      >
        <Button type="ghost" onClick={rejoin}>
          rejoin meeting
        </Button>
      </Transition>
    </>
  );
};

export default InFlightControlLayer;
