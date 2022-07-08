import {CollaborationState} from './CollaborationState';
import {CollaborationSpace, CollaborationTable} from './CollaborationTypes';

export const COLLABORATION_ENABLED_ACTION_UPDATE = 'COLLABORATION_ENABLED_ACTION_UPDATE';
export const COLLABORATION_MUTED_ACTION_UPDATE = 'COLLABORATION_MUTED_ACTION_UPDATE';
export const COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE =
  'COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE';
export const COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE =
  'COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE';
export const COLLABORATION_CHAT_ACTION_UPDATE = 'COLLABORATION_CHAT_ACTION_UPDATE';
export const COLLABORATION_STAGE_MODE_ACTION_UPDATE = 'COLLABORATION_STAGE_MODE_ACTION_UPDATE';
export const COLLABORATION_CAMERA_OFF_ACTION_UPDATE = 'COLLABORATION_CAMERA_OFF_ACTION_UPDATE';
export const COLLABORATION_SPACE_ACTION_UPDATE = 'COLLABORATION_SPACE_ACTION_UPDATE';
export const COLLABORATION_ACTION_UPDATE_AGORA_TOKEN = 'COLLABORATION_ACTION_UPDATE_AGORA_TOKEN';
export const COLLABORATION_SEARCH_TOGGLE = 'COLLABORATION_SEARCH_TOGGLE';
export const COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE = 'COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE';
export const COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE = 'COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE';
export const COLLABORATION_TABLE_UPDATE = 'COLLABORATION_TABLE_UPDATE';
export const COLLABORATION_SPACE_ACTION_REMOVE = 'COLLABORATION_SPACE_ACTION_REMOVE';
export const COLLABORATION_LOADING_UPDATE = 'COLLABORATION_LOADING_UPDATE';

interface CollaborationEnabledAction {
  type: typeof COLLABORATION_ENABLED_ACTION_UPDATE;
  enabled: boolean;
}

interface CollaborationMutedAction {
  type: typeof COLLABORATION_MUTED_ACTION_UPDATE;
  muted: boolean;
}

interface CollaborationIsTogglingMuteAction {
  type: typeof COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE;
  isTogglingMute: boolean;
}

interface CollaborationIsTogglingCameraAction {
  type: typeof COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE;
  isTogglingCamera: boolean;
}

interface CollaborationCameraOffAction {
  type: typeof COLLABORATION_CAMERA_OFF_ACTION_UPDATE;
  cameraOff: boolean;
}

interface CollaborationChatAction {
  type: typeof COLLABORATION_CHAT_ACTION_UPDATE;
  open: boolean;
}

interface CollaborationStageModeAction {
  type: typeof COLLABORATION_STAGE_MODE_ACTION_UPDATE;
  stageMode: boolean;
}

interface CollaborationSpaceAction {
  type: typeof COLLABORATION_SPACE_ACTION_UPDATE;
  collaborationSpace: CollaborationSpace | null;
}

interface CollaborationAudioDeviceAction {
  type: typeof COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE;
  audioDevice: MediaDeviceInfo;
}

interface CollaborationVideoDeviceAction {
  type: typeof COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE;
  videoDevice: MediaDeviceInfo;
}

interface CollaborationTableAction {
  type: typeof COLLABORATION_TABLE_UPDATE;
  collaborationTable: CollaborationTable | null;
}

interface CollaborationRemovedSpaceAction {
  type: typeof COLLABORATION_SPACE_ACTION_REMOVE;
  removedCollaborationSpace: boolean;
}

interface CollaborationLoadingAction {
  type: typeof COLLABORATION_LOADING_UPDATE;
  isLoading: boolean;
}

export type CollaborationActionTypes =
  | CollaborationEnabledAction
  | CollaborationMutedAction
  | CollaborationCameraOffAction
  | CollaborationIsTogglingMuteAction
  | CollaborationIsTogglingCameraAction
  | CollaborationChatAction
  | CollaborationStageModeAction
  | CollaborationSpaceAction
  | CollaborationAudioDeviceAction
  | CollaborationVideoDeviceAction
  | CollaborationTableAction
  | CollaborationRemovedSpaceAction
  | CollaborationLoadingAction;

export const collaborationReducer = (
  CollaborationState: CollaborationState,
  action: CollaborationActionTypes
) => {
  switch (action.type) {
    case COLLABORATION_ENABLED_ACTION_UPDATE:
      CollaborationState.enabled = action.enabled;
      return {...CollaborationState};
    case COLLABORATION_MUTED_ACTION_UPDATE:
      CollaborationState.muted = action.muted;
      return {...CollaborationState};
    case COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE:
      CollaborationState.isTogglingMute = action.isTogglingMute;
      return {...CollaborationState};
    case COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE:
      CollaborationState.isTogglingCamera = action.isTogglingCamera;
      return {...CollaborationState};
    case COLLABORATION_CAMERA_OFF_ACTION_UPDATE:
      CollaborationState.cameraOff = action.cameraOff;
      return {...CollaborationState};
    case COLLABORATION_CHAT_ACTION_UPDATE:
      CollaborationState.chatOpen = action.open;
      return {...CollaborationState};
    case COLLABORATION_STAGE_MODE_ACTION_UPDATE:
      CollaborationState.stageMode = action.stageMode;
      return {...CollaborationState};
    case COLLABORATION_SPACE_ACTION_UPDATE:
      CollaborationState.collaborationSpace = action.collaborationSpace;
      return {...CollaborationState};
    case COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE:
      CollaborationState.audioDevice = action.audioDevice;
      return {...CollaborationState};
    case COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE:
      CollaborationState.videoDevice = action.videoDevice;
      return {...CollaborationState};
    case COLLABORATION_TABLE_UPDATE:
      CollaborationState.collaborationTable = action.collaborationTable;
      return {...CollaborationState};
    case COLLABORATION_SPACE_ACTION_REMOVE:
      CollaborationState.removedCollaborationSpace = action.removedCollaborationSpace;
      return {...CollaborationState};
    case COLLABORATION_LOADING_UPDATE:
      CollaborationState.isLoading = action.isLoading;
      return {...CollaborationState};
    default:
      return {...CollaborationState};
  }
};
