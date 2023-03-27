import {ObjectTransformInterface, PosbusEmitterType} from '@momentum-xyz/core';

export interface Odyssey3dPropsInterface {
  // TODO add also reactive objects, users

  events: PosbusEmitterType;

  onObjectClick: (objectId: string) => void;
  onMove: (transform: ObjectTransformInterface) => void;
  onUserClick: (userId: string) => void;
}
