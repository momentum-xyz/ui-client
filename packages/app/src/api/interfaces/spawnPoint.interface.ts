import {AttributeValueInterface} from '@momentum-xyz/sdk';
import {PositionInterface} from '@momentum-xyz/core';

export interface SpawnPointAttributeInterface extends AttributeValueInterface {
  value: {
    object: string;
    location: PositionInterface;
    rotation: PositionInterface;
  };
}
