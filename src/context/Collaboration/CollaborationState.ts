import CollaborationSpace, {CollaborationTable} from './CollaborationTypes';

export interface CollaborationState {
  enabled: boolean;
  muted: boolean;
  isTogglingMute: boolean;
  isTogglingCamera: boolean;
  cameraOff: boolean;
  chatOpen: boolean;
  stageMode: boolean;
  collaborationSpace: CollaborationSpace | null;
  collaborationTable: CollaborationTable | null;
  removedCollaborationSpace: boolean;
  audioDevice: MediaDeviceInfo | null;
  videoDevice: MediaDeviceInfo | null;
  isLoading: boolean;
}

export const collaborationStateDefaults: CollaborationState = {
  enabled: false,
  muted: true,
  isTogglingMute: false,
  isTogglingCamera: false,
  chatOpen: false,
  stageMode: false,
  cameraOff: true,
  collaborationSpace: null,
  collaborationTable: null,
  removedCollaborationSpace: false,
  audioDevice: null,
  videoDevice: null,
  isLoading: false
};
