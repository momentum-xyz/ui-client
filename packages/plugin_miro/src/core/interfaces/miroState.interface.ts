import {PluginStateInterface} from '@momentum-xyz/sdk';
import {MiroBoardInterface} from 'api';

export interface MiroStateInterface extends PluginStateInterface {
  board?: MiroBoardInterface;
}
