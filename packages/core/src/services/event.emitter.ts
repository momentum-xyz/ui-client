import EventEmitter from 'eventemitter3';

// TODO: Define proper types
export type Event2dType = {
  WorldChanged: (value: string) => void;
  UserChanged: (value: string) => void;
};

// TODO: Define proper types
export type Event3dType = {
  ObjectCreated: (value: string) => void;
  ObjectChanged: (value: string) => void;
  UserEntered: (value: string) => void;
  UserLeft: (value: string) => void;
};

export const Event2dEmitter = new EventEmitter<Event2dType>();
export const Event3dEmitter = new EventEmitter<Event3dType>();
