import React, {FC, useEffect, useState} from 'react';
import {useTheme} from 'styled-components';

import {Text, Toggle, TopBar} from 'ui-kit';
import {useStore} from 'shared/hooks';

import useCollaboration, {
  useLeaveCollaborationSpace
} from '../../../../context/Collaboration/hooks/useCollaboration';
import {useStageModeLeave} from '../../../../hooks/api/useStageModeService';

import * as styled from './StageModePage.styled';

const StageModePage: FC = () => {
  const theme = useTheme();
  const {collaborationStore} = useStore();
  const {spaceStore} = collaborationStore;
  const {space} = spaceStore;

  const {collaborationState, collaborationDispatch} = useCollaboration();
  const leaveCollaborationSpaceCall = useLeaveCollaborationSpace();
  const stageModeLeave = useStageModeLeave(collaborationState.collaborationSpace?.id);

  // TODO: move to store
  const [stageMode, setStageMode] = useState(0);

  // TODO: make as action in store
  const leaveCollaborationSpace = () => {
    spaceStore.resetModel();
    if (collaborationState.collaborationSpace) {
      leaveCollaborationSpaceCall(false).then(stageModeLeave);

      if (collaborationState.stageMode) {
        collaborationDispatch({
          type: 'COLLABORATION_STAGE_MODE_ACTION_UPDATE',
          stageMode: false
        });
      }
    }
  };

  useEffect(() => {
    console.info('stageModePage');
  }, []);

  return (
    <styled.Container>
      <TopBar title={space.name ?? ''} subtitle="stage" onClose={leaveCollaborationSpace}>
        {(spaceStore.isAdmin || spaceStore.isMember) && (
          <styled.ToggleContainer>
            <Toggle checked={stageMode} onChange={(checked) => setStageMode(checked ? 1 : 0)} />
            <Text theme={theme} text="Stage active" size="xs" />
          </styled.ToggleContainer>
        )}
      </TopBar>
      <div>StageMode</div>
    </styled.Container>
  );
};
export default StageModePage;
