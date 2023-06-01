import EventEmitter from 'eventemitter3';

import {
  Object3dInterface,
  ObjectTransformInterface,
  Odyssey3dUserInterface,
  Odyssey3dUserTransformInterface,
  SetWorldInterface,
  Texture3dInterface,
  WorldInfoInterface
} from '../interfaces';

// TODO: Define proper types
// export type Event2dType = {
//   WorldChanged: (value: string) => void;
//   UserChanged: (value: string) => void;
// };

// TODO: Define proper types
export type Event3dType = {
  AddObject: (object: Object3dInterface, attachToCamera?: boolean) => void;
  ChangeObject: (object: Object3dInterface) => void;
  RemoveObject: (objectId: string) => void;
  ObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void;
  SetWorld: (world: SetWorldInterface, userId: string) => void;
  ObjectTextureChanged: (texture: Texture3dInterface) => void;

  UserAdded: (user: Odyssey3dUserInterface) => void;
  UserRemoved: (userId: string) => void;
  UsersTransformChanged: (users: Odyssey3dUserTransformInterface[]) => void;

  UserJoinedVoiceChat: (userId: string) => void;
  UserLeftVoiceChat: (userId: string) => void;

  ObjectEditModeChanged: (objectId: string, isEditOn: boolean, showGizmo: boolean) => void;
  DetachObjectFromCamera: (objectId: string) => void;

  SendHighFive: (userId: string) => void;
  ReceiveHighFive: (fromUserId: string) => void;

  TriggerBump: (userId: string) => void;

  MakeScreenshot: () => void;
  StartRecordingVideo: (maxDuration: number) => void;
  StopRecordingVideo: () => void;

  // ObjectLockChanged: (objectId: string, isLocked: boolean) => void;
};

// export const Event2dEmitter = new EventEmitter<Event2dType>();
export const Event3dEmitter = new EventEmitter<Event3dType>();

export type Event3dEmitterType = typeof Event3dEmitter;

export type Universe3dType = {
  WorldsAdded: (worlds: WorldInfoInterface[]) => void;
  WorldSelected: (id: string) => void;
  WorldChanged: (world: WorldInfoInterface) => void;
  UsersAdded: (users: Odyssey3dUserInterface[]) => void;
  UserSelected: (id: string) => void;
  UserChanged: (user: Odyssey3dUserInterface) => void;
};

export const Universe3dEmitter = new EventEmitter<Universe3dType>();

export type Universe3dEmitterType = typeof Universe3dEmitter;
