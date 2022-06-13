import React from 'react';
import {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {api} from 'api';
import {ToastContent} from 'ui-kit';

import {useJoinCollaborationSpaceByAssign} from '../../Collaboration/hooks/useCollaboration';

import useUnityEvent from './useUnityEvent';

const useInteractionHandlers = () => {
  const {unityStore} = useStore().mainStore;
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();

  const {t} = useTranslation();

  const clickDashboardCallback = useCallback(
    (id) => {
      api.spaceRepository.fetchSpace({spaceId: id}).then((response) => {
        const {space, admin, member} = response.data;

        if (space.secret === 1 && !(admin || member)) {
          toast.error(
            <ToastContent
              isDanger
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('collaboration.spaceIsPrivate')}
              isCloseButton
            />
          );
        } else {
          joinMeetingSpace(id).then(() => {
            unityStore.pause();
            history.push({pathname: ROUTES.dashboard});
          });
        }
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
      api.spaceRepository.fetchSpace({spaceId: id}).then((response) => {
        const {space, admin, member} = response.data;

        if (space.secret === 1 && !(admin || member)) {
          toast.error(
            <ToastContent
              isDanger
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('collaboration.spaceIsPrivate')}
              isCloseButton
            />
          );
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          joinMeetingSpace(id).then(() => {
            unityStore.pause();
            history.push({pathname: ROUTES.collaboration});
          });
        }
      });
    },
    [history, joinMeetingSpace]
  );
  useUnityEvent('PlasmaClickEvent', plasmaClickCallback);
};

export default useInteractionHandlers;
