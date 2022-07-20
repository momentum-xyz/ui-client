import {Transition} from '@headlessui/react';
import React, {useCallback, useEffect, useState} from 'react';
import {generatePath, useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {usePrevious} from 'ui-kit/hooks';
import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';

// TODO: Refactor
import CollaborationSpace from '../../context/Collaboration/CollaborationTypes';
import useCollaboration from '../../context/Collaboration/hooks/useCollaboration';
import Button from '../atoms/Button';

const InFlightControlLayer: React.FC = () => {
  const {
    communicationStore: {communicationLayerStore},
    mainStore: {unityStore}
  } = useStore();

  const {collaborationState} = useCollaboration();
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
  }, [collaborationState.collaborationSpace]);

  const rejoin = useCallback(() => {
    if (leftCollaborationSpace) {
      unityStore.teleportToSpace(leftCollaborationSpace.id);
      setTimeout(() => {
        const params = {spaceId: leftCollaborationSpace.id};
        history.push(generatePath(ROUTES.collaboration.dashboard, params));
      }, TELEPORT_DELAY_MS);
    }
  }, [history, leftCollaborationSpace, unityStore]);

  return (
    <>
      <Transition
        show={
          !!leftCollaborationSpace &&
          !collaborationState.removedCollaborationSpace &&
          !communicationLayerStore.isKicked
        }
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
