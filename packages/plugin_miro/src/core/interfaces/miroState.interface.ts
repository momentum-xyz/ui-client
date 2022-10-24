import {PluginStateInterface} from '@momentum-xyz/sdk';

export interface MiroBoardInterface {
  id: string;
  name: string;
  description: string;
  viewLink: string;
  accessLink: string | null;
  embedHtml: string;
}

export interface MiroStateInterface extends PluginStateInterface {
  board?: MiroBoardInterface;
}
