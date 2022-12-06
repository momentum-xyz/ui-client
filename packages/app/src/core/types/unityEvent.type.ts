import {UnityPositionInterface} from 'core/interfaces';

export type UnityEventType = {
  MomentumLoaded: () => void;
  TeleportReady: () => void;
  InvalidToken: () => void;
  ExterminateUnity: (topic: string) => void;
  ClickEventDashboard: (id: string) => void;
  ClickEventVideo: (id: string) => void;
  ClickEventEditableObject: (id: string) => void;
  PlasmaClickEvent: (id: string) => void;
  ProfileClickEvent: (id: string, position: UnityPositionInterface) => void;
  Error: (message: string) => void;
};
