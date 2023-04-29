import {
  ObjectTransformInterface,
  Event3dEmitterType,
  TransformNoScaleInterface,
  ClickPositionInterface
} from '@momentum-xyz/core';

export interface Odyssey3dPropsInterface {
  // TODO add also reactive objects, users

  // Input events
  events: Event3dEmitterType;

  // Objects
  onObjectClick: (objectId: string, clickPosition: ClickPositionInterface) => void;
  onObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void;

  // Can be used for clearing gizmo, etc
  onClickOutside: () => void;

  // click on any user
  onUserClick: (userId: string, clickPosition: ClickPositionInterface) => void;

  // Me moving
  onMove: (transform: TransformNoScaleInterface) => void;

  onBumpReady: () => void;
}
