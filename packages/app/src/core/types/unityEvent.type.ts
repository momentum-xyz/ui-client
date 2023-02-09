import {UnityPositionInterface} from 'core/interfaces';

export type UnityEventType = {
  MomentumLoaded: () => void;
  TeleportReady: () => void;
  HideMinimap: () => void;
  InvalidToken: () => void;
  ExterminateUnity: (topic: string) => void;
  ClickObjectEvent: (id: string, label: string) => void;
  EditObjectEvent: (id: string) => void;
  ProfileClickEvent: (id: string, position: UnityPositionInterface) => void;
  Error: (message: string) => void;
};
