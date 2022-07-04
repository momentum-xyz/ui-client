import React, {useContext, useState} from 'react';

import {usePosBusEvent} from 'shared/hooks';

export enum StageModePopupType {
  AWAITING_PERMISSION = 'AWAITING_PERMISSION',
  RECEIVED_PERMISSION_REQUEST = 'RECEIVED_PERMISSION_REQUEST'
}

export interface StageModePopupOptions {
  user?: string;
  userId?: string;
  onAccept?: () => Promise<boolean>;
  onDecline?: () => Promise<boolean>;
}

export interface StageModePopupInfo {
  userId?: string;
  type: StageModePopupType;
  user?: string;
  onAccept?: () => Promise<boolean>;
  onDecline?: () => Promise<boolean>;
}

export interface StageModePopupQueueContextInterface {
  popups: StageModePopupInfo[];
  addRequestPopup: (userId: string, options?: StageModePopupOptions) => void;
  removeRequestPopup: (userId: string) => void;
  addAwaitingPermissionPopup: () => void;
  removeAwaitingPermissionPopup: () => void;
  clearPopups: () => void;
}

const StageModePopupQueueContext = React.createContext<StageModePopupQueueContextInterface>({
  popups: [],
  addRequestPopup: () => {},
  removeRequestPopup: () => {},
  addAwaitingPermissionPopup: () => {},
  removeAwaitingPermissionPopup: () => {},
  clearPopups: () => {}
});

export const StageModePopupQueueProvider: React.FC = ({children}) => {
  const [popups, setPopups] = useState<StageModePopupInfo[]>([]);

  const addRequestPopup = (userId: string, options?: StageModePopupOptions) => {
    setPopups([
      ...popups,
      {
        userId: userId,
        type: StageModePopupType.RECEIVED_PERMISSION_REQUEST,
        ...options
      }
    ]);
  };

  const addAwaitingPermissionPopup = () => {
    setPopups([
      ...popups,
      {
        type: StageModePopupType.AWAITING_PERMISSION
      }
    ]);
  };

  const removeRequestPopup = (userId: string) => {
    const filteredPopups = popups.filter(
      (info) =>
        info.type === StageModePopupType.RECEIVED_PERMISSION_REQUEST && info.userId !== userId
    );
    setPopups(filteredPopups);
  };

  const removeAwaitingPermissionPopup = () => {
    const filteredPopups = popups.filter(
      (info) => info.type !== StageModePopupType.AWAITING_PERMISSION
    );
    setPopups(filteredPopups);
  };

  const clearPopups = () => {
    setPopups([]);
  };

  usePosBusEvent('stage-mode-accepted', (userId) => {
    removeRequestPopup(userId);
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    removeRequestPopup(userId);
  });

  return (
    <StageModePopupQueueContext.Provider
      value={{
        popups,
        addRequestPopup,
        addAwaitingPermissionPopup,
        removeAwaitingPermissionPopup,
        removeRequestPopup,
        clearPopups
      }}
    >
      {children}
    </StageModePopupQueueContext.Provider>
  );
};

export default StageModePopupQueueContext;

export const useStageModePopupQueueContext = () => useContext(StageModePopupQueueContext);
