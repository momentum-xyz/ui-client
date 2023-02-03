import {AttributeValueInterface} from '@momentum-xyz/sdk';

import {UnityPositionInterface} from 'core/interfaces';

export interface SpawnPointAttributeInterface extends AttributeValueInterface {
  value: {
    object: string;
    location: UnityPositionInterface;
    rotation: UnityPositionInterface;
  };
}
