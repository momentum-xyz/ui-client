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
    [history, joinMeetingSpace, t, unityStore]
  );
  useUnityEvent('ClickEventDashboard', clickDashboardCallback);

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
          joinMeetingSpace(id).then(() => {
            unityStore.pause();
            history.push({pathname: ROUTES.collaboration});
          });
        }
      });
    },
    [history, joinMeetingSpace, t, unityStore]
  );
  useUnityEvent('PlasmaClickEvent', plasmaClickCallback);
};

export default useInteractionHandlers;
