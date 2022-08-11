import {TextMessageType} from 'core/types';

export interface MessageInterface {
  author: string;
  text: string;
  name: string;
  messageType?: TextMessageType;
  date: Date;
}
