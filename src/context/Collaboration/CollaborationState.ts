import CollaborationSpace, {Channel, CollaborationTable} from './CollaborationTypes';

export interface CollaborationState {
  enabled: boolean;
  muted: boolean;
  isTogglingMute: boolean;
  isTogglingCamera: boolean;
  deafen: boolean;
  cameraOff: boolean;
  chatOpen: boolean;
  stageMode: boolean;
  channel: Channel | null;
  collaborationSpace: CollaborationSpace | null;
  collaborationTable: CollaborationTable | null;
  removedCollaborationSpace: boolean;
  audioDevice: MediaDeviceInfo | null;
  speakerDevice: MediaDeviceInfo | null;
  videoDevice: MediaDeviceInfo | null;
  event: string[] | null;
  isLoading: boolean;
}

export const collaborationStateDefaults: CollaborationState = {
  enabled: false,
  muted: false,
  isTogglingMute: false,
  isTogglingCamera: false,
  deafen: false,
  chatOpen: false,
  stageMode: false,
  cameraOff: false,
  collaborationSpace: null,
  collaborationTable: null,
  removedCollaborationSpace: false,
  channel: null,
  audioDevice: null,
  speakerDevice: null,
  videoDevice: null,
  event: null,
  isLoading: false
};
