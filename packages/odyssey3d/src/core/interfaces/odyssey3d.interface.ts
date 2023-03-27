import {ObjectTransformInterface, Event3dEmitterType} from '@momentum-xyz/core';

export interface Odyssey3dPropsInterface {
  // TODO add also reactive objects, users

  // Input events
  events: Event3dEmitterType;

  // Objects
  onObjectClick: (objectId: string) => void;
  onObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void;

  // click on any user
  onUserClick: (userId: string) => void;

  // Me moving
  onMove: (transform: ObjectTransformInterface) => void;
}
