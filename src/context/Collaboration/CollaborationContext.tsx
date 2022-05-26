import React, {useReducer} from 'react';

import {useCurrentUser} from '../../hooks/api/useUser';
import {bytesToUuid} from '../../core/utils/uuid.utils';

import {CollaborationActionTypes, collaborationReducer} from './CollaborationReducer';
import {CollaborationState, collaborationStateDefaults} from './CollaborationState';

export interface ICollaborationContext {
  collaborationState: CollaborationState;
  collaborationDispatch: React.Dispatch<CollaborationActionTypes>;
  currentUserId?: string;
}

const CollaborationContext = React.createContext<ICollaborationContext | undefined>(undefined);

interface CollaborationProviderProps {
  children: React.ReactNode;
}

const CollaborationProvider = (props: CollaborationProviderProps) => {
  const [currentUser, , ,] = useCurrentUser();
  const [collaborationState, collaborationDispatch] = useReducer(
    collaborationReducer,
    collaborationStateDefaults
  );

  return (
    <CollaborationContext.Provider
      value={{
        currentUserId: currentUser?.id.data && bytesToUuid(currentUser?.id.data),
        collaborationState,
        collaborationDispatch
      }}
    >
      {props.children}
    </CollaborationContext.Provider>
  );
};

export {CollaborationProvider, CollaborationContext};
