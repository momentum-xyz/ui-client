import {Object3dInterface} from '@momentum-xyz/core';
import {PosbusPort} from '@momentum-xyz/posbus-client';

export interface Odyssey3dPropsInterface {
  controllerPort: PosbusPort;
  objects: Object3dInterface[];
}
