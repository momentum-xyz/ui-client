import {AttributeValueInterface} from '@momentum-xyz/sdk';

import {VoiceChatActionEnum} from 'api/enums';

export interface VoiceChatActionAttributeInterface extends AttributeValueInterface {
  action: VoiceChatActionEnum;
  userId: string;
}
