import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {IconSvg, Text, TopBar, Button} from 'ui-kit';
import useCollaboration, {
  useLeaveCollaborationSpace
} from 'context/Collaboration/hooks/useCollaboration';
import {useStageModeLeave} from 'hooks/api/useStageModeService';
import {useStore} from 'shared/hooks';
import {UnityService} from 'shared/services';

import TopbarButton from '../../../../component/atoms/topbar/TopbarButton';

import Dashboard from './components/templates/Dashboard/Dashboard';
import * as styled from './DashboardPage.styled';

const DashboardPage: FC = () => {
  const {
    collaborationStore: {dashboard, space},
    sessionStore
  } = useStore();

  const {tileList, onDragEnd} = dashboard;

  useEffect(() => {
    if (space.id) {
      dashboard.fetchDashboard(space.id);
    }
    return () => {
      dashboard.resetModel();
    };
  }, []);

  const leaveCollaborationSpaceCall = useLeaveCollaborationSpace();
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const stageModeLeave = useStageModeLeave(collaborationState.collaborationSpace?.id);

  // TODO: make as action in store
  const leaveCollaborationSpace = () => {
    if (collaborationState.collaborationSpace) {
      UnityService.leaveSpace(collaborationState.collaborationSpace.id);
      leaveCollaborationSpaceCall(false).then(stageModeLeave);

      if (collaborationState.stageMode) {
        collaborationDispatch({
          type: 'COLLABORATION_STAGE_MODE_ACTION_UPDATE',
          stageMode: false
        });
      }
    }
  };

  const actions = () => {
    return (
      <>
        {space.isAdmin && (
          <TopbarButton
            title="Open Admin"
            link={'/space/' + space.id + '/admin'}
            isActive={(match, location) => {
              return location.pathname.includes('/space/' + space.id + '/admin');
            }}
            state={{canGoBack: true}}
          >
            <IconSvg name="pencil" size="medium-large" />
          </TopbarButton>
        )}
      </>
    );
  };

  return (
    <styled.Container>
      <TopBar
        title={space.name ?? ''}
        subtitle={t('dashboard.subtitle')}
        onClose={leaveCollaborationSpace}
        actions={actions()}
      >
        <Button label={t('dashboard.vibe')} variant="primary" />
        {(space.isAdmin || space.isMember) && (
          <Button label={t('dashboard.addTile')} variant="primary" />
        )}
        <Button label={t('dashboard.invitePeople')} icon="invite-user" variant="primary" />
        {!sessionStore.isGuest && space.isStakeShown && (
          <Button label={t('dashboard.stake')} variant="primary" />
        )}
      </TopBar>
      {!dashboard.dashboardIsEdited && space.isOwner && (
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
      <Dashboard
        tilesList={tileList.tileMatrix}
        onDragEnd={onDragEnd}
        canDrag={space.isAdmin || space.isMember}
      />
    </styled.Container>
  );
};

export default observer(DashboardPage);
