import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {IconSvg, Text, TopBar} from 'ui-kit';
import useCollaboration, {
  useLeaveCollaborationSpace
} from 'context/Collaboration/hooks/useCollaboration';
import {useStageModeLeave} from 'hooks/api/useStageModeService';
import {UnityService} from 'shared/services';
import {PosBusEventEnum} from 'core/enums';
import {useStore} from 'shared/hooks';

import * as styled from './DashboardPage.styled';
import Dashboard from './components/templates/Dashboard/Dashboard';

const DashboardPage: FC = () => {
  const {
    collaborationStore: {dashboardStore, spaceStore}
  } = useStore();
  const leaveCollaborationSpaceCall = useLeaveCollaborationSpace();
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const stageModeLeave = useStageModeLeave(collaborationState.collaborationSpace?.id);

  // TODO: make as action in store
  const leaveCollaborationSpace = () => {
    if (collaborationState.collaborationSpace) {
      UnityService.triggerInteractionMsg?.(
        PosBusEventEnum.LeftSpace,
        collaborationState.collaborationSpace.id,
        0,
        ''
      );
      leaveCollaborationSpaceCall(false).then(stageModeLeave);

      if (collaborationState.stageMode) {
        collaborationDispatch({
          type: 'COLLABORATION_STAGE_MODE_ACTION_UPDATE',
          stageMode: false
        });
      }
    }
  };

  return (
    <styled.Container>
      <TopBar title="title" subtitle="dashboard" onClose={leaveCollaborationSpace}></TopBar>
      {!dashboardStore.dashboardIsEdited && spaceStore.isOwner && (
        <styled.AlertContainer>
          <IconSvg name="alert" size="large" isWhite />
          <styled.AlertContent>
            <Text
              text={t('titles.updateSpace')}
              size="s"
              weight="bold"
              align="left"
              transform="uppercase"
            />
            <Text text={t('messages.updateSpace')} size="s" align="left" />
          </styled.AlertContent>
        </styled.AlertContainer>
      )}
      <Dashboard />
    </styled.Container>
  );
};

export default observer(DashboardPage);
