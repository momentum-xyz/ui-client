import EventEmitter from 'eventemitter3';

import {Object3dInterface, Texture3dInterface} from '../interfaces';

// TODO: Define proper types
export type Event2dType = {
  WorldChanged: (value: string) => void;
  UserChanged: (value: string) => void;
};

// TODO: Define proper types
export type Event3dType = {
  ObjectCreated: (object: Object3dInterface) => void;
  ObjectChanged: (object: Object3dInterface) => void;
  SetWorld: (value: string) => void;
  ObjectTextureChanged: (texture: Texture3dInterface) => void;
  UserEntered: (value: string) => void;
  UserLeft: (value: string) => void;
};

export const Event2dEmitter = new EventEmitter<Event2dType>();
export const Event3dEmitter = new EventEmitter<Event3dType>();
