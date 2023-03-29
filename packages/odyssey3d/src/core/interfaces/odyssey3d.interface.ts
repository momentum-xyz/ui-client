import {ObjectTransformInterface, Event3dEmitterType} from '@momentum-xyz/core';

export interface Odyssey3dPropsInterface {
  // TODO add also reactive objects, users

  // Input events
  events: Event3dEmitterType;

  // Objects
  onObjectClick: (objectId: string, e?: React.MouseEvent) => void;
  onObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void;

  // click on any user
  onUserClick: (userId: string, e?: React.MouseEvent) => void;

  // Me moving
  onMove: (transform: ObjectTransformInterface) => void;
}
