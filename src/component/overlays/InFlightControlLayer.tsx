import {Transition} from '@headlessui/react';
import React, {useCallback} from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import Button from '../atoms/Button';

const InFlightControlLayer: React.FC = () => {
  const {
    collaborationStore,
    meetingStore,
    mainStore: {unityStore}
  } = useStore();
  const history = useHistory();

  const rejoin = useCallback(() => {
    if (collaborationStore.leftMeetingSpaceId) {
      unityStore.teleportToSpace(collaborationStore.leftMeetingSpaceId);
      const params = {spaceId: collaborationStore.leftMeetingSpaceId};
      history.push(generatePath(ROUTES.collaboration.dashboard, params));
      collaborationStore.rejoinMeetingSpace();
    }
  }, [collaborationStore, unityStore, history]);

  return (
    <>
      <Transition
        show={!!collaborationStore.leftMeetingSpaceId && !meetingStore.isKicked}
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

export default observer(InFlightControlLayer);
