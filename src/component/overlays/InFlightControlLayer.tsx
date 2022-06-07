import {Transition} from '@headlessui/react';
import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {usePrevious} from 'ui-kit/hooks';

import CollaborationSpace from '../../context/Collaboration/CollaborationTypes';
import useCollaboration, {
  // useJoinCollaborationSpace,
  useJoinCollaborationSpaceByAssign
} from '../../context/Collaboration/hooks/useCollaboration';
import Button from '../atoms/Button';
import {ROUTES} from '../../core/constants';
import {useStore} from '../../shared/hooks';

export interface InFlightControlLayerProps {}

const InFlightControlLayer: React.FC<InFlightControlLayerProps> = () => {
  const {collaborationState} = useCollaboration();
  // const joinCollaborationSpace = useJoinCollaborationSpace();
  const {
    communicationStore: {communicationLayerStore},
    mainStore: {unityStore}
  } = useStore();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();

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

  // const rejoin = useCallback(() => {
  //   if (leftCollaborationSpace) {
  //     joinCollaborationSpace(leftCollaborationSpace);
  //   }
  // }, [joinCollaborationSpace, leftCollaborationSpace]);

  const rejoin = useCallback(() => {
    if (leftCollaborationSpace) {
      joinMeetingSpace(leftCollaborationSpace.id).then(() => {
        unityStore.pause();
        history.push({pathname: ROUTES.dashboard});
      });
    }
  }, [leftCollaborationSpace, joinMeetingSpace, history]);

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
        {!communicationLayerStore.isKicked && (
          <Button type="ghost" onClick={rejoin}>
            rejoin meeting
          </Button>
        )}
      </Transition>
    </>
  );
};

export default InFlightControlLayer;
