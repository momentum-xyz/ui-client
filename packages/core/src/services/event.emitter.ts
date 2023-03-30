import EventEmitter from 'eventemitter3';

import {Object3dInterface, Odyssey3dUserInterface, Texture3dInterface} from '../interfaces';

// TODO: Define proper types
// export type Event2dType = {
//   WorldChanged: (value: string) => void;
//   UserChanged: (value: string) => void;
// };

// TODO: Define proper types
export type Event3dType = {
  ObjectCreated: (object: Object3dInterface) => void;
  ObjectChanged: (object: Object3dInterface) => void;
  SetWorld: (value: string) => void;
  ObjectTextureChanged: (texture: Texture3dInterface) => void;

  UserAdded: (user: Odyssey3dUserInterface) => void;
  UserRemoved: (userId: string) => void;

  ObjectEditModeChanged: (objectId: string, isEditOn: boolean) => void;

  // ObjectLockChanged: (objectId: string, isLocked: boolean) => void;
};

// export const Event2dEmitter = new EventEmitter<Event2dType>();
export const Event3dEmitter = new EventEmitter<Event3dType>();

export type Event3dEmitterType = typeof Event3dEmitter;
