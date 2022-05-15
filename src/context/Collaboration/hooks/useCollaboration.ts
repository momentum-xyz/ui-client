import {useCallback, useContext} from 'react';

import {request} from 'api/request';

import {AgoraContext} from '../../AgoraContext';
import {CollaborationContext} from '../CollaborationContext';
import UnityService from '../../../context/Unity/UnityService';
import {
  COLLABORATION_ENABLED_ACTION_UPDATE,
  COLLABORATION_SPACE_ACTION_REMOVE,
  COLLABORATION_SPACE_ACTION_UPDATE,
  COLLABORATION_TABLE_UPDATE
} from '../CollaborationReducer';
import CollaborationSpace from '../CollaborationTypes';
import {Space} from '../../type/Space';
import {PosBusInteractionType} from '../../Unity/UnityService';

// eslint-disable-next-line import/no-cycle

const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationContext');
  }
  return context;
};

export const useLeaveCollaborationSpace = () => {
  const {collaborationState, collaborationDispatch} = useCollaboration();

  const leaveCollaborationTable = useCallback(
    async (isAfterRemoving: boolean) => {
      if (collaborationState.collaborationSpace) {
        collaborationDispatch({
          type: COLLABORATION_SPACE_ACTION_UPDATE,
          collaborationSpace: null
        });
      }

      if (collaborationState.collaborationTable) {
        collaborationDispatch({
          type: COLLABORATION_TABLE_UPDATE,
          collaborationTable: null
        });
      }

      collaborationDispatch({
        type: COLLABORATION_ENABLED_ACTION_UPDATE,
        enabled: false
      });
      collaborationDispatch({
        type: COLLABORATION_SPACE_ACTION_REMOVE,
        removedCollaborationSpace: isAfterRemoving
      });

      return {};
    },
    [collaborationState.collaborationTable?.id, collaborationDispatch]
  );

  return leaveCollaborationTable;
};

export const useJoinCollaborationSpace = () => {
  const {collaborationDispatch} = useCollaboration();
  const {getMicrophoneConsent, getCameraConsent, cameraConsent, microphoneConsent} =
    useContext(AgoraContext);

  const joinCollaborationSpace = useCallback(
    async (collaborationSpace: CollaborationSpace, isTable?: boolean) => {
      if (!microphoneConsent) {await getMicrophoneConsent();}
      if (!cameraConsent) {await getCameraConsent();}

      if (isTable) {
        collaborationDispatch({
          type: COLLABORATION_TABLE_UPDATE,
          collaborationTable: collaborationSpace
        });
      } else {
        collaborationDispatch({
          type: COLLABORATION_SPACE_ACTION_UPDATE,
          collaborationSpace
        });
      }

      UnityService.triggerInteractionMsg?.(
        PosBusInteractionType.EnteredSpace,
        collaborationSpace.id,
        0,
        ''
      );

      return {};
    },
    [getMicrophoneConsent, collaborationDispatch]
  );

  return joinCollaborationSpace;
};

export const useJoinCollaborationSpaceByAssign = () => {
  const joinCollaborationspace = useJoinCollaborationSpace();

  const joinCollaborationSpaceByType = useCallback(
    async (id: string, isTable?: boolean) => {
      const url = window._env_.BACKEND_ENDPOINT_URL + `/space/user/${id}`;
      const response = await request.get(url);

      const collaborationSpaceOwner: Space = response.data.space;

      await joinCollaborationspace(
        {
          id: id,
          name: collaborationSpaceOwner.name
        },
        isTable
      );
    },
    [joinCollaborationspace]
  );

  return joinCollaborationSpaceByType;
};

export default useCollaboration;
