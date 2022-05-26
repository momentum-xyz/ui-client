import {useCallback} from 'react';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import {useJoinCollaborationSpaceByAssign} from '../../Collaboration/hooks/useCollaboration';

import useUnityEvent from './useUnityEvent';

const useInteractionHandlers = () => {
  const {unityStore} = useStore().mainStore;
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();

  const clickDashboardCallback = useCallback(
    (id) => {
      joinMeetingSpace(id).then(() => {
        unityStore.pause();
        history.push({pathname: ROUTES.dashboard});
      });
    },
    [history]
  );
  useUnityEvent('ClickEventDashboard', clickDashboardCallback);

  // const screenClick2Callback = useCallback(() => {
  //   unityStore.pause();
  //   history?.push({
  //     pathname: `/livestream`,
  //   });
  // }, [history]);
  // useUnityEvent('Screen2ClickEvent', screenClick2Callback);

  // const screenClick3Callback = useCallback(
  //   (id) => {
  //     joinMeetingSpace(id).then(() => {
  //       unityStore.pause();
  //       history.push({ pathname: '/collaboration/dashboard' });
  //     });
  //   },
  //   [history],
  // );
  // useUnityEvent('Screen3ClickEvent', screenClick3Callback);

  const plasmaClickCallback = useCallback(
    (id) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      joinMeetingSpace(id).then(() => {
        unityStore.pause();
        history.push({pathname: ROUTES.collaboration});
      });
    },
    [history, joinMeetingSpace]
  );
  useUnityEvent('PlasmaClickEvent', plasmaClickCallback);
};

export default useInteractionHandlers;
